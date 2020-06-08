var boardGrid = null;
function genYears(grid,yearArray, termArray){
	yearArray.forEach(year => {
		termArray.forEach(term => {
			let col = document.createElement("div");
			col.id = year + term
			col.classList.add("board-column",  "done", "muuri-item", "muuri-item-shown");
			
			let header = document.createElement("div");
			header.classList.add("board-column-header");
			
			let colContent = document.createElement("div");
			colContent.classList.add("board-column-content", "muuri");
			colContent.style.height = '70px'
			colContent.id = year + term + 'colContent';
			let label = document.createTextNode(year + ' ' + term + ' term');
			
			let item = document.createElement("div");
			item.classList.add("board-item", "muuri-item", "muuri-item-shown");
			item.setAttribute("style", 'left: 0px; top: 0px; transform: translateX(0px) translateY(0px); display: block; touch-action: none; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);')
			
			
			let course = document.createElement("div");
			course.classList.add("board-item-content");
			course.setAttribute("style", "opacity: 1; transform: scale(1);")
			
			col.appendChild(header);
			header.appendChild(label)
			col.appendChild(colContent);
			colContent.appendChild(item);
			item.appendChild(course);
			console.log(grid);
			grid.add(col);
		})
	})

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
		colToAttachTo = document.getElementById('JuniorAcolContent');
	} else {
		colToAttachTo = document.getElementById('FreshmanAcolContent');
	}
	console.log(colToAttachTo);
	
	let item = document.createElement("div");
	item.classList.add("board-item", "muuri-item", "muuri-item-shown");
	item.setAttribute("style", 'left: 0px; top: 0px; transform: translateX(0px) translateY(0px); display: block; touch-action: none; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);')
	
	let course = document.createElement("div");
	course.classList.add("board-item-content");
	course.setAttribute("style", "opacity: 1; transform: scale(1);")
	item.appendChild(course);
	colToAttachTo.appendChild(item);
	//console.log(boardGrid);
	//boardGrid.add([item]);
	initMuuri();
	//check if this or next has a problem with overloads
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

function initMuuri(){
	console.log('init murri called');
	var docElem = document.documentElement;
	var kanban = document.querySelector('.kanban-demo');
	var itemContainers = Array.prototype.slice.call(kanban.querySelectorAll('.board-column-content'));
	var columnGrids = [];
	var dragCounter = 0;
	itemContainers.forEach(function (container) {
		var muuri = new Muuri(container, {
			items: '.board-item',
			layoutDuration: 400,
			layoutEasing: 'ease',
			dragEnabled: true,
			dragSort: function () {
			return columnGrids;
			},
			dragSortHeuristics: {
			sortInterval: 0,
			minDragDistance: 0,
			minBounceBackAngle: 0
			},
			dragContainer: document.body,
			dragReleaseDuration: 400,
			dragReleaseEasing: 'ease'
		})
		.on('dragStart', function (item) {
			++dragCounter;
			docElem.classList.add('dragging');
			item.getElement().style.width = item.getWidth() + 'px';
			item.getElement().style.height = item.getHeight() + 'px';
		})
		.on('dragEnd', function (item) {
			if (--dragCounter < 1) {
				docElem.classList.remove('dragging');
			}
		})
		.on('dragReleaseEnd', function (item) {
			item.getElement().style.width = '';
			item.getElement().style.height = '';
			columnGrids.forEach(function (muuri) {
				muuri.refreshItems();
			});
		})
		.on('layoutStart', function () {
			boardGrid.getInstance().refreshItems().layout();
		});
		columnGrids.push(muuri);
	});
}

function initBoardGrid(){
	console.log('init boardGrid called');
	var boardGrid = new Muuri(board, {
		layoutDuration: 400,
		layoutEasing: 'ease',
		dragEnabled: true,
		dragSortHeuristics: {
			sortInterval: 0,
			minDragDistance: 0,
			minBounceBackAngle: 0
		},
		dragStartPredicate: {
			handle: '.board-column-header'
		},
		dragReleaseDuration: 400,
		dragReleaseEasing: 'ease'
	});
	return boardGrid;
}


document.addEventListener('DOMContentLoaded', function () {
	var kanban = document.querySelector('.kanban-demo');
	var board = kanban.querySelector('.board');


	boardGrid = (function () {
		var instance;
	 
		function createInstance() {
			var object = initBoardGrid();
			console.log(object);
			return object;
		}
	 
		return {
			getInstance: function () {
				if (!instance) {
					instance = createInstance();
				}
				return instance;
			}
		};
	})();
	console.log(boardGrid.getInstance());
	
	let button = document.getElementById('entryButton');
	button.onclick = addCourse;
	let endingYear = 2022;
	let yearArray = ['Freshman', 'Sophmore', 'Junior', 'Senior'];
	let termArray = ['A', 'B', 'C', 'D'];
	genYears(boardGrid.getInstance(),yearArray, termArray);		
	initAutoComplete();
	initMuuri(boardGrid);
	
	
	
});