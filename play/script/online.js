import { callServer } from '/dam_haji/include/call_server.js';
import * as boardRenderer from '/dam_haji/include/board_renderer.js';
import * as boardLogic from '/dam_haji/game_logic/board_logic.js';
import { createBoard, createRule } from '/dam_haji/game_logic/board_struct.js';
import { MoveHistory } from '/dam_haji/game_logic/move_history.js';
import { initGameSocket } from '/dam_haji/include/socket_stuff.js';

let tabToSectId = {
    "new_tab": "new_container",
    "games_tab": "games_container",
    "players_tab": "players_container"
};

let socket = null;
let matchmakeData = {
    matchmakeId: "",
    isLoggedIn: false,
    displayName: "",
    user: null
};

export async function onOnlineLoad() {
    socket = await initGameSocket();
    boardRenderer.initRenderer(document.getElementById('canvas_container'));
    boardRenderer.drawBoard();
    boardRenderer.drawPieces(createBoard());

    document.getElementById("new_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    document.getElementById("games_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    document.getElementById("players_tab").addEventListener("click", function(e) {
        activateMeatSect(e.currentTarget.id);
    });
    activateMeatSect("new_tab");
    uiNewGame();

    document.getElementById("findBtn").addEventListener("click", onFindClick);
    document.getElementById("cancelFind").addEventListener("click", onCancelFind);

    let data = await callServer("/dam_haji/server_call/user_call.php", "CHECK_LOGIN");
    let isLoggedIn = data['is_logged_in'] === "true";
    let isGuest = data['is_guest'] === "true";
    if (!isLoggedIn && !isGuest) {
        window.location.href = "/dam_haji/login.php";
    } if (isLoggedIn) {
        matchmakeData.user = data['user'];
        matchmakeData.matchmakeId = data['user']['user_id'];
    } else {
        matchmakeData.matchmakeId = data['guest_id'];
    }
    matchmakeData.displayName = data['display_name'];

    socket.on("found", onFoundGame);
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

async function onFoundGame(data, callback) {
    let formData = new FormData();
    formData.append("game_data", JSON.stringify(data));
    formData.append("matchmake_data", JSON.stringify(matchmakeData));
    let response = await callServer('/dam_haji/server_call/user_call.php', "START_GAME", formData);
    if (response['status'] === "success") {
        window.location.href = "/dam_haji/play/playing.php";
    } else {
        console.log(`server error: ${response['error_log']}`);
    }
}

let waitingFindingStatus = false;
function onFindClick(e) {
    if (waitingFindingStatus) {
        return;
    }
    waitingFindingStatus = true;
    
    socket.timeout(5000).emit("findGame", matchmakeData, function(err, response) {
        waitingFindingStatus = false;
        if (response) {
            uiFinding();
        }        
    });
}

function onCancelFind(e) {
    socket.emit("cancelFind", matchmakeData, function(isCanceled) {
        if (isCanceled) {
            uiNewGame();
        }
    });
}

function uiFinding() {
    tabToSectId['new_tab'] = "finding_container";
    activateMeatSect("new_tab");
    document.getElementById("new_container").style.display = "none";
}

function uiNewGame() {
    tabToSectId['new_tab'] = "new_container";
    activateMeatSect("new_tab");
    document.getElementById("finding_container").style.display = "none";
}