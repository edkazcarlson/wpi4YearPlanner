var boardGrid = null;




function initMuuri(){
	console.log('init murri called');
	var docElem = document.documentElement;
	var kanban = document.querySelector('.boardSection');
	var itemContainers = Array.prototype.slice.call(kanban.querySelectorAll('.board-item-content'));
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
			handle: '.board-item-content'
		},
		dragReleaseDuration: 400,
		dragReleaseEasing: 'ease'
	});
	return boardGrid;
}


document.addEventListener('DOMContentLoaded', function () {
	var kanban = document.querySelector('.boardSection');
	var board = kanban.querySelector('.board');


	boardGrid = (function () {
		var instance;
	 
		function createInstance() {
			var object = initBoardGrid();
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
	



	//initMuuri(boardGrid);
	
	
	
});