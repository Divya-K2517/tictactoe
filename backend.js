class Tile {
    static EMPTY = 0; //empty tile
    static O = 1;
    static X  = 2;
    content;
    spot;
    //board layout:
    //0 1 2
    //3 4 5
    //6 7 8
    constructor(spot){
        this.content = Tile.EMPTY;
        this.spot = spot;
    }
    getContent() {
        return this.content;
    }
    setContent(value) {
        this.content = value;
    }
    getSpot () {
        return this.spot;
    }
    isEmpty() {
        return (this.content === Tile.EMPTY);
    }
    //resetting the tile
    clear() {
        this.content = Tile.EMPTY;
    }
}
class Board {
    tiles;
    latestComputerMove; //keeps track of the last place that the computer made a move
    gameInPlay = true;
    constructor () {
        this.tiles = [];
        //adding all tiles
        for (let i = 0; i < 9; i++) {
            this.tiles.push(new Tile(i))
        }
        console.log(this.tiles);
    }
    getTile(spot) {
        return this.tiles[spot];
    }
    isValidMove(spot) {
        return (this.gameInPlay && this.getTile(spot).isEmpty());
    }
    //player is always X, computer is O
    //make move will automaticlly make the computer move after it
    makeMove(spot) {
        if (!this.isValidMove(spot) && (this.gameInPlay)) { //if the game is not in play another messge about the winner will already be on the screen
            console.log("not a valid move: ", this.isValidMove(spot), this.gameInPlay);
            throw new Error("This spot is not empty");
        }
        if (this.gameInPlay) {
            this.getTile(spot).setContent(Tile.X);
            this.computerMove()
        }

    }
    computerMove() {
        const emptySpots = [];
            for (const tile of this.tiles) {
                if (tile.isEmpty()) {
                    emptySpots.push(tile.getSpot());
                }
            }
        if (emptySpots.length === 0) {return;} //if no spots open return
        //creating a copy of the current board
        let boardCopy = new Board();
        boardCopy.tiles = this.tiles.map(tile => {
            let newTile = new Tile(tile.getSpot());
            newTile.setContent(tile.getContent());
            return newTile;
        });
        let moveMade = false;
        //blocking any possible wins the user has
        for (const spot of emptySpots) {
            boardCopy.getTile(spot).setContent(Tile.X);
            if (boardCopy.checkForWin() == Tile.X) { //if the user will win
                this.getTile(spot).setContent(Tile.O);
                this.latestComputerMove = spot;
                moveMade = true;
                return;
            } 
            boardCopy.getTile(spot).setContent(Tile.O);
            if (boardCopy.checkForWin() == Tile.O) { //if the computer will win
                this.getTile(spot).setContent(Tile.O);
                this.latestComputerMove = spot;
                moveMade = true
                return;
            } 
            boardCopy.getTile(spot).setContent(Tile.EMPTY); //resetting the current spot
        }
        if (!moveMade) { //if no move found, choose randomly
            const chosenIndex = Math.floor(Math.random() * (emptySpots.length));
            const chosenSpot = emptySpots[chosenIndex];
            this.getTile(chosenSpot).setContent(Tile.O);
            this.latestComputerMove = chosenSpot;
            return;
        }
    }
    checkForWin() {
        console.log("checking for win");
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
            [0, 4, 8], [2, 4, 6] //diagonals
        ]
        //
        for (const pattern of winPatterns) {
            //three spots
            const a = pattern[0];
            const b = pattern[1];
            const c = pattern[2];
            //for the winType to be returned:
            //1,2,3 are the rows top to bottom, 4, 5, 6 are the columns left to right
            //7 is left diagonal, 8 is right diagonal
            if (!this.tiles[a].isEmpty() &&
                this.tiles[a].getContent() === this.tiles[b].getContent() &&
                this.tiles[a].getContent() === this.tiles[c].getContent() ) {
                    this.gameInPlay = false;
                    let winType = winPatterns.indexOf(pattern) + 1;
                    return [this.tiles[a].getContent(), winType];
                }
        }
        return [null, null]; //when no winner found
    }
    //checking for tie
    checkForDraw() {
        for (const tile of this.tiles) {
            if (tile.isEmpty()) {
                return false;
            }
        }
        return (!this.checkForWin());
    }
    //returns string representation of the current board
    stringBoard() {
        let result = "";
        for (let i = 0; i < 9; i++) {
            result += this.tiles[i].getContent().toString();
            if (i % 3 == 2) {
                result += "\n"
            }
        }
        return result;
    }
    //clearing board
    reset() {
        this.gameInPlay = true;
        this.tiles.forEach(tile => tile.clear());
    }
}
module.exports = {Tile, Board}

