import * as boardLogic from '/dam_haji/game_logic/board_logic.js';

export class Move {
    constructor(fromX, fromY, toX, toY, type, captures=[]) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.type = type;
        this.captures = captures;
        this.capturedArr = [];
        this.mover = null;

        this.isWhite = null;
    }

    execute(board) {
        let boardArr = boardLogic.stateToArr2D(board.state);
        this.mover = boardArr[this.fromY][this.fromX];
        boardArr[this.toY][this.toX] = this.mover;
        boardArr[this.fromY][this.fromX] = '-';
        for (const capture of this.captures) {
            this.capturedArr.push({
                x: capture.x,
                y: capture.y,
                token: boardArr[capture.y][capture.x]
            });
            boardArr[capture.y][capture.x] = '-';
        }
        board.state = boardLogic.arr2DToState(boardArr);
        this.isWhite = board.isWhiteMove;
        board.isWhiteMove = !board.isWhiteMove;
    }

    undo(board) {
        let boardArr = boardLogic.stateToArr2D(board.state);
        boardArr[this.fromY][this.fromX] = this.mover;
        boardArr[this.toY][this.toX] = '-';
        for (const captured of this.capturedArr) {
            boardArr[captured.y][captured.x] = captured.token;
        }
        board.state = boardLogic.arr2DToState(boardArr);
        board.isWhiteMove = !board.isWhiteMove;
    }

    notation() {
        if (this.type === "MOVE") {
            return `${boardLogic.posNot(this.fromX, this.fromY)}${boardLogic.posNot(this.toX, this.toY)}`;
        } if (this.type === "CAPTURE") {
            let not = `${boardLogic.posNot(this.fromX, this.fromY)}`;
            for (const capture of this.captures) {
                not += `x[${boardLogic.posNot(capture.x, capture.y)}]`;
            }
            return not + `${boardLogic.posNot(this.toX, this.toY)}`;
        } if (this.type === "PROMOTION") {
            return `${boardLogic.posNot(this.fromX, this.fromY)}${boardLogic.posNot(this.toX, this.toY)}=H`;
        }
    }
}