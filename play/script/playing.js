import { callServer } from '/dam_haji/include/call_server.js';
import * as boardRenderer from '/dam_haji/include/board_renderer.js';
import * as boardLogic from '/dam_haji/game_logic/board_logic.js';
import { createBoard, createRule } from '/dam_haji/game_logic/board_struct.js';
import { MoveHistory } from '/dam_haji/game_logic/move_history.js';
import { initGameSocket } from '/dam_haji/include/socket_stuff.js';
import * as boardStruct from '/dam_haji/game_logic/board_struct.js';

let gameData = null;
let matchmakeData = null;
let socket = null;

let inputCanvas;
let legalMoveArr = [];
let activeMoveArr = [];
let moveHistory = new MoveHistory();

let mouseX = -1;
let mouseY = -1;

let tabToSectId = {
    "move_tab": "move_container",
    "chat_tab": "chat_container",
    "analysis_tab": "analysis_container"
};

export async function onPlayingLoad() {
    let response = await callServer('/dam_haji/server_call/user_call.php', "GET_GAME");
    if (!response['game_data']) { // no game found
        window.location.href = "./online.php";
    }
    gameData = response['game_data'];
    if (typeof gameData === 'string') {
        gameData = JSON.parse(gameData);
    }
    matchmakeData = response['matchmake_data'];
    if (typeof matchmakeData === 'string') {
        matchmakeData = JSON.parse(matchmakeData);
    }
    console.log(gameData);
    console.log(matchmakeData);
    setupGame();

    socket = await initGameSocket();
    socket.on("oppMove", onOppMove);

    document.getElementById("black_showing").innerText = gameData.isWhite? gameData.opponent.displayName: matchmakeData.displayName;
    document.getElementById("white_showing").innerText = !gameData.isWhite? gameData.opponent.displayName: matchmakeData.displayName;

    inputCanvas = document.getElementById('input_canvas');
    inputCanvas.addEventListener('mousedown', onMouseDown);
    inputCanvas.addEventListener('mouseup', onMouseUp);
    inputCanvas.addEventListener('mousemove', onMouseMove);

    document.getElementById("move_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    document.getElementById("chat_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    document.getElementById("analysis_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    activateMeatSect("move_tab");

    // document.getElementById("first_move").addEventListener('click', function(e) {
    //     moveHistory.firstMove(board);
    //     endTurn();
    // });
    // document.getElementById("undo").addEventListener('click', function(e) {
    //     moveHistory.undo(board);
    //     endTurn();
    // });
    // document.getElementById("redo").addEventListener('click', function(e) {
    //     moveHistory.redo(board);
    //     endTurn();
    // });
    // document.getElementById("last_move").addEventListener('click', function(e) {
    //     moveHistory.lastMove(board);
    //     endTurn();
    // });

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

function isOurTurn() {
    return gameData.board.isWhiteMove === gameData.isWhite;
}

function setupGame() {
    boardRenderer.initRenderer(document.getElementById('canvas_container'));
    boardRenderer.drawBoard();
    newTurn();
}

function newTurn() {
    if (isOurTurn()) {
        legalMoveArr = boardLogic.getLegalMoves(gameData.board);
    } else {
        legalMoveArr = [];
    }
    boardRenderer.drawPieces(gameData.board);
    boardRenderer.drawMoves(legalMoveArr);
    let moveContainer = document.getElementById('move_container');
    moveContainer.textContent = "";
    drawHistory(moveHistory.getHistory(), moveContainer);
}

function onOppMove(data, callback) {
    let move = boardStruct.createMoveFromNot(data.notation);
    move.execute(gameData.board);
    newTurn();
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

}

function onMouseDown(e) {
    const x = mouseX;
    const y = mouseY;

    for (const move of activeMoveArr) {
        if (x == move.toX && y == move.toY) {
            executeMove(move);
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

function executeMove(move) {
    let moveData = {
        matchmakeData: matchmakeData,
        gameData: gameData,
        notation: move.notation()
    }
    socket.emit("makeMove", moveData, function(response) {
        if (response.isSuccess) {
            move.execute(gameData.board);
            moveHistory.addMove(move);
            newTurn();
        } else {
            console.log("move error: " + response.errorLog);
        }
    });
}