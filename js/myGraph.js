function loadGraph(){
	console.log('loaded')
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
}

function click(){
	console.log('click')
}
window.onload = loadGraph