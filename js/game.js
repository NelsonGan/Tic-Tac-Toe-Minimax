// Board initialisation
function initial_state() {
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]; 
}


// Returns player who has the next turn on a board.
function player(board) {
    // Declaring the count of number
    let x_count = 0;
    let o_count = 0;

    // Iterating through the board
    for (let row=0; row<board.length; row++) {
        for (let cell=0; cell<board[row].length; cell++) {
            if (board[row][cell] == X) {
                x_count += 1;
            }
            else if (board[row][cell] == O) {
                o_count += 1;
            }
        }
    }

    // Return player's turn
    if (o_count >= x_count) {
        return X;
    }
    else {
        return O;
    }

}


// Returns set of all possible actions (i, j) available on the board.
function actions(board) {
    var possible_actions = []

    // Iterating through the board
    for (let row=0; row<board.length; row++) {
        for (let cell=0; cell<board[row].length; cell++) {
            if (board[row][cell] == null) {
                possible_actions.push([row, cell]);
            }
        }
    }

    return possible_actions;
}


// Returns the board that results from making move (i, j) on the board.
function result(board, action) {

    // Create a DEEP copy of board (no modification of original board)
    let copy_board = JSON.parse(JSON.stringify(board));

    // Get player's turn
    let turn = player(copy_board)

    // Retrieving value (i, j)
    let row = action[0]
    let col = action[1]

    // Modifying board
    if (copy_board[row][col] == EMPTY) {
        copy_board[row][col] = turn;
    }
    else {
        console.log("Invalid move!");
    }   

    // Return copied board
    return copy_board
}


// Returns the winner of the game, if there is one.
function winner(board) {
    // Horizontal check
    for (let row=0; row<3; row++) {
        if (board[row][0] == X && board[row][1] == X && board[row][2] == X) {
            return X;
        }
        else if (board[row][0] == O && board[row][1] == O && board[row][2] == O) {
            return O;
        }
    }

    // Vertical check
    for (let column=0; column<3; column++) {
        if (board[0][column] == X && board[1][column] == X && board[2][column] == X) {
            return X;
        }
        else if (board[0][column] == O && board[1][column] == O && board[2][column] == O) {
            return O;
        }
    }

    // Diagonal check
    if (board[0][0] == X && board[1][1] == X && board[2][2] == X) {
        return X;
    }
    else if (board[0][0] == O && board[1][1] == O && board[2][2] == O) {
        return O;
    }
    if (board[0][2] == X && board[1][1] == X && board[2][0] == X) {
        return X;
    }
    else if (board[0][2] == O && board[1][1] ==  O &&board[2][0] == O) {
        return O;
    }

    // If tie or haven't end
    return null;
}


// Returns True if game is over, False otherwise
function terminal(board) {

    // Check if any winner
    let win = winner(board);

    if (win != null) {
        return true;
    }

    // Iterating through the board
    for (let row=0; row<board.length; row++) {
        for (let cell=0; cell<board[row].length; cell++) {
            if (board[row][cell] == null) {
                return false;
            }
        }
    }

    return true;
}


// Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
function utility(board){
    // Winner
    let win = winner(board)

    if (win == X) {
        return 1;
    }
    else if (win == O) {
        return -1;
    }
    else {
        return 0;
    }
}


// Return the max-value of a board
function max_value(board) {
    // If board is in terminal state, return the utility
    if (terminal(board)) {
        return utility(board);
    }

    let value =  Number.NEGATIVE_INFINITY;

    // Iterating through all the possible actions
    let possible_actions = actions(board);

    for (let action=0; action<possible_actions.length; action++) {
        value = Math.max(value, min_value(result(board, possible_actions[action])));
    }

    return value;
} 


// Return the min-value of a board
function min_value(board) {
    // If board is in terminal state, return the utility
    if (terminal(board)) {
        return utility(board);
    }

    let value =  Number.POSITIVE_INFINITY;

    // Iterating through all the possible actions
    let possible_actions = actions(board);
    
    for (let action=0; action<possible_actions.length; action++) {
        value = Math.min(value, max_value(result(board, possible_actions[action])));
    }

    return value;
} 


// Return the optimal action for the current player on the board
function minimax(board) {
    // Terminal check
    if (terminal(board)) {
        return null;
    }

    // Turn check
    let turn = player(board);

    // Possible actions
    let possible_actions = actions(board);

    // First move optimisation
    // Iterating through the board
    let checker = 0;
    for (let row=0; row<board.length; row++) {
        for (let cell=0; cell<board[row].length; cell++) {
            if (board[row][cell] != null) {
                checker += 1;
            }
        }
    }
    
    if (checker == 0) {
        return [0, 0]
    }

    // If max player's turn (X)
    let maxplayervalue = Number.NEGATIVE_INFINITY;
    let max_action = [];

    if (turn == X) {
        for (let action=0; action<possible_actions.length; action++) {
            let minvalue = min_value(result(board, possible_actions[action]));

            if (minvalue > maxplayervalue) {
                maxplayervalue = minvalue;
                max_action = possible_actions[action];
            }
        }    
        
        return max_action;
    }

    // If min player's turn (O)
    let minplayervalue = Number.POSITIVE_INFINITY;
    let min_action = [];

    if (turn == O) {
        for (let action=0; action<possible_actions.length; action++) {
            let maxvalue = max_value(result(board, possible_actions[action]));

            if (maxvalue < minplayervalue) {
                minplayervalue = maxvalue;
                min_action = possible_actions[action];
            }
        }    

        return min_action;
    }
}


// Update game board visually
function updateBoard(board) {
    // Iterating through the board
    for (let row=0; row<board.length; row++) {
        for (let cell=0; cell<board[row].length; cell++) {
            let item = "grid-item-" + row + "-" + cell;
            if (board[row][cell] == X) {
                // Draw X
                document.getElementById(item).innerText = "X";
                document.getElementById(item).style.pointerEvents = "none";
            }
            else if (board[row][cell] == O) {
                // Draw O
                document.getElementById(item).innerText = "O";
                document.getElementById(item).style.pointerEvents = "none";
            }
            else {
                // Draw empty
                document.getElementById(item).innerText = "";
            }
        }
    }
}


// Display selection tab
function retry(board) {
    // Hide selection page and show game page and reset pointerEvents
    document.getElementById("selection").style.display = "flex";
    document.getElementById("content").style.display = "none";
    document.getElementById("title").innerText = "Tic Tac Toe";

    // Reset game board
    return initial_state();   
}


// Display game tab
function playGame(choice) {

    if (choice == O) {
        // Computer play first
        board = computerPlay(board);
    }

    // Hide selection page and show game page
    document.getElementById("content").style.display = "flex";
    document.getElementById("selection").style.display = "none";

    // Enaeble tic tac toe click again
    document.getElementById("tictactoe-grid").style.pointerEvents = null;

    for (let row=0; row<board.length; row++) {
        for (let cell=0; cell<board[row].length; cell++) {
            let item = "grid-item-" + row + "-" + cell;
            document.getElementById(item).style.pointerEvents = null;
        }
    }
}

// Play game (making move)
function play(board, move) {

    // Turn (check before update to know who is player)
    turn = player(board);

    // Updating board
    board = result(board, move);
    updateBoard(board);

    // Check if anyone win (or who win)
    if (terminal(board)) {
        if (utility(board) == 1 && turn == X) {
            // Display message
            document.getElementById("title").innerText = "You won!";
            document.getElementById("tictactoe-grid").style.pointerEvents = "none";
        }
        else if (utility(board) == -1 && turn == O) {
            // Display message
            document.getElementById("title").innerText = "You won!";
            document.getElementById("tictactoe-grid").style.pointerEvents = "none";
        }
        else if (utility(board) == 0) {
            // Display message
            document.getElementById("title").innerText = "Tie!";
            document.getElementById("tictactoe-grid").style.pointerEvents = "none";
        }
        else {
            // Display message
            document.getElementById("title").innerText = "You Lost!";
            document.getElementById("tictactoe-grid").style.pointerEvents = "none";
        }
    }
    else {
        // Computer's move
        board = computerPlay(board);
    }
    return board;
}

function computerPlay(board) {

    // Get optimal move from minimax
    optimal_move = minimax(board);

    // Updating board
    board = result(board, optimal_move);
    updateBoard(board);

    // Turn (check after update to know who is player)
    player(board);

    // Check if anyone win (or who win)
    if (terminal(board)) {
        if (utility(board) == 1 && turn == X) {
            // Display message
            document.getElementById("title").innerText = "You won!";
            document.getElementById("tictactoe-grid").style.pointerEvents = "none";
        }
        else if (utility(board) == -1 && turn == O) {
            // Display message
            document.getElementById("title").innerText = "You won!";
            document.getElementById("tictactoe-grid").style.pointerEvents = "none";
        }
        else if (utility(board) == 0) {
            // Display message
            document.getElementById("title").innerText = "Tie!";
            document.getElementById("tictactoe-grid").style.pointerEvents = "none";
        }
        else {
            // Display message
            document.getElementById("title").innerText = "You Lost!";
            document.getElementById("tictactoe-grid").style.pointerEvents = "none";
        }
    }

    return board;
}


// Add event listener to buttons
// Player X and Player O
let playerXButton = document.getElementById("Xplayer");
let playerOButton = document.getElementById("Oplayer");
playerXButton.addEventListener('click',()=>playGame(X));
playerOButton.addEventListener('click',()=>playGame(O));

// Retry button
let retryButton = document.getElementById("retry");
retryButton.addEventListener('click',()=>{
    board = retry(board);
    updateBoard(board);
});

// All 9 game boxes
let gameBox1 = document.getElementById("grid-item-0-0");
let gameBox2 = document.getElementById("grid-item-0-1");
let gameBox3 = document.getElementById("grid-item-0-2");
let gameBox4 = document.getElementById("grid-item-1-0");
let gameBox5 = document.getElementById("grid-item-1-1");
let gameBox6 = document.getElementById("grid-item-1-2");
let gameBox7 = document.getElementById("grid-item-2-0");
let gameBox8 = document.getElementById("grid-item-2-1");
let gameBox9 = document.getElementById("grid-item-2-2");

gameBox1.addEventListener('click',()=>board=play(board, [0, 0]));
gameBox2.addEventListener('click',()=>board=play(board, [0, 1]));
gameBox3.addEventListener('click',()=>board=play(board, [0, 2]));
gameBox4.addEventListener('click',()=>board=play(board, [1, 0]));
gameBox5.addEventListener('click',()=>board=play(board, [1, 1]));
gameBox6.addEventListener('click',()=>board=play(board, [1, 2]));
gameBox7.addEventListener('click',()=>board=play(board, [2, 0]));
gameBox8.addEventListener('click',()=>board=play(board, [2, 1]));
gameBox9.addEventListener('click',()=>board=play(board, [2, 2]));


// Game 
// Define variables
var X = "X"
var O = "O"
var EMPTY = null

// Initialise Board
var board = initial_state();
updateBoard(board); 