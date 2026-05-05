class Move {
    constructor(fromX, fromY, toX, toY, type, captures=[]) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.type = type;
        this.captures = captures;
        this.captured = [];
    }

    execute(board) {
        
    }

    undo(board) {

    }
}