//Reads the current sudoku grid and returns an array of values
function read_grid() {
    var grid = [];
    for (var i = 0; i < 81; i++) {
        var val = document.getElementById('cell-' + i).value;
        if (is_int(val) && val > 0 && val < 10) val = parseInt(val);
        else val = 0;
        grid.push(val);
    }
    return grid;
}
//Writes a sudoku grid in the HTML page
function write_grid(grid, read_only) {
    for (var i = 0; i < 81; i++) {
        if (grid[i] === 0) document.getElementById('cell-' + i).value = '';
        else {
            document.getElementById('cell-' + i).value = grid[i];
            if (read_only) {
                document.getElementById('cell-' + i).readOnly = true;
                document.getElementById('cell-' + i).classList.add('cell-readonly');
            }
        }
    }
}
//Solve a sudoku grid using the backtracking method
function solution(grid) {
    var new_grid = grid.slice();
    var possible = [];

    for (var i = 0; i < 81; i++) {
        if (grid[i] !== 0) continue;
        var item = {};
        item.index = i;
        item.poss = possible_number(grid, i);
        possible.push(item);
    }
    if (possible.length === 0) return grid;

    possible.sort((a, b) => (a.poss.length > b.poss.length) ? 1 : ((b.poss.length > a.poss.length) ? -1 : 0));

    if (possible[0].poss.length === 0) return grid;
    for (const val of possible[0].poss) {
        new_grid[possible[0].index] = val;
        new_grid = solution(new_grid);
        if (check_completed(new_grid)) return new_grid;
        new_grid = grid.slice();
    }
    return grid;
}
//Returns the list of possible numbers for a square in the sudoku grid
function possible_number(grid, i) {
    var possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    possible = check_row(grid, i, possible);
    possible = check_column(grid, i, possible);
    possible = check_square(grid, i, possible);
    return possible;
}
//Checks the cells of the same square and removes the values already present from the table of possibilities
function check_square(grid, i, possible) {
    for (const j of get_square(i)) {
        if (grid[j] !== 0) possible = remove_from_arr(possible, grid[j]);
    }
    return possible;
}
//Checks the boxes of the same line and removes the values already present from the table of possibilities
function check_row(grid, i, possible) {
    for (const j of get_row(i)) {
        if (grid[j] !== 0) possible = remove_from_arr(possible, grid[j]);
    }
    return possible;
}
//Checks the boxes of the same column and removes the values already present from the table of possibilities
function check_column(grid, i, possible) {
    for (const j of get_column(i)) {
        if (grid[j] !== 0) possible = remove_from_arr(possible, grid[j]);
    }
    return possible;
}
//Checks if a sudoku grid is complete
function check_completed(grid) {
    for (var i = 0; i < 81; i++) {
        if (grid[i] === 0) return false;
    }
    return true;
}
//Checks if a sudoku grid is valid
function valid_grid(grid) {
    var arr = [];

    for (var i = 0; i < 73; i += 9) {
        for (const j of get_row(i)) {
            if (grid[j] === 0) continue;
            if (arr.includes(grid[j])) return false;
            arr.push(grid[j]);
        }
        arr = [];
    }

    for (var i = 0; i < 9; i++) {
        for (const j of get_column(i)) {
            if (grid[j] === 0) continue;
            if (arr.includes(grid[j])) return false;
            arr.push(grid[j]);
        }
        arr = [];
    }

    for (const i of[0, 3, 6, 27, 30, 33, 54, 57, 60]) {
        for (const j of get_square(i)) {
            if (grid[j] === 0) continue;
            if (arr.includes(grid[j])) return false;
            arr.push(grid[j]);
        }
        arr = [];
    }
    return true;
}
//Generates a new sudoku grid with x randomly filled squares
function new_sudoku_old(x) {
    //initialization of grid
    var empty_cells = [];
    for (var i = 0; i < 81; i++) empty_cells.push(i);
    clean();
    var grid = read_grid();
// Random filling of x boxes
    for (var i = 0; i < x; i++) {
        var index, val;
// Choose an empty box and a possible value for this box
        while (1) {
            var previous_grid = grid.slice();
            index = empty_cells[get_rand_int(0, empty_cells.length - 1)];
            val = get_rand_int(1, 9);
            grid[index] = val;
            // If the grid is valid and the solution is complete, we add the value to the grid and move on to the next box
            if (valid_grid(grid) && check_completed(solution(grid))) {
                empty_cells = remove_from_arr(empty_cells, index);
                break;
            }
            grid = previous_grid.slice();
        }
    }
    write_grid(grid, true);
}
//Generate a new sudoku grid with x randomly filled squares
function new_sudoku(x) {
    var empty_cells = [];
    for (var i = 0; i < 81; i++) empty_cells.push(i);
    clean();
    var grid = read_grid();
//random fill
    for (var i = 0; i < x; i++) {
        var index, val;
        while (1) {
            var previous_grid = grid.slice();
            index = empty_cells[get_rand_int(0, empty_cells.length - 1)];
            var possible = possible_number(grid, index);
            if (possible.length === 0) continue;
            val = possible[get_rand_int(0, possible.length - 1)];
            grid[index] = val;
            if (valid_grid(grid) && check_completed(solution(grid))) {
                empty_cells = remove_from_arr(empty_cells, index);
                break;
            }
            grid = previous_grid.slice();
        }
    }
    write_grid(grid, true);
}
//Validate the value entered in a box
function validate_cell_value(id) {
    var element = document.getElementById('cell-' + id);
    if (element.value.length == 0) return true;
    if (!is_int(element.value)) return false;
    var val = parseInt(element.value);
    var possible = [val];
    var grid = read_grid();
    grid[id] = 0;

    if (check_row(grid, id, possible).length === 0) {
        for (const i of get_row(id)) document.getElementById('cell-' + i).classList.add('cell-wrong');
        return false;
    }
    if (check_column(grid, id, possible).length === 0) {
        for (const i of get_column(id)) document.getElementById('cell-' + i).classList.add('cell-wrong');
        return false;
    }
    if (check_square(grid, id, possible).length === 0) {
        for (const i of get_square(id)) document.getElementById('cell-' + i).classList.add('cell-wrong');
        return false;
    }
    return true;
}
//Returns the indices of the boxes of the same line as that of the index passed in parameter
function get_row(i) {
    var res = [];
    var row_num = Math.floor(i / 9);
    for (var j = row_num * 9; j < (row_num * 9 + 9); j++) res.push(j);
    return res;
}
//Returns the indices of the cells of the same column as that of the index passed in parameter
function get_column(i) {
    var res = [];
    var column_num = i % 9;
    for (var j = column_num; j < 81; j += 9) res.push(j);
    return res;
}
//Returns the indices of the boxes of the same square as that of the index passed in parameter
function get_square(i) {
    var res = [];
    var squares = [
        [0, 1, 2, 9, 10, 11, 18, 19, 20],
        [3, 4, 5, 12, 13, 14, 21, 22, 23],
        [6, 7, 8, 15, 16, 17, 24, 25, 26],

        [27, 28, 29, 36, 37, 38, 45, 46, 47],
        [30, 31, 32, 39, 40, 41, 48, 49, 50],
        [33, 34, 35, 42, 43, 44, 51, 52, 53],

        [54, 55, 56, 63, 64, 65, 72, 73, 74],
        [57, 58, 59, 66, 67, 68, 75, 76, 77],
        [60, 61, 62, 69, 70, 71, 78, 79, 80]
    ];

    for (var j = 0; j < 9; j++) {
        if (!squares[j].includes(i)) continue;
        squares[j].forEach(el => { res.push(el) });
    }
    return res;
}

//Clears all box values and makes them editable
function clean() {
    document.getElementById('status').innerHTML = '';
    for (var i = 0; i < 81; i++) {
        document.getElementById('cell-' + i).value = '';
        document.getElementById('cell-' + i).readOnly = false;
        document.getElementById('cell-' + i).classList.remove('cell-readonly');
        document.getElementById('cell-' + i).classList.remove('cell-wrong');
    }
}
// Solve the current sudoku
function solve() {
    document.getElementById('status').innerHTML = '';
    var grid = read_grid();
    if (valid_grid(grid)) {
        grid = solution(grid);
        status = (check_completed(grid)) ? 'Solved' : 'Not solvable';
        document.getElementById('status').innerHTML = status;
        write_grid(grid, false);
    } else {
        document.getElementById('status').innerHTML = 'Input is not valid';
    }
}
// Generate a new easy level sudoku (35 squares filled)
function easy() {
    new_sudoku(35);
}
// Generate a new medium level sudoku (27 squares filled)
function medium() {
    new_sudoku(27);
}
//Generates a new difficult level sudoku (20 squares filled)
function hard() {
    new_sudoku(20);
}
//Validate all grid box values
function validate_cells() {
    for (var i = 0; i < 81; i++) document.getElementById('cell-' + i).classList.remove('cell-wrong-border', 'cell-wrong');
    for (var i = 0; i < 81; i++) {
        if (!validate_cell_value(i)) document.getElementById('cell-' + i).classList.add('cell-wrong-border');
    }
    if (check_completed(read_grid())) document.getElementById('status').innerHTML = 'Solved';
}
// Reset all editable boxes
function reset() {
    for (var i = 0; i < 81; i++) {
        var element = document.getElementById('cell-' + i);
        if (element.readOnly == false) {
            element.value = '';
        }
        element.classList.remove('cell-wrong-border', 'cell-wrong');
    }
    document.getElementById('status').innerHTML = '';
}

// Check if a value is an integer
function is_int(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}
// remove an element from an array
function remove_from_arr(arr, item) {
    var new_arr = [];
    arr.forEach(el => { if (el !== item) new_arr.push(el) });
    return new_arr;
}
// Generate a random integer between two values
function get_rand_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}