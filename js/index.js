let yearArray = ['Freshman', 'Sophmore', 'Junior', 'Senior'];
let termArray = ['A', 'B', 'C', 'D'];
class courseList{
	constructor(grid){
		this.htmlGrid = grid;
		this.creditGrid = [[0,0],[0,0],[0,0],[0,0]];
		console.log(this.creditGrid);
		this.courseGrid = [];
		for (let i = 0 ; i < 4 ; i++){
			let yearArray = []
			for (let j = 0; j < 4 ; j++){
				yearArray.push(new Set());
			}
			this.courseGrid.push(yearArray);
		}
	}
	
	
	posNameToIndex(posName){
		const splitName = posName.split('-');
		const firstIndex = yearArray.indexOf(splitName[0]);
		const secondIndex = termArray.indexOf(splitName[1]);
		return [firstIndex, secondIndex];
	}
	
	
	
	//positions are body ids for course holders in format <year>-<term>-body
	addCourse(course, position){
		this.creditGrid[position[0]][position[1]]+= 1;
		this.validateCredit();
	}
	
	removeCourse(courseName){
		
	}
	
	//positions are body ids for course holders in format <year>-<term>-body
	changeCourse(courseName, oldPosition, newPosition){
		//course change
		let newIndices = this.posNameToIndex(newPosition);
		let oldIndices = this.posNameToIndex(oldPosition);
		this.courseGrid[newIndices[0]][newIndices[1]].add(courseName);
		this.courseGrid[oldIndices[0]][oldIndices[1]].delete(courseName);
		this.validateCourse(courseName, newIndices);
		
		//credit change
		oldIndices[1] /= 2;	
		newIndices[1] /= 2;
		this.creditGrid[newIndices[0]][newIndices[1]] += 1;
		this.creditGrid[oldIndices[0]][oldIndices[1]] -= 1;
		this.validateCredit(newIndices, newPosition);
	}
	
	validateCourse(courseName, location){
		
	}
	
	validateCredit(indices, positionID){
		console.log('validateCredit');
		console.log(indices);
		console.log(positionID);
		//Go through all existing credit warnings and see if the are still valid
		
		//add new credit warnings
		if (this.creditGrid[indices[0]][indices[1]] > 7){
			console.log('too many courses in a semeseter');
			let splitPosId = positionID.split('-')
			let warnings = document.getElementById("Warnings");
			let warnDiv = document.createElement("div");
			warnDiv.id = indices[0] + '-' + indices[1] + '-Warning';
			warnDiv.classList.add("warning");
			let semName = null;
			if (splitPosId[1] == 'A' || splitPosId[1] == 'B'){
				semName = 'A-B';
			} else {
				semName = 'C-D';
			}
			warnDiv.innerText = 'Too many courses for ' + splitPosId[0] + ' ' + semName;
			warnings.appendChild(warnDiv);
		}
	}
	
	loadCourseJson(json){
		this.courseJson = json;
	}
}

function genYears(grid,yearArray, termArray){
	let idList = [];
	yearArray.forEach(year => {
		let yearDiv = document.createElement("div");
		yearDiv.id = year;
		yearDiv.classList.add("yearWrapper");
		
		termArray.forEach(term => {
			let col = document.createElement("div");
			col.id = year + term
			
			
			let header = document.createElement("div");
			header.classList.add("header");
			let label = document.createTextNode(year + ' ' + term + ' term');
			header.appendChild(label);
			
			let body = document.createElement("div");
			body.classList.add("body");
			body.id = year + "-" + term + "-" + 'body';
			
			col.appendChild(header);
			col.appendChild(body);
			
			let course = document.createElement("div");
			course.classList.add("course");
			course.innerHTML = 'SAMPLE';
			
			body.appendChild(course);
			yearDiv.appendChild(col);
			idList.push(body);
		});
		grid.appendChild(yearDiv);
	});
	return idList;
}

async function initAutoComplete(){

	let response = await fetch('data/allCourses.json');
	courses = null;
	if (response.ok){
		courses = await response.json();
	} else {
		alert('Failed to get course data');
	}
	courses = JSON.parse(courses);
	let courseList = []
	let courseKeys = Object.keys(courses);
	var key;
	for (key in courses){
		let thisCourseJSON = JSON.parse(courses[key]);
		let abbr = thisCourseJSON['abbreviation'];
		let lvl = thisCourseJSON['level'];
		let title = thisCourseJSON['title'];
		courseList.push(abbr + ' ' + lvl.toString() + ' ' + title);
	}
	
	new autoComplete({
	selector: '#courseSearcher',
	minChars: 2,
	source: function(term, suggest){
		term = term.toLowerCase();
		var choices = courseList;
		var matches = [];
		for (let i=0; i<choices.length; i++)
			if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
		suggest(matches);
	}
	});
	return courses;
}


function addCourse(coursesJson){

	console.log('add course called');
	let possibleStarts = ['Freshman-A-body', 'Sophmore-A-body', 'Junior-A-body', 'Senior-A-body'];

	let searcher = document.getElementById('courseSearcher');
	//if level is 3 or 4, put junior/senior year with the most likely term
	//1 or 2 put in fresh/soph
	let colToAttachTo = null;
	let level = searcher.value.split(' ')[1]
	let courseYearIndex = null;
	if (level >= 3000 || level < 600){
		courseYearIndex = 2;
	} else {
		courseYearIndex = 0;
	}

	let course = document.createElement("div");
	course.classList.add("course");
	let splitCourse = searcher.value.split(' ');
	let courseName = splitCourse[0] + splitCourse[1] + '\n';
	for (let i = 2; i < splitCourse.length ; i++){
		courseName += splitCourse[i] + ' ';
	}
	course.innerText = courseName;
	try {
		let thisCourseJSON = JSON.parse(coursesJson[splitCourse[0] + splitCourse[1] + '.json']);
		console.log(thisCourseJSON);
		if (!thisCourseJSON['cat1Status']){ //if cat 2
			let startYear = thisCourseJSON['startYear'];
			let startEven = startYear % 2 == 0;
			let gradYear = document.getElementById('gradYear').value == 'True';
			let happensOnSenior = gradYear != startEven;
			if (happensOnSenior){
				courseYearIndex++;
			}
			console.log(happensOnSenior);
		}
		colToAttachTo = document.getElementById(possibleStarts[courseYearIndex]);
		colToAttachTo.appendChild(course);
	} catch (error){
		console.log(error);
		alert("No course with this name exists");
	}
}
	
function deleteCourse(){
	
}
	

function myLoad(){
	let endingYear = 2022;

	let grid = document.getElementById('board');
	let idList = genYears(grid,yearArray, termArray);		
	let button = document.getElementById('entryButton');
	let listManager = new courseList(idList);
	dragula(idList).on('drop', function(e1, target, source){
		listManager.changeCourse(e1.innerText, target.id, source.id);
	});
	
	initAutoComplete().then(function(results){
		button.onclick = function(){
			addCourse(results);
			listManager.loadCourseJson(results);};
	})
}

window.onload = myLoad