var c = document.getElementById("cnvs");
c.width = window.innerWidth;
c.height = window.innerHeight;

var ctx = c.getContext("2d");

const cellSize = 10;
const rowCount = Math.floor(c.width / cellSize);
const colCount = Math.floor(c.height / cellSize);
let isMouseDown = false 


const initCells = () => {
	const density = 0.3;
	let cells = Array.from({ length: colCount }, () =>
		Array.from({ length: rowCount }, () => (Math.random() < density ? 1 : 0))
	);
	let aliveCounters = Array.from({ length: colCount }, () => Array(rowCount).fill(0));
	return [cells, aliveCounters]
}

const ageToColour = (age) => {
	const t = 1 - Math.exp(-age / 15);
	const light = 40 - t * 55;
	return `hsl(0, 0%, ${light}%)`;
};

let [cells, aliveCounters] = initCells()

const getNeighbourIdxs = (i, j) => {
	// j+1, i
	// j-1, i
	// j, i+1
	// j, i-1
	// j+1, i+1
	// j-1, i+1
	// j+1, i-1
	// j-1, i-1
	lastRow = i == rowCount-1
	firstRow = i == 0
	lastCol = j == colCount-1
	firstCol = j == 0
	neighbours = []

	if (!lastCol) {
		neighbours.push([i, j+1])
		if (!lastRow) neighbours.push([i+1, j+1])
		if (!firstRow) neighbours.push([i-1, j+1])
	}
	if (!firstCol) {
		neighbours.push([i, j-1])
		if (!firstRow) neighbours.push([i-1, j-1])
		if (!lastRow) neighbours.push([i+1, j-1])
	}
	if (!lastRow) {
		neighbours.push([i+1, j])
	}
	if (!firstRow) {
		neighbours.push([i-1, j])
	}
	return neighbours
}

const gameOfLife = () => {

	const next_gen = cells.map(row => [...row]);

	for (let i = 0; i < rowCount; i++) {
		for (let j = 0; j < colCount; j++) {


			let neighbours = getNeighbourIdxs(i, j, rowCount, colCount);

			let live_neighbours = neighbours.filter(neighbour => {return cells[neighbour[1]][neighbour[0]] == 1}) 

			if (live_neighbours.length < 2) {
				next_gen[j][i] = 0
			}
			if (cells[j][i] == 1 && live_neighbours.length > 3) {
				next_gen[j][i] = 0
			}
			if (cells[j][i] == 0 && live_neighbours.length == 3) {
				next_gen[j][i] = 1
			}

			aliveCounters[j][i] = next_gen[j][i] == 1 ? aliveCounters[j][i] + 1 : 0;

			ctx.fillStyle = cells[j][i] == 0 ? "#2e2e2e" : ageToColour(aliveCounters[j][i]);
			ctx.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
		}
	}

	cells = next_gen;
	

}

setInterval(gameOfLife, 100)

const drawAliveAt = (x, y) => {
	row = Math.floor(y / cellSize);
	col = Math.floor(x / cellSize);
	const inBounds = row >= 0 && row < colCount && col >= 0 && col < rowCount;

	if (inBounds) {
		neighbours = getNeighbourIdxs(col, row);
		cells[row][col] = 1

		for (let n of neighbours) {
			cells[n[1]][n[0]] = 1
			ctx.fillStyle = cells[n[1]][n[0]] == 0 ? "#2e2e2e" : ageToColour(aliveCounters[n[1]][n[0]]);
			ctx.fillRect(n[0]*cellSize, n[1]*cellSize, cellSize, cellSize);
		} 
	}
}

document.addEventListener('pointerdown', event => {
    isMouseDown = true;
	drawAliveAt(event.clientX, event.clientY)
}, true);

document.addEventListener('pointerup', () => {
    isMouseDown = false;
}, true);

document.addEventListener('pointermove', event => {
    event.preventDefault();
    if (isMouseDown) {
		drawAliveAt(event.clientX, event.clientY)
    }
}, true);
