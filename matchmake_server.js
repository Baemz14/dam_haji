import * as boardLogic from "./game_logic/board_logic.js";
import { Move } from "./game_logic/move.js";
import { createBoard } from "./game_logic/board_struct.js";
import { v4 as uuidv4 } from 'uuid';
import { Server } from "socket.io";
import * as boardStruct from "./game_logic/board_struct.js";

const io = new Server(3000, {
    cors: { origin: "*" } // Allow any website to connect
});
console.log("listening for matchmaking peoples >:)");

io.on("connection", function(socket) {
    let { gameData, matchmakeData } = socket.handshake.query;
    while (typeof gameData === 'string') {
        gameData = JSON.parse(gameData);
    } while (typeof matchmakeData === 'string') {
        matchmakeData = JSON.parse(matchmakeData);
    }
    if (gameData) {
        //console.log(gameData.gameId);
        for (const game of playing) {
            if (game.gameId === gameData.gameId) {
                console.log(`${matchmakeData.displayName} reconneted`);
                if (gameData.isWhite) {
                    game.white.socket = socket;
                } else {
                    game.black.socket = socket;
                }
            }
        }
    }

    socket.on("findGame", function(data, callback) {
        data['socket'] = socket;
        onFindGame(data, callback);
    });
    socket.on("cancelFind", function(data, callback) {
        data['socket'] = socket;
        onCancelFind(data, callback);
    });
    socket.on("makeMove", onMakeMove);
    socket.on("disconnect", function(){
        disconnectSocket(socket);
    });
});

let playing = [];
let matchmakeQ = [];
function onFindGame(data, callback) {
    let response = {
        isMatchmaking: true,
        errorLog: ""
    };
    if (matchmakeQ.length <= 0) {
        matchmakeQ.push(data);
        console.log(`${data.displayName} entered queue, queue length: ${matchmakeQ.length}`);
    } else {
        for (let i = 0; i < matchmakeQ.length; i++) {
            if (matchmakeQ[i].matchmakeId === data.matchmakeId) {
                matchmakeQ[i] = data;
                console.log(`${data.displayName} reentered queue, queue length: ${matchmakeQ.length}`);
                break;
            }
        }
        matchmake(data, matchmakeQ.shift());
    }
    callback(response);
}

function onCancelFind(data, callback) {
    let isCanceled = false;
    for (let i = 0; i < matchmakeQ.length; i++) {
        if (matchmakeQ[i].matchmakeId === data.matchmakeId) {
            console.log(`${matchmakeQ[i].displayName} canceled queue, bye >:)`);
            matchmakeQ.splice(i, 1);
            isCanceled = true;
            break;
        }
    }
    if (callback) {
        callback(isCanceled);
    }
}

function matchmake(p1, p2) {
    let coinFlip = (Math.random() * 2) > 1;
    let white = coinFlip? p1: p2;
    let black = coinFlip? p2: p1;
    let gameData = {
        gameId: uuidv4(),
        white: white,
        black: black,
        board: createBoard()
    };
    white.socket.timeout(5000).emit("found", { 
        isWhite: true, 
        gameId: gameData.gameId, 
        board: gameData.board,
        opponent: { 
            displayName: black.displayName,
            user: black.user 
        }
    });
    black.socket.timeout(5000).emit("found", { 
        isWhite: false,
        gameId: gameData.gameId, 
        board: gameData.board ,
        opponent: {
            displayName: white.displayName,
            user: white.user
        }
    });
    playing.push(gameData);
    console.log(`matcmaked ${white.displayName} and ${black.displayName}`);
}

function onMakeMove(data, callback) {
    let response = {
        isSuccess: false,
        errorLog: "poop"
    };
    let game = getGame(data.gameData.gameId);
    if (game) { // game not found
        if (!validataGameData(game, data.gameData)) {
            console.log(game);
            console.log(data.gameData);
            response.errorLog = "game data passed is not same with server";
        } else if(game.board.isWhiteMove !== data.gameData.isWhite) {
            response.errorLog = "not your fkn turn >:|";
        } else {
            // TODO: want to validate client move
            response.isSuccess = true;
            let opp = data.gameData.isWhite? game.black : game.white;
            opp.socket.emit("oppMove", { notation: data.notation });

            let move = boardStruct.createMoveFromNot(data.notation);
            move.execute(game.board);
        }
    } else {
        response.errorLog = "game not found";
    }
    callback(response);
}

function validataGameData(serverData, clientData) {
    //console.log(`${serverData.board.state} vs ${clientData.board.state} and ${serverData.board.isWhiteMove} vs ${clientData.board.isWhiteMove}`);
    return serverData.board.state === clientData.board.state &&
        serverData.board.isWhiteMove === clientData.board.isWhiteMove;
}

function getGame(gameId) {
    for (const game of playing) {
        if (game.gameId === gameId) {
            return game;
        }
    }
    return null;
}

function disconnectSocket(socket) {
    for (let i = 0; i < matchmakeQ.length; i++) {
        if (matchmakeQ[i].socket.id === socket.id) {
            console.log(`${matchmakeQ[i].displayName} disconnected, removing from queue`);
            matchmakeQ.splice(i, 1);
            break;
        }
    }
    for (let i = 0; i < playing.length; i++) {
        if (
            playing[i].white.socket.id === socket.id ||
            playing[i].black.socket.id === socket.id
        ) {
            // playing disconnected do something
            console.log(`player playing disconnected, do somting`);
        }
    }
}