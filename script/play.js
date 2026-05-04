import { callServer } from '/dam_haji/include/call_server.js';
import * as boardRenderer from '/dam_haji/include/board_renderer.js';
import * as boardLogic from '/dam_haji/include/board_logic.js';
import { createBoard } from '/dam_haji/include/board_struct.js';

let inputCanvas;
let board = createBoard("8/8/5b2/8/1b1b1b1b/4w3/8/2W5");
let legalMoveArr = [];
let activeMoveArr = [];

export async function onPlayLoad() {
    boardRenderer.initRenderer(document.getElementById('canvas_container'));

    legalMoveArr = boardLogic.getLegalMoves(board);
    boardRenderer.drawBoard();
    boardRenderer.drawMoves(legalMoveArr);
    boardRenderer.drawPieces(board);

    inputCanvas = document.getElementById('input_canvas');
    inputCanvas.addEventListener('mousedown', onMouseDown);
    inputCanvas.addEventListener('mouseup', onMouseUp);
    inputCanvas.addEventListener('mousemove', onMouseMove);
}

function onMouseDown(e) {
    const rect = inputCanvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const internalX = (clientX / rect.width) * inputCanvas.width;
    const internalY = (clientY / rect.height) * inputCanvas.height;
    const x = Math.floor(internalX / (inputCanvas.width / 8));
    const y = Math.floor(internalY / (inputCanvas.height / 8));

    for (const move of activeMoveArr) {
        if (x == move.toX && y == move.toY) {
            board = boardLogic.executeMove(board, move);
            legalMoveArr = boardLogic.getLegalMoves(board);
            boardRenderer.drawMoves(legalMoveArr);
            boardRenderer.drawPieces(board);
            break;
        }
    }

    activeMoveArr = [];
    for (const move of legalMoveArr) {
        if (Number(move.fromX) === Number(x) && Number(move.fromY) === Number(y)) {
            activeMoveArr.push(move);
        }
    }
    if (activeMoveArr.length > 0) {
        boardRenderer.activateMoves(activeMoveArr);
    } else {
        boardRenderer.deactivateMoves();
    }
}

function onMouseUp(e) {

}

function onMouseMove(e) {

}