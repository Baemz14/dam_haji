import { callServer } from '/dam_haji/include/call_server.js';
import * as boardRenderer from '/dam_haji/include/board_renderer.js';
import * as boardLogic from '/dam_haji/game_logic/board_logic.js';
import { createBoard } from '/dam_haji/game_logic/board_struct.js';

let inputCanvas;
let board = createBoard();
let legalMoveArr = [];
let activeMoveArr = [];

export async function onPlayLoad() {
    boardRenderer.initRenderer(document.getElementById('canvas_container'));

    boardRenderer.drawBoard();
    boardRenderer.drawPieces(board);
}