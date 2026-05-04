import * as boardStruct from "./board_struct.js";
// moved all these func into board_struct
// the before code dont have that boardStruct namespace dont want to find and add each
const createCapture = boardStruct.createCapture;
const createMove = boardStruct.createMove;
const createPiece = boardStruct.createPiece;
const createRule = boardStruct.createRule;

// #region UTILS
function isOutOfBoard(x, y) {
    return x < 0 || x >= 8 || y <0 || y >= 8;
}

function isAllied(token1, token2) {
    if (typeof token1 === 'boolean' && typeof token2 === 'boolean') {
        return token1 === token2;
    } if (typeof token1 === 'boolean' && typeof token2 === 'string') {
        return token2.toUpperCase() == (token1? "W": "B");
    } if (typeof token1 === 'string' && typeof token2 === 'boolean') {
        return token1.toUpperCase() == (token2? "W": "B");
    } if (typeof token1 === 'string' && typeof token2 === 'string') {
        return token2.toUpperCase() == token1.toUpperCase();
    }
}

function canCapture(token1, token2) {
    if (typeof token1 === 'boolean' && typeof token2 === 'boolean') {
        return token1 !== token2;
    } if (typeof token1 === 'boolean' && typeof token2 === 'string') {
        return token2.toUpperCase() === (token1? "B": "W");
    } if (typeof token1 === 'string' && typeof token2 === 'boolean') {
        return token1.toUpperCase() === (token2? "B": "W");
    } if (typeof token1 === 'string' && typeof token2 === 'string') {
        return token2.toUpperCase() === ((token1.toUpperCase() === "W")? "B": "W");
    }
}

export function stateToArr(boardState) {
    let pieceArr = [];
    let row = 0;
    let col = 0;
    for (const token of boardState) {
        if (token == 'b' || token == 'B' || token == 'w' || token == 'W') {
            pieceArr.push(createPiece(
                token, 
                col, row, 
                token == 'w' || token == 'W',
                token == 'B' || token == 'W'
            ));
            col += 1;
        } else if (token >= '0' && token <= '8') {
            col += Number(token);
        } else if (token == '/' || token == '\\') {
            row += 1;
            col = 0;
        }
    }
    return pieceArr;
}

//TODO: if slow can halve the arr size
function stateToArr2D(boardState) {
    let piece2DArr = new Array(8);
    for (let i = 0; i < 8; i++) {
        piece2DArr[i] = new Array(8).fill('-');
    }
    let row = 0;
    let col = 0;
    for (const token of boardState) {
        if (token == 'b' || token == 'B' || token == 'w' || token == 'W') {
            piece2DArr[row][col] = token;
            col += 1;
        } else if (token >= '0' && token <= '8') {
            col += Number(token);
        } else if (token == '/' || token == '\\') {
            row += 1;
            col = 0;
        }
    }
    return piece2DArr;
}
//TODO: if slow can halve the arr size
function arr2DToState(arr2D) {
    let state = "";
    let skip = 0;
    for (let y = 0; y < arr2D.length; y++) {
        for (let x = 0; x < arr2D[y].length; x++) {
            let token = arr2D[y][x];
            if (token != 'b' && token != 'B' && token != 'w' && token != 'W') {
                skip += 1;
                continue;
            }
            state += skip == 0? "": skip;
            state += token;
            skip = 0;
        }
        state += skip == 0? "": skip;
        state += y==arr2D.length-1? "": "/";
        skip = 0;
    }
    return state;
}
// #endregion

// #region BOARD CALLS
export function executeMove(board, move) {
    let boardArr = stateToArr2D(board.state);
    boardArr[move.toY][move.toX] = boardArr[move.fromY][move.fromX];
    boardArr[move.fromY][move.fromX] = '-';
    for (const capture of move.captures) {
        boardArr[capture.y][capture.x] = '-';
    }
    board.state = arr2DToState(boardArr);
    board.isWhiteMove = !board.isWhiteMove;
    return board;
}
// #endregion

// #region MOVE CALCULATIONS
export function getLegalMoves(board) {
    let legalMoveArr = [];
    for (const piece of stateToArr(board.state)) {
        if (piece.isWhite != board.isWhiteMove) {
            continue;
        }
        for (const movePos of movePositions(piece, board)) {
            legalMoveArr.push(createMove(
                piece.x, piece.y,
                movePos.x, movePos.y,
                "MOVE"
            ));
        }
        let blah = capturePositions(piece, board);
        //console.log(blah);
        legalMoveArr.push(...blah);
    }
    return legalMoveArr;
}

function mockMoveArr2D(boardArr, move) {
    let undoMove = [];
    boardArr[move.toY][move.toX] = boardArr[move.fromY][move.fromX];
    boardArr[move.fromY][move.fromX] = '-';
    for (const capture of move.captures) {
        undoMove.push({
            x: capture.x, y: capture.y,
            token: boardArr[capture.y][capture.x]
        });
        boardArr[capture.y][capture.x] = 'c';
    }
    return undoMove;
}

function undoMockMoveArr2D(boardArr, undoMove) {
    for (const captured of undoMove) {
        boardArr[captured.y][captured.x] = captured.token;
    }
}

// TODO: prototype, can optimize if become slow
function movePositions(piece, board) {
    if (piece.isHaji){
        return hajiMoves(piece, board);
    } else {
        return damMoves(piece, board);
    }
}

function damMoves(piece, board) {
    let movePos = [];
    let forward = piece.isWhite? -1: 1;
    let possibleMoves = [
        { x: piece.x-1, y: piece.y+forward, isValid: true },
        { x: piece.x+1, y: piece.y+forward, isValid: true }
    ];
    for (const piece of stateToArr(board.state)) {
        for (const possibleMove of possibleMoves) {
            if (!possibleMove.isValid) {
                continue;
            } if (isOutOfBoard(possibleMove.x, possibleMove.y)) {
                possibleMove.isValid = false;
                continue;
            } if (piece.x != possibleMove.x || piece.y != possibleMove.y) {
                continue;
            }
            possibleMove.isValid = false;
        }
    }
    for (const possibleMove of possibleMoves) {
        if (!possibleMove.isValid) {
            continue;
        }
        movePos.push({ x: possibleMove.x, y: possibleMove.y });
    }
    return movePos;
}

function hajiMoves(piece, board) {
    let movePos = [];
    return movePos;
}

function capturePositions(piece, board) {
    if (piece.isHaji){
        return hajiCaptures(piece, board);
    } else {
        return damCaptures(piece, board);
    }
}

function hajiCaptures(piece, board) {
    return [];
}

function damCaptures(piece, board) {
    let boardArr = stateToArr2D(board.state);
    return damCaptureRecurse(
        piece.isWhite,
        piece.x, piece.y,
        -1, -1,
        boardArr, board.rule.linkCaptureBehind
    )
}

function damCaptureRecurse(
    isWhite,
    fromX, fromY,
    prevX, prevY, // so we can skip this
    boardArr, canCaptureBackward
) {
    let captures = [];
    let forward = isWhite? -1: 1;
    let captureDir = [
        {x: -1, y: forward}, {x: 1, y: forward}
    ];
    if (canCaptureBackward && prevX != -1) {
        captureDir.push({x: -1 , y: -forward});
        captureDir.push({x: 1 , y: -forward});
    }
    for (const dir of captureDir) {
        let captureX = fromX + dir.x;
        let captureY = fromY + dir.y;
        let landX = captureX + dir.x;
        let landY = captureY + dir.y;
        if (landX == prevX && landY == prevY) {
            continue;
        } if (
            isOutOfBoard(captureX, captureY) ||
            isOutOfBoard(landX, landY)
        ) {
            continue;
        } if (!canCapture(isWhite, boardArr[captureY][captureX])) {
            continue;
        } if ( boardArr[landY][landX] != '-') {
            continue;
        }

        // add capture
        let capture = createMove(
            fromX, fromY,
            landX, landY,
            "CAPTURE",
            [ createCapture (
                captureX, captureY
            ) ]
        );

        let undoMove = mockMoveArr2D(boardArr, capture);
        captures.push(...boardStruct.linkCaptures(capture, damCaptureRecurse(
            isWhite,
            landX, landY,
            fromX, fromY,
            boardArr, canCaptureBackward
        )));
        undoMockMoveArr2D(boardArr, undoMove);
    }
    return captures;
}
// #endregion