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
        //TODO: add input validation
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
    constructor () {
        this.tiles = [];
        //adding all tiles
        for (let i = 0; i < 9; i++) {
            this.tiles.push(new Tile(i))
        }
    }
    getTile(spot) {
        //TODO: add input validation
        return this.tiles[spot];
    }
    isValidMove(spot) {
        return (this.getTile(spot).isEmpty());
    }
    //player is always X, computer is O
    makeMove(spot) {
        if (!this.isValidMove(spot)) {
            //TODO: throw error or smth happens
        }
        this.getTile(spot).setContent(Tile.X);
        //computer move
        if (!this.checkForWin() && !this.checkForDraw()) {
            const emptySpots = [];
            for (const tile of this.tiles) {
                if (tile.isEmpty()) {
                    emptySpots.push(tile.getSpot());
                }
            }
            const chosenSpot = Math.floor(Math.random() * (emptySpots.length));
            this.getTile(chosenSpot).setContent(Tile.O);
        }
    }
    checkForWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
            [0, 4, 8], [2, 4, 6] //diagonals
        ]
        for (const pattern of winPatterns) {
            //three spots
            const a = pattern[0];
            const b = pattern[1];
            const c = pattern[2];
            //if spots match
            if (!this.tiles[a].isEmpty() &&
                this.tiles[a].getContent() === this.tiles[b].getContent() &&
                this.tiles[a].getContent() === this.tiles[c].getContent() ) {
                    console.log("checked for win");
                    return this.tiles[a].getContent();
                }
        }
        console.log("checked for win");
        return null; //when no winner found
    }
    //checking for tie
    checkForDraw() {
        for (const tile of this.tiles) {
            if (tile.isEmpty()) {
                return false;
            }
        }
        return (!this.checkForWin);
    }
    //clearing board
    reset() {
        this.tiles.forEach(tile => tile.clear());
    }
}
module.exports = {Tile, Board}

