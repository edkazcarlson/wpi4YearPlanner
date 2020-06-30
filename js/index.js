let yearArray = ['Freshman', 'Sophmore', 'Junior', 'Senior'];
let termArray = ['A', 'B', 'C', 'D'];
class courseManager{
	constructor(grid, warningManager){
		this.WarningManager = warningManager;
		this.htmlGrid = grid;
		this.creditGrid = [[0,0],[0,0],[0,0],[0,0]];
		this.courseGrid = [];
		this.outOfWPICourses = new Set();
		for (let i = 0 ; i < 4 ; i++){
			let yearArray = []
			for (let j = 0; j < 4 ; j++){
				yearArray.push(new Set());
			}
			this.courseGrid.push(yearArray);
		}
	}
	

	courseNameToIndices(courseName){
		let indices = [];
		for (let i = 0 ; i < 4 ; i++){
			for (let j = 0; j < 4 ; j++){
				if (this.courseGrid[i][j].has(courseName)){
					indices = [i,j];
					break;
				}
			}
		}
		return indices;
	}

	//positions are in format <year>-<term>-body, returns the respective index for the courseGrid
	//ex: Sophmore-B-body would return [1,1]
	posNameToIndex(posName){
		const splitName = posName.split('-');
		const firstIndex = yearArray.indexOf(splitName[0]);
		const secondIndex = termArray.indexOf(splitName[1]);
		return [firstIndex, secondIndex];
	}
	
	//Takes the current courseGrid and makes a single array of all the courses taken in format [department, level]
	getSplitCourseGrid(){
		let gridToReturn = [];
		for (let i = 0 ; i < 4 ; i++){
			for (let j = 0; j < 4 ; j++){
				let term = this.courseGrid[i][j];
				let thisMangager = this;
				term.forEach(function(course){
					let jsonCourse = thisMangager.jsonOfCourse(course);
					let splitCourse = [jsonCourse['abbreviation'], jsonCourse['level']];
					gridToReturn.push(splitCourse);
				});
			}
		}
		this.outOfWPICourses.forEach(function(course){
			let jsonCourse = thisMangager.jsonOfCourse(course);
			let splitCourse = [jsonCourse['abbreviation'], jsonCourse['level']];
			gridToReturn.push(splitCourse);
		});
		return gridToReturn;
	}

	//grabs the json specific to this course
	jsonOfCourse(courseID){
		return this.courseJson[courseID + '.json'];
	}
	
	//positions are body ids for course holders in format <year>-<term>-body
	addCourse(){
		//HTML component

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
				}
				colToAttachTo = document.getElementById(possibleStarts[courseYearIndex]);
				colToAttachTo.appendChild(course);
				this.courseGrid[courseYearIndex][0].add(course.id);
				toCont = true;
			} catch (error){
				alert("No course with this name exists");
			}
			if (toCont){
				this.creditGrid[courseYearIndex][0]+= 1;
				this.validateCredit([courseYearIndex, 0],null);
				this.validateCourse(course.id, [courseYearIndex,0], true);
			}
		}else {
			alert("Course already on planner");
		}
	}
	
	
	//delButton is the DOM element button on the deleted course
	//courseName is the deleted courses name
	removeCourse(delButton, courseName){
		let courseWrapper = delButton.parentElement;
		let courseHolderBody = courseWrapper.parentElement;
		let indices = this.posNameToIndex(courseHolderBody.id);
		this.courseGrid[indices[0]][indices[1]] .delete(courseName);
		indices[1] = indices[1] / 2;
		this.creditGrid[indices[0]][indices[1]] += -1;
		this.removeCourseWarningsStartingWith(courseName);
		courseWrapper.remove();
	}
	
	//positions are body ids for course holders in format <year>-<term>-body
	changeCourse(courseName, oldPosition, newPosition){
		function removeFromOldPos(courseGrid, creditGrid, oldIndices, courseName){
			courseGrid[oldIndices[0]][oldIndices[1]].delete(courseName);
			let term = Math.floor(oldIndices[1]/2);	
			creditGrid[oldIndices[0]][term] -= 1;
		}
		function addToNewPos(courseGrid, creditGrid, newIndices, courseName){
			courseGrid[newIndices[0]][newIndices[1]].add(courseName);
			let term = Math.floor(newIndices[1]/2);
			creditGrid[newIndices[0]][term] += 1;
		}
		let newIndices = this.posNameToIndex(newPosition);
		let oldIndices = this.posNameToIndex(oldPosition);
		
		if (newPosition == 'outOfWPIBody'){
			removeFromOldPos(this.courseGrid, this.creditGrid, oldIndices, courseName);
			this.outOfWPICourses.add(courseName);
			this.removeCourseWarningsEndingWith(courseName, oldIndices);
			this.removeCourseWarningsStartingWith(courseName, oldIndices);
		} else if (oldPosition == 'outOfWPIBody'){
			addToNewPos(this.courseGrid, this.creditGrid, newIndices, courseName)
			this.outOfWPICourses.delete(courseName);
			this.validateCourse(courseName, newIndices, false);
			this.validateCredit(newIndices, oldIndices);
		} else {
			//course change
			removeFromOldPos(this.courseGrid, this.creditGrid, oldIndices, courseName);
			addToNewPos(this.courseGrid, this.creditGrid, newIndices, courseName);
			this.validateCourse(courseName, newIndices, false);
			this.validateCredit(newIndices, oldIndices);
		}
	}
	
	removeCourseWarningsEndingWith(courseName, locIndices){
		let warnings = document.getElementById("CourseWarnings");
		let toDelete = [];
		warnings.childNodes.forEach(warning => {
			let req = warning.id.split("-")[2];
			let courseNeedingReq = warning.id.split("-")[0];
			let needingReqIndices = null;
			for (let i = 0 ; i < 4 ; i++){
				for (let j = 0; j < 4 ; j++){
					let term = this.courseGrid[i][j];
					if (term.has(courseNeedingReq)){
						needingReqIndices = [i,j];
						break;
					}
				}
			}
			if (needingReqIndices == null){
				if (this.outOfWPICourses.has(courseNeedingReq)){
					if (req == courseName){
						toDelete.push(warning.id);
					}
				}
			} else {
				if (req == courseName){
					if (needingReqIndices[0] > locIndices[0] || 
						(needingReqIndices[0] == locIndices[0] && needingReqIndices[1] > locIndices[1])){//if the pre req come before the required
							toDelete.push(warning.id);
					}
				}
			}
		});
		toDelete.forEach(id => {
			document.getElementById(id).style.display = "none";
		});
	}

	//coursename is in format deptlevel
	//location is the id of the body the course was changed or added into
	//first time is whether the course just got added
	validateCourse(courseName, locIndices, firstTime){
		if (firstTime){ //add all the course warnings
			let curCourseJson = this.jsonOfCourse(courseName);
			this.WarningManager.addCourseWarning(courseName, curCourseJson);
		} else { //not the first time
			if (locIndices == "outOfWPIBody"){
				//hide all related course warnings
				this.WarningManager.hideCoursesNeeding(courseName);
				this.WarningManager.hideCoursesNeeded(courseName);
				return;
			}
		}
		let thisCourseManager = this;
		this.WarningManager.courseWarnings.forEach(function(warning){
			if (warning.theRequirement == courseName){
				let needingCourseIndices = thisCourseManager.courseNameToIndices(warning.needingRequirement);
				if (needingCourseIndices[0] > locIndices[0] || (needingCourseIndices[0] == locIndices[0] && needingCourseIndices[1] > locIndices[1])){ 
					console.log("1")
					//hide all course warnings that have the moved course as a requirement if the course was moved before the course requiring it
					thisCourseManager.WarningManager.revealCourseWarning(warning.needingRequirement, courseName, false);
				} else {//reveal all course warnings that have the moved course as a requirement if the course was moved past or to the course requiring it
					console.log("2")
					thisCourseManager.WarningManager.revealCourseWarning(warning.needingRequirement, courseName, true);
				}
			} else if (warning.needingRequirement == courseName){
				let requiredCourseIndices = thisCourseManager.courseNameToIndices(warning.theRequirement);
				if (requiredCourseIndices[0] < locIndices[0] || (requiredCourseIndices[0] == locIndices[0] && requiredCourseIndices[1] < locIndices[1])){ 
					console.log("3")
					//hide all course warnings where the moved course is requiring something it moved past
					thisCourseManager.WarningManager.revealCourseWarning(courseName, warning.theRequirement, false);
				} else { //reveal all course warnings where the moved course went before its requirement
					console.log("4")
					thisCourseManager.WarningManager.revealCourseWarning(courseName, warning.theRequirement, true);
				}
			}
		});
		











		// console.log(locIndices);
		// let splitCourse = courseName.split(' ');
		// //delete earlier course warnings starting with this id 
		// let warnings = document.getElementById("CourseWarnings");
		// this.removeCourseWarningsStartingWith(splitCourse[0]);

		// //delete earlier course warnings that had this as a requirement, but only if this course is coming before what its a req to
		// this.removeCourseWarningsEndingWith(splitCourse[0], locIndices);

		

		// //add new course warnings
		// if (firstTime){
		// 	let curCourseJson = this.jsonOfCourse(splitCourse[0], splitCourse[1]);
		// 	let reqs = curCourseJson['req'];
		// 	reqs.forEach(req => {
		// 		let reqName = req[0] + req[1];
		// 		let found = false;
		// 		if (this.outOfWPICourses.has(reqName)){
		// 			found = true;
		// 		}
		// 		this.courseGrid.forEach(year => {
		// 			year.forEach(term => {
		// 				if (term.has(reqName)){
		// 					found = true;
		// 				}
		// 			});
		// 		});
		// 		if (found == false){
					
		// 			let warnDiv = document.createElement("div");
		// 			warnDiv.id = courseName + '-without-' + reqName+ '-req-Warning';
		// 			warnDiv.innerText = courseName + ' is without recommnded class: ' + reqName;
		// 			warnDiv.classList.add("warning");
		// 			warnings.appendChild(warnDiv);
		// 		}
		// 	});
		// }
	}
	
	//indices is an array of [credit grid year, credit grid semester] of the where the course moved into
	validateCredit(newIndices, oldIndices){
		let warnings = document.getElementById("CreditWarnings");
		if (oldIndices != null){
			let oldHadWarning = false;
			let oldWarningID = null;
			warnings.childNodes.forEach(warning =>{
				let splitWarning = warning.id.split("-");
				if (splitWarning[0] == oldIndices[0] && splitWarning[1] == oldIndices[1]){
					oldHadWarning = true;
					oldWarningID = warning.id;
				}
			});
			if (oldHadWarning){
				if (this.creditGrid[oldIndices[0]][oldIndices[1]] < 8){
					document.getElementById(oldWarningID).style.display = "none";
				}
			}
		}
		
		//add new credit warnings
		if (this.creditGrid[newIndices[0]][newIndices[1]] > 7){
			let newYear = yearArray[newIndices[0]];
			let newTerm = termArray[newIndices[1]];
			let warnDiv = document.createElement("div");
			warnDiv.id = newIndices[0] + '-' + newIndices[1] + '-Credit-Warning';
			warnDiv.classList.add("warning");
			let semName = null;
			if (newTerm[1] == 'A' || newTerm[1] == 'B'){
				semName = 'A-B';
			} else {
				semName = 'C-D';
			}
			warnDiv.innerText = 'Too many courses for ' + newYear[0] + ' ' + semName;
			warnings.appendChild(warnDiv);
		}
	}
	
	//add the json for the courses to this object
	loadCourseJson(json){
		this.courseJson = json;
	}
	
	//courseID is in the form deptLevel
	removeCourseWarningsStartingWith(courseID){
		let warnings = document.getElementById("CourseWarnings");
		let warningsToRemove = [];
		warnings.childNodes.forEach(child => {
			let courseLackingPreReq = child.id.split('-')[0];
			if (courseID == courseLackingPreReq){
				warningsToRemove.push(child.id);
			}
		});
		warningsToRemove.forEach(warningID => {

			document.getElementById(warningID).style.display = "none";
		});
	}
}


function genYears(grid,yearArray, termArray){
	let idList = [];
	let outOfWPICol = document.createElement("div");
	outOfWPICol.id = "outOfWPICol";
	let outOfWPIHeader =  document.createElement("div");
	outOfWPIHeader.classList.add("header");
	let label = document.createTextNode('Courses Taken Outside WPI');
	outOfWPIHeader.appendChild(label);
	
	let body = document.createElement("div");
	body.classList.add("body");
	body.id = "outOfWPIBody";
	
	outOfWPICol.appendChild(outOfWPIHeader);
	outOfWPICol.appendChild(body);
	grid.appendChild(outOfWPICol);
	idList.push(body);

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
			
			// let course = document.createElement("div");
			// course.classList.add("course");
			// course.innerHTML = 'SAMPLE';
			
			// body.appendChild(course);
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
	let courseList = []
	let courseKeys = Object.keys(courses);
	var key;
	console.log(typeof(courses))
	for (key in courses){
		let thisCourseJSON = courses[key];
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

function checkGradReq(){
	let major = document.getElementById("major");
	let majorToReqMap = new Map([['CS', csMajor],['ME', meMajor]]);
	let majorReq = majorToReqMap.get(major.value);
	let gradDOM = document.getElementById("gradReqs");
	gradDOM.innerHTML = '';
	let reqArray = majorReq.canGraduate(listManager.getSplitCourseGrid());
	let reqStr = '';
	if (reqArray.size == 0){
		reqStr = 'Can graduate with this set of courses';
	} else {
		reqArray.forEach(function(req){
			let reqLI = document.createElement("li");
			reqLI.innerText = req;
			gradDOM.appendChild(reqLI);
		})
	}
	let reqDiv = document.getElementById('reqsDiv');
	reqDiv.style.opacity = '1';	
	reqDiv.style.flex = '0 0 260px';
}

	
let listManager;
function myLoad(){
	let warningManager = new WarningManager();
	let endingYear = 2022;
	let grid = document.getElementById('board');
	let idList = genYears(grid,yearArray, termArray);		
	let button = document.getElementById('entryButton');
	listManager = new courseManager(idList, warningManager);
	dragula(idList).on('drop', function(e1, target, source){
		listManager.changeCourse(e1.id, source.id, target.id);
	});
	
	initAutoComplete().then(function(results){
		listManager.loadCourseJson(results);
		button.onclick = function(){
			listManager.addCourse(results);};
	});

}

function majorChange(){
	console.log("clear major");
	let reqs = document.getElementById('gradReqs');
	reqs.innerHTML = '';
	let reqDiv = document.getElementById('reqsDiv');
	reqDiv.style.opacity = '0';	
	reqDiv.style.flex = '0 0 0px';
}
document.getElementById('major').onchange = majorChange;


window.onload = myLoad
majorChange();

