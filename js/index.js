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
	
	//positions are in format <year>-<term>-body, returns the respective index for the courseGrid
	//ex: Sophmore-B-body would return [1,1]
	posNameToIndex(posName){
		const splitName = posName.split('-');
		const firstIndex = yearArray.indexOf(splitName[0]);
		const secondIndex = termArray.indexOf(splitName[1]);
		return [firstIndex, secondIndex];
	}
	
	//grabs the json specific to this course
	jsonOfCourse(courseID){
		return JSON.parse(this.courseJson[courseID + '.json']);
	}
	
	//positions are body ids for course holders in format <year>-<term>-body
	addCourse(){
		//HTML component
		console.log('add course called');

		let searcher = document.getElementById('courseSearcher');
		//if level is 3 or 4, put junior/senior year with the most likely term
		//1 or 2 put in fresh/soph

		let course = document.createElement("div");
		course.classList.add("course");
		let splitCourse = searcher.value.split(' ');
		let courseName = splitCourse[0] + '\n';
		for (let i = 1; i < splitCourse.length ; i++){
			courseName += splitCourse[i] + ' ';
		}
		course.innerText = courseName + '\n';
		course.id = splitCourse[0]; 
		
		let courseFound = false;
		this.courseGrid.forEach(year => {
			year.forEach(term => {
				if (term.has(course.id)){
					courseFound = true;
				}
			});
		});
		
		if (!courseFound){
			let possibleStarts = ['Freshman-A-body', 'Sophmore-A-body', 'Junior-A-body', 'Senior-A-body'];
			let colToAttachTo = null;
			let deleteButton = document.createElement("button");
			let thisCourseList = this;
			deleteButton.onclick = function(){
				thisCourseList.removeCourse(this, course.id);			
			}
			deleteButton.classList.add("deleteButton");
			deleteButton.innerText = 'Delete';
			course.appendChild(deleteButton);
			let courseYearIndex = null;
			let toCont = false;
			try { 
				let thisCourseJSON = this.jsonOfCourse(splitCourse[0]);
				console.log(thisCourseJSON);
				let level = thisCourseJSON.level;
				
				if (level >= 3000 || level < 600){
					courseYearIndex = 2;
				} else {
					courseYearIndex = 0;
				}
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
				this.courseGrid[courseYearIndex][0].add(course.id);
				toCont = true;
			} catch (error){
				console.log(error);
				alert("No course with this name exists");
			}
			if (toCont){
				this.creditGrid[courseYearIndex][0]+= 1;
				this.validateCredit([courseYearIndex, 0],colToAttachTo.id,null );
				this.validateCourse(course.id, colToAttachTo.id);
			}
		}else {
			alert("Course already on planner");
		}
	}
	
	
	
	removeCourse(delButton, courseName){
		let courseWrapper = delButton.parentElement;
		let courseHolderBody = courseWrapper.parentElement;
		let indices = this.posNameToIndex(courseHolderBody.id);
		this.courseGrid[indices[0]][indices[1]] .delete(courseName);
		indices[1] = indices[1] / 2;
		this.creditGrid[indices[0]][indices[1]] += -1;
		console.log(courseName);
		this.removeCourseWarnings(courseName);
		courseWrapper.remove();
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
		oldIndices[1] = Math.floor(oldIndices[1]/2);	
		newIndices[1] = Math.floor(newIndices[1]/2);
		this.creditGrid[newIndices[0]][newIndices[1]] += 1;
		this.creditGrid[oldIndices[0]][oldIndices[1]] -= 1;
		this.validateCredit(newIndices, newPosition,oldPosition);
	}
	
	//coursename is in format deptlevel
	//location is the id of the body the course was changed or added into
	validateCourse(courseName, location){
		let splitCourse = courseName.split(' ');
		//delete earlier course warnings starting with this id 
		let warnings = document.getElementById("CourseWarnings");
		this.removeCourseWarnings(splitCourse[0]);
		//add new course warnings
		
		console.log(splitCourse)
		let curCourseJson = this.jsonOfCourse(splitCourse[0], splitCourse[1]);
		console.log(curCourseJson);
		let reqs = curCourseJson['req'];
		console.log(this.courseGrid);
		reqs.forEach(req => {
			let reqName = req[0] + req[1];
			console.log('reqName=' + reqName);
			let found = false;
			this.courseGrid.forEach(year => {
				year.forEach(term => {
					if (term.has(reqName)){
						found = true;
					}
				});
			});
			if (found == false){
				console.log('did not find pre req');
				
				let warnDiv = document.createElement("div");
				warnDiv.id = courseName + '-without-' + reqName+ '-req-Warning';
				warnDiv.innerText = courseName + ' is without recommnded class: ' + reqName;
				warnDiv.classList.add("warning");
				warnings.appendChild(warnDiv);
			}
		});
	}
	
	//indices is an array of [credit grid year, credit grid semester] of the where the course moved into
	//positionID is the id of the body that the course changed into
	validateCredit(indices, newPositionID, oldPositionID){
		let warnings = document.getElementById("CreditWarnings");
		console.log(warnings.childNodes);	
		console.log(oldPositionID);
		console.log(newPositionID);
		console.log(indices);
		
		
		//add new credit warnings
		if (this.creditGrid[indices[0]][indices[1]] > 7){
			console.log('too many courses in a semeseter');
			let splitPosId = newPositionID.split('-');
			let warnDiv = document.createElement("div");
			warnDiv.id = indices[0] + '-' + indices[1] + '-Credit-Warning';
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
	
	//add the json for the courses to this object
	loadCourseJson(json){
		this.courseJson = json;
	}
	
	//courseID is in the form deptLevel
	removeCourseWarnings(courseID){
		console.log(courseID);
		let warnings = document.getElementById("CourseWarnings");
		console.log(warnings.childNodes);
		let warningsToRemove = [];
		warnings.childNodes.forEach(child => {
			let courseLackingPreReq = child.id.split('-')[0];
			if (courseID == courseLackingPreReq){
				warningsToRemove.push(child.id);
			}
		});
		warningsToRemove.forEach(warningID => {
			warnings.removeChild(document.getElementById(warningID));
		});
	}
	
	
	removeCreditWarnings(courseID){
		console.log(courseID);
		let warnings = document.getElementById("CreditWarnings");
		console.log(warnings.childNodes);
		let warningsToRemove = [];
		warnings.childNodes.forEach(child => {
			let courseLackingPreReq = child.id.split('-')[0];
			if (courseID == courseLackingPreReq){
				warningsToRemove.push(child.id);
			}
		});
		warningsToRemove.forEach(warningID => {
			warnings.removeChild(document.getElementById(warningID));
		});
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
		courseList.push(abbr + lvl.toString() + ' ' + title);
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

	
function deleteCourse(){
	
}
	

function myLoad(){
	let endingYear = 2022;

	let grid = document.getElementById('board');
	let idList = genYears(grid,yearArray, termArray);		
	let button = document.getElementById('entryButton');
	let listManager = new courseList(idList);
	dragula(idList).on('drop', function(e1, target, source){
		listManager.changeCourse(e1.id, source.id, target.id);
	});
	
	initAutoComplete().then(function(results){
		listManager.loadCourseJson(results);
		button.onclick = function(){
			listManager.addCourse(results);};
	})
}

window.onload = myLoad