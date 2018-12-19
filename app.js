let aliveColor = '#3A3';
let deadColor = '#222';
let documentRows = document.getElementById('grid');
let rows = 30;
let cols = 60;
let cellsObj = []; //Our logic array
let cells = []; //Our graphic array
let oldCells = []; //We must compare each cell against the old state, not the new one. Example:
let newCells = [];
let startButton = document.getElementById('start');
let resetButton = document.getElementById('reset');
let gridButton = document.getElementById('show');
let isRunning = false;
let interval = null;
let showBoard = false;

/*
	On [0,0], [0, 1] and [0, 2] we have living cells, the program should keep them all alive and generate one more at [1, 1]
	If we don't, then the program will kill them all after some iterations. Let's see it in details below

	Expected Behavior:
	[0, 0] has 1 neighbors, then it should die
	[0, 1] has 2 neighbors, then it should live
	[0, 2] has 1 neighbors, then it should die
	[1, 2] has 2 alive cells nearby, then it should "revive"

	Problems that could arise:
	[0, 0] dies, so now, [0, 1] says "Hey! I have now 1 neighbor alive! So I die!"
	Then [0, 2] says "Hey! I have now 0 neighbors alive! So I die!" and because no cells are alive now [1, 2] never revives

	Expected:
	+---+---+---+----+---+---+---+
	| 1 | 1 | 1 | -> | 0 | 1 | 0 |
	+---+---+---+----+---+---+---+
	|   |   |   |    |   | 1 |   |
	+---+---+---+----+---+---+---+
	
	Problematic
	+---+---+---+----+---+---+---+----+---+---+---+----+---+---+---+
	| 1 | 1 | 1 | -> | 0 | 1 | 1 | -> | 0 | 0 | 1 | -> | 0 | 0 | 0 |
	+---+---+---+----+---+---+---+----+---+---+---+----+---+---+---+
	|   |   |   |    |   |   |   |    |   |   |   |    |   | 0 |   |
	+---+---+---+----+---+---+---+----+---+---+---+----+---+---+---+

	So, in this case, before updating the cells, we must check all the posibilities on the board, then update ir. That's why we're considering an "old state" board
	and we'll do all comparisons 
*/

var CellController = {
	keepAlive: function(x, y) {
		let livingNeighbors = 0;

		livingNeighbors = this.isTopAlive(x, y) + 
						this.isLeftAlive(x, y) + 
						this.isBottomAlive(x, y) + 
						this.isRightAlive(x, y) + 
						this.isTopLeftCornerAlive(x, y) + 
						this.isTopRightCornerAlive(x, y) + 
						this.isBottomLeftCornerAlive(x, y) + 
						this.isBottomRightCornerAlive(x, y);

		/*console.log('57', 'operations', 
					this.isTopAlive(x, y), 
					this.isLeftAlive(x, y), 
					this.isBottomAlive(x, y), 
					this.isRightAlive(x, y), 
					this.isTopLeftCornerAlive(x, y), 
					this.isTopRightCornerAlive(x, y), 
					this.isBottomLeftCornerAlive(x, y), 
					this.isBottomRightCornerAlive(x, y),
					livingNeighbors)*/
		return livingNeighbors >= 2 && livingNeighbors <= 3;
	},
	reviveCell: function(x, y) {
		let livingNeighbors = 0;

		livingNeighbors = this.isTopAlive(x, y) + 
						this.isLeftAlive(x, y) + 
						this.isBottomAlive(x, y) + 
						this.isRightAlive(x, y) + 
						this.isTopLeftCornerAlive(x, y) + 
						this.isTopRightCornerAlive(x, y) + 
						this.isBottomLeftCornerAlive(x, y) + 
						this.isBottomRightCornerAlive(x, y);

		return livingNeighbors == 3;
	},
	isTopAlive: function(x, y) {
		return x > 0 ? oldCells[x - 1][y].isAlive ? 1 : 0 : 0;
	},
	isLeftAlive: function(x, y) {
		return y > 0 ? oldCells[x][y - 1].isAlive ? 1 : 0 : 0;
	},
	isBottomAlive: function(x, y) {
		return x < (rows - 1) ? oldCells[x + 1][y].isAlive ? 1 : 0 : 0;
	},
	isRightAlive: function(x, y) {
		return y < (cols - 1) ? oldCells[x][y + 1].isAlive ? 1 : 0 : 0;
	},
	isTopLeftCornerAlive: function(x, y) {
		return x > 0 && y > 0 ? oldCells[x - 1][y - 1].isAlive ? 1 : 0 : 0;
	},
	isTopRightCornerAlive: function(x, y) {
		return x > 0 && y < (cols - 1) ? oldCells[x - 1][y + 1].isAlive ? 1 : 0 : 0;
	},
	isBottomLeftCornerAlive: function(x, y) {
		return x < (rows - 1) && y > 0 ? oldCells[x + 1][y - 1].isAlive ? 1 : 0 : 0;
	},
	isBottomRightCornerAlive: function(x, y) {
		return x < (rows - 1) && y < (cols - 1) ? oldCells[x + 1][y + 1].isAlive ? 1 : 0 : 0;
	},
	updateBoard: function() { //This method updates the board based on the cell's state
		//console.log('updateBoard');

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				let cell = document.getElementById('celula-' + i + '-' + j);
				cell.style.backgroundColor = cellsObj[i][j].isAlive ? aliveColor : deadColor;
				cell.style.color = cellsObj[i][j].isAlive ? aliveColor : deadColor;
				/*
					This type of condition is called "ternary" which is like an if-else, but it shortens the code written and makes it more legible
					It's usually used when setting a value to a variable based on some condition, but for program's control and conditions it's still preferred to use an if-else or switch blocks
					The above code is equivalent to:

					if (cellsObj[i][j].isAlive) {
						cell.style.backgroundColor = aliveColor;
					} else {
						cell.style.backgroundColor = deadColor;
					}
				*/
			}
		}
	},
	updateCellsStatus: function() {
		//console.log('updateCellsStatus')

		//In the following lines we copy the current board into our "oldCells" logical array which we'll use to compare against
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				oldCells[i][j].isAlive = cellsObj[i][j].isAlive;
			}
		}

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				newCells[i][j].isAlive = cellsObj[i][j].isAlive ? this.keepAlive(i, j) : this.reviveCell(i, j);
			}
		}

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				cellsObj[i][j].isAlive = newCells[i][j].isAlive;
				oldCells[i][j].isAlive = cellsObj[i][j].isAlive;
			}
		}

		//console.log(cellsObj);

		this.updateBoard();
	},
	updateCellsStatusWhenClicked: function(clickedCell) {
		//console.log('updateCellsStatusWhenClicked');

		let x = clickedCell.attributes['x'].value; //We retrieve the X coord for the clickedCell
		let y = clickedCell.attributes['y'].value; //We retrieve the X coord for the clickedCell

		cellsObj[x][y].isAlive = !cellsObj[x][y].isAlive; //If isAlive == true then isAlive = false, else if isAlive == false then isAlive = true
		this.updateBoard(); //And we update the board with these changes
	},
	drawBoardAndInitialize: function() { //This method draws our initial state board and the cellsObj array initial state
		//console.log('drawBoard');

		let html = ''; //We will use this variable to generate the whole board HTML

		//With the following nested for-loops we create a grid of {rows} x {cols}
		//NOTE: We must be careful with the single and double quotes as it could cause some strange visual errors.
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				html += '<div class="cell" id="celula-' + i + '-' + j + '" x="' + i + '" y="' + j + '">.</div>'; //We declare custom attributes as x and y for each row+col so it's easier to handle them later without spliting the ID
			}
		}
		
		documentRows.innerHTML = html; //We set the HTML generated above so we can use it later with getElementById or getElementsByClassName

		//In these lines we initialize our object array which will track the status (alive / dead) of each cell in the array
		for (let i = 0; i < rows; i++) {
			cellsObj[i] = [];
			cells[i] = [];
			oldCells[i] = [];
			newCells[i] = [];
			for (let j = 0; j < cols; j++) {
				cellsObj[i][j] = {isAlive: false}; //We set the initial state for the cells
				oldCells[i][j] = {isAlive: false}; //We set the initial state for the cells
				newCells[i][j] = {isAlive: false}; //We set the initial state for the cells
				cells[i][j] = document.getElementById('celula-' + i + '-' + j); //We generate our graphic array
				cells[i][j].onclick = function() { //And we set it's controller for each click
					CellController.updateCellsStatusWhenClicked(cells[i][j]);
				}
			}
		}
	},
	initializeButtons: function() {
		startButton.onclick = () => {
			//this.updateCellsStatus(); //This does the "Step by step"
			isRunning = !isRunning;
			startButton.setAttribute("value", isRunning ? "Stop" : "Resume");
			if (!isRunning) {
				//console.log('Stop')
				clearInterval(interval);
			} else {
				//console.log('Start')
				interval = setInterval(function() {
					CellController.updateCellsStatus();
				}, 500);
			}
		}
		
		resetButton.onclick = () => {
			isRunning = false;
			startButton.setAttribute("value", "Start");
			clearInterval(interval);
			
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					cellsObj[i][j].isAlive = false;
				}
			}
			this.updateBoard();
		}

		gridButton.onclick = () => {
			showBoard = !showBoard;

			show.setAttribute("value", showBoard ? "Hide grid" : "Show grid");

			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					cells[i][j].style.border = showBoard ? "0.1px solid #033" : "none";
				}
			}
		}
	},
	init: function() { //This is the first method called from the HTML and initializes the board
		//console.log('init');
		this.drawBoardAndInitialize();
		this.updateBoard();
		this.initializeButtons();
	}
}



