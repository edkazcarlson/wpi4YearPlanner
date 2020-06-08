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
			body.id = year + term + 'body';
			
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
}


function addCourse(){
	//let boardGrid = initBoardGrid();
	console.log('add course called');
	let searcher = document.getElementById('courseSearcher');
	//if level is 3 or 4, put junior/senior year with the most likely term
	//1 or 2 put in fresh/soph
	let colToAttachTo = null;
	let level = searcher.value.split(' ')[1]
	if (level >= 3000){
		colToAttachTo = document.getElementById('JuniorAbody');
	} else {
		colToAttachTo = document.getElementById('FreshmanAbody');
	}
	console.log(colToAttachTo);

	let course = document.createElement("div");
	course.classList.add("course");
	course.innerHTML = searcher.value;
	let splitCourse = searcher.value.split(' ');
	let courseName = splitCourse[0] + splitCourse[1] + '\n';
	for (let i = 2; i < splitCourse.length ; i++){
		courseName += splitCourse[i];
	}
	course.innerText = courseName;
	colToAttachTo.appendChild(course);
}
	
	

function myLoad(){
	let endingYear = 2022;
	let yearArray = ['Freshman', 'Sophmore', 'Junior', 'Senior'];
	let termArray = ['A', 'B', 'C', 'D'];
	let grid = document.getElementById('board');
	let idList = genYears(grid,yearArray, termArray);		
	let button = document.getElementById('entryButton');
	button.onclick = addCourse;
	
	
	initAutoComplete();
	dragula(idList);
}

window.onload = myLoad