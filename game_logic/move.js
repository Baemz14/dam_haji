import * as boardLogic from './board_logic.js';

export class Move {
    constructor(fromX, fromY, toX, toY, captures=[], isPromotion = false) {
        if (typeof captures === 'string') {
            throw new Error("captures cannot be string");
        }
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.captures = captures;
        this.capturedArr = [];
        this.isPromotion = isPromotion;

        this.mover = null;
        this.isWhite = null;
        this.isEndingMove = false;
    }

    execute(board) {
        let boardArr = boardLogic.stateToArr2D(board.state);
        this.mover = boardArr[this.fromY][this.fromX];
        if (this.isPromotion) {
            this.mover = this.mover.toUpperCase();
        }
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
        this.isEndingMove = boardLogic.gameState(board) !== "ONGOING";
    }

    undo(board) {
        if (this.isPromotion) {
            this.mover = this.mover.toLowerCase();
        }
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
        let not = `${boardLogic.posNot(this.fromX, this.fromY)}`;
        for (const capture of this.captures) {
            not += `x[${boardLogic.posNot(capture.x, capture.y)}]`;
        }
        return not + `${boardLogic.posNot(this.toX, this.toY)}${this.isPromotion? "=H":""}${this.isEndingMove? "#":""}`;
    }
}