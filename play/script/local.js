import { callServer } from '/dam_haji/include/call_server.js';
import * as boardRenderer from '/dam_haji/include/board_renderer.js';
import * as boardLogic from '/dam_haji/game_logic/board_logic.js';
import * as boardStruct from '/dam_haji/game_logic/board_struct.js';
import { MoveHistory } from '/dam_haji/game_logic/move_history.js';
// for old codes
let createBoard = boardStruct.createBoard;
let createRule = boardStruct.createRule;

let inputCanvas;
let board = createBoard();
let legalMoveArr = [];
let activeMoveArr = [];
let moveHistory = new MoveHistory();

let mouseX = -1;
let mouseY = -1;

let tabToSectId = {
    "move_tab": "move_container",
    "settings_tab": "settings_container",
    "analysis_tab": "analysis_container"
};

export function onLocalLoad() {
    boardRenderer.initRenderer(document.getElementById('canvas_container'));
    
    legalMoveArr = boardLogic.getLegalMoves(board);
    boardRenderer.drawBoard();

    inputCanvas = document.getElementById('input_canvas');
    inputCanvas.addEventListener('mousedown', onMouseDown);
    inputCanvas.addEventListener('mouseup', onMouseUp);
    inputCanvas.addEventListener('mousemove', onMouseMove);

    document.getElementById("move_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    document.getElementById("settings_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    document.getElementById("analysis_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    activateMeatSect("move_tab");

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

    document.getElementById("restart_game").addEventListener("click", function(e) {
        setupGame();
    });

    document.getElementById("forceCaptureMax").addEventListener("click", function(e) {
        if (e.currentTarget.checked) {
            document.getElementById("noCaptureDie").checked = false;
        }
    });
    document.getElementById("noCaptureDie").addEventListener("click", function(e) {
        if (e.currentTarget.checked) {
            document.getElementById("forceCaptureMax").checked = false;
        }
    });

    setupGame();
}

function setupGame() {
    let startState = document.getElementById("startPos").value;
    let isWhiteMove = document.getElementById("whiteMove").check;
    let playerTime = document.getElementById("playerTime").value;
    let linkCapBehind = document.getElementById("linkCaptureBehind").checked;
    let forceCaptureMax = document.getElementById("forceCaptureMax").checked;
    let noCaptureDie = document.getElementById("noCaptureDie").checked;
    let flyingHaji = document.getElementById("flyingHaji").checked;
    let flyingHajiCapture = document.getElementById("flyingHajiCapture").checked;
    let drawTurns = document.getElementById("drawTurns").value;

    board = createBoard(
        startState,
        isWhiteMove,
        createRule(playerTime*60, linkCapBehind, forceCaptureMax, noCaptureDie, flyingHaji, flyingHajiCapture, drawTurns)
    );
    moveHistory.restart();
    endTurn();
}

function activateMeatSect(tabId) {
    Object.entries(tabToSectId).forEach(([key, value]) => {
        if (key === tabId) {
            document.getElementById(key).classList.add("active");
            document.getElementById(value).style.display = "";
        } else {
            document.getElementById(key).classList.remove("active");
            document.getElementById(value).style.display = "none";
        }
    });
}

function endTurn() {
    legalMoveArr = boardLogic.getLegalMoves(board);
    updateUI();
}

function updateUI() {
    boardRenderer.drawMoves(legalMoveArr);
    boardRenderer.drawPieces(board);

    let moveContainer = document.getElementById('move_container');
    moveContainer.textContent = "";
    drawHistory(moveHistory.getHistory(), moveContainer);
}

function createBranchCont() {
    const cont = document.createElement("div");
    cont.classList.add("variation-block");
    return cont;
}

function drawHistory(histoyArr, container) {
    for (const turn of histoyArr) {
        drawRow(turn, container);
    }
}

function drawRow(turn, container) {
    let newCol = document.createElement("span");
    newCol.classList.add("move-item");    
    newCol.innerHTML = `
        <span class="m-num">${turn.turn}.</span>
        <span class="m-white">${turn.white}</span>
        <span class="m-black">${turn.black}</span>
    `;
    container.appendChild(newCol);

    let spanW = newCol.querySelector(".m-white");
    let spanB = newCol.querySelector(".m-black");
    if (turn.isWhiteActive) {
        spanW.classList.add("active-move");
    } if (turn.isBlackActive) {
        spanB.classList.add("active-move");
    } if (turn.whiteRef) {
        spanW.addEventListener('click', function() {
            onMoveClick(turn.whiteRef, spanW);
        });
    } if (turn.blackRef) {
        spanB.addEventListener('click', function() {
            onMoveClick(turn.blackRef, spanB);
        });
    }

    //now doing the variations
    for (const branch of turn.variations) {
        let branchCont = createBranchCont();
        container.appendChild(branchCont);
        drawHistory(branch, branchCont);
    }
}

function onMoveClick(moveNode, sender) {
    moveHistory.goToNode(moveNode, board);
    endTurn();
}

function onMouseDown(e) {
    const x = mouseX;
    const y = mouseY;

    for (const move of activeMoveArr) {
        if (x == move.toX && y == move.toY) {
            move.execute(board);
            console.log(move);
            console.log(boardStruct.createMoveFromNot(move.notation()));
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
    const rect = inputCanvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const internalX = (clientX / rect.width) * inputCanvas.width;
    const internalY = (clientY / rect.height) * inputCanvas.height;
    mouseX = Math.floor(internalX / (inputCanvas.width / 8));
    mouseY = Math.floor(internalY / (inputCanvas.height / 8));

    let isOverMove = false;
    for (const move of activeMoveArr) {
        if (mouseX == move.toX && mouseY == move.toY) {
            boardRenderer.hoverCapture(move);
            isOverMove = true;
            break;
        }
    }
    if (!isOverMove) {
        boardRenderer.clearCapture();
    }
}