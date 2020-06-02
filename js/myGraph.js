function loadGraph(){
	
	var cy = cytoscape({
	container: document.getElementById('cy'),
	elements: [
	{ data: { id: 'a' } },
	{ data: { id: 'b' } },
	{
		data: {
		id: 'ab',
		source: 'a',
		target: 'b'
		}
	}]
	});
	cy.resize()
	let button = document.getElementById("entryButton")
	button.onclick = function(){
		buttonClick(cy)
	}
	let searcher = attachAutoComp();
}

function buttonClick(cy){
	let searcher = document.getElementById('courseSearcher');
	console.log(searcher.value)
	cy.add({group: 'nodes',
	data: {id: 'added'},
	position:  {x:  screen.width/2 , y: screen.width/2}
	});
}

function attachAutoComp(){
	var myAuto = new autoComplete({
	selector: '#courseSearcher',
	minChars: 2,
	source: function(term, suggest){
		term = term.toLowerCase();
		var choices = ['ActionScript', 'AppleScript', 'Asp'];
		var matches = [];
		for (i=0; i<choices.length; i++)
			if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
		suggest(matches);
	}
});
	return myAuto;
}

window.onload = loadGraph