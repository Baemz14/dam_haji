import { callServer } from '/dam_haji/include/call_server.js';
import * as boardRenderer from '/dam_haji/include/board_renderer.js';
import * as boardLogic from '/dam_haji/game_logic/board_logic.js';
import { createBoard } from '/dam_haji/game_logic/board_struct.js';
import { MoveHistory } from '/dam_haji/game_logic/move_history.js';

let inputCanvas;
let board = createBoard();
let legalMoveArr = [];
let activeMoveArr = [];
let moveHistory = new MoveHistory();


export function onLocalLoad() {
    boardRenderer.initRenderer(document.getElementById('canvas_container'));
    
    legalMoveArr = boardLogic.getLegalMoves(board);
    boardRenderer.drawBoard();
    boardRenderer.drawMoves(legalMoveArr);
    boardRenderer.drawPieces(board);

    inputCanvas = document.getElementById('input_canvas');
    inputCanvas.addEventListener('mousedown', onMouseDown);
    inputCanvas.addEventListener('mouseup', onMouseUp);
    inputCanvas.addEventListener('mousemove', onMouseMove);

    let moveTab = document.getElementById("move_tab");
    let settingsTab = document.getElementById("settings_tab");
    let analysisTab = document.getElementById("analysis_tab");
    moveTab.addEventListener("click", function(e) {
        if(!moveTab.classList.contains("active")) {
            moveTab.classList.add("active");
        }
        settingsTab.classList.remove("active");
        analysisTab.classList.remove("active");
    });
    settingsTab.addEventListener("click", function(e) {
        if(!settingsTab.classList.contains("active")) {
            settingsTab.classList.add("active");
        }
        moveTab.classList.remove("active");
        analysisTab.classList.remove("active");
    });
    analysisTab.addEventListener("click", function(e) {
        if(!analysisTab.classList.contains("active")) {
            analysisTab.classList.add("active");
        }
        settingsTab.classList.remove("active");
        moveTab.classList.remove("active");
    });

    document.getElementById("first_move").addEventListener('click', function(e) {
        moveHistory.firstMove(board);
        endTurn();
    });
    document.getElementById("undo").addEventListener('click', function(e) {
        moveHistory.undo(board);
        endTurn();
    });
    document.getElementById("redo").addEventListener('click', function(e) {
        moveHistory.redo(board);
        endTurn();
    });
    document.getElementById("last_move").addEventListener('click', function(e) {
        moveHistory.lastMove(board);
        endTurn();
    });
}

function endTurn() {
    legalMoveArr = boardLogic.getLegalMoves(board);
    updateUI();
}

function updateUI() {
    boardRenderer.drawMoves(legalMoveArr);
    boardRenderer.drawPieces(board);

    let history = [];
    for (const histor of moveHistory.getHistoryFlat()) {
        history[histor.depth] ??=  [];
        history[histor.depth].push(histor);
    }
    console.log(history);
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
            move.execute(board);
            moveHistory.addMove(move);
            endTurn();
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