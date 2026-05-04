import * as boardLogic from '/dam_haji/include/board_logic.js';

//TODO: add layer to canvas in array, and have this file store the canvases
let canvasArr = [];
let layer = Object.freeze({
    board: 0,
    move: 1,
    activatedMove: 2,
    piece: 3,
    holding: 4,
    input: 5
});

let blackColor = '#769656';
let whiteColor = '#eeeed2';
let moveColor = '#baca4459';
let activatedColor = '#baca44';
let captureColor = '#d98d8d';
let moveToColor = '#00000054';
let executedColor = '#8bacf2';

let spritesheet = new Image();

export function initRenderer(canvas_container) {
    let i = 0;
    for (const canvas of canvas_container.children) {
        canvasArr.push(canvas);
        canvas.style.background = "transparent";
        canvas.style.zIndex = i;
        i += 1;
    }

    spritesheet.src = '/dam_haji/resources/pieces_spritesheet.png';
}

export function drawBoard() {
    let canvas = canvasArr[layer.board];
    let canvasCtx = canvas.getContext('2d');

    let squareW = Math.floor(canvas.width / 8.0);
    let squareH = Math.floor(canvas.height / 8.0);
    for (let i = 0; i < 8*8; i++) {
        let x = i % 8;
        let y = Math.floor(i / 8.0);

        canvasCtx.fillStyle = (x+y)%2 == 0? whiteColor: blackColor;
        canvasCtx.fillRect(
            x*squareW, y*squareH,
            squareW, squareH
        );
    }

    let fontSize = Math.floor(squareW * 0.2); 
    canvasCtx.font = `bold ${fontSize}px Arial`;
    canvasCtx.textBaseline = "middle";
    canvasCtx.textAlign = "center";
    let paddingRate = 0.85;

    for (let i = 0; i < 8; i++) {
        canvasCtx.fillStyle = i%2==0? whiteColor: blackColor;

        let letter = String.fromCharCode(97 + i); 
        let lx = (i * squareW) + (squareW*paddingRate);
        let ly = canvas.height - (squareH*(1-paddingRate));
        canvasCtx.fillText(letter, lx, ly);

        let number = (i+1).toString();
        let nx = squareW*(1-paddingRate);
        let ny = canvas.height - (i * squareH) - (squareH*paddingRate);
        canvasCtx.fillText(number, nx, ny);
    }
}

export function drawMoves(legalMoveArr) {
    let canvas = canvasArr[layer.move];
    let canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    let squareW = Math.floor(canvas.width / 8.0);
    let squareH = Math.floor(canvas.height / 8.0);

    for (const move of legalMoveArr) {
        let x = move.fromX*squareW;
        let y = move.fromY*squareH;
        canvasCtx.fillStyle = moveColor;
        canvasCtx.fillRect(x, y, squareW, squareH);
    }    
}

export function drawPieces(board) {
    let canvas = canvasArr[layer.piece]
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    let pieceArr = boardLogic.stateToArr(board.state);
    for (const piece of pieceArr) {
        drawPiece(piece);
    }
}

function drawPiece(piece) {
    let canvas = canvasArr[layer.piece];

    let squareW = Math.floor(canvas.width / 8.0);
    let squareH = Math.floor(canvas.height / 8.0);
    let x = piece.x*squareW;
    let y = piece.y*squareH;

    let spriteSize = 256;
    let spriteX = piece.isHaji? spriteSize: 0;
    let spriteY = piece.isWhite? 0: spriteSize;

    let canvasCtx = canvas.getContext('2d');
    canvasCtx.drawImage(
        spritesheet,
        spriteX, spriteY, spriteSize, spriteSize,
        x, y, squareW, squareH
    );
}

export function activateMoves(moves) {
    let canvas = canvasArr[layer.activatedMove];
    let canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    let squareW = Math.floor(canvas.width / 8.0);
    let squareH = Math.floor(canvas.height / 8.0);

    for (const move of moves) {
        canvasCtx.fillStyle = activatedColor;
        canvasCtx.fillRect(
            move.fromX*squareW, 
            move.fromY*squareH, 
            squareW, 
            squareH
        );
            
        if (move.type == "MOVE") {
            canvasCtx.beginPath();
            canvasCtx.arc(
                move.toX*squareW + (squareW/2),
                move.toY*squareH + (squareH/2), 
                squareH*0.2, 
                0, 
                2 * Math.PI
            );
            canvasCtx.fillStyle = moveToColor;
            canvasCtx.fill();
        }

        else if (move.type == "CAPTURE") {
            canvasCtx.beginPath();
            canvasCtx.arc(
                move.toX*squareW + (squareW/2),
                move.toY*squareH + (squareH/2), 
                squareH*0.2, 0, 2 * Math.PI
            );
            canvasCtx.fillStyle = moveToColor;
            canvasCtx.fill();
            for (const capture of move.captures) {
                let captureX = capture.x*squareW;
                let captureY = capture.y*squareH;
    
                canvasCtx.fillStyle = captureColor;
                canvasCtx.fillRect(captureX, captureY, squareW, squareH);
            }
        }
    }
}

export function deactivateMoves() {
    let canvas = canvasArr[layer.activatedMove];
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

export function drawMoveExecute(canvas, move) {

}