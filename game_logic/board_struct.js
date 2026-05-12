import { Move } from "./move.js";
import * as boardLogic from "./board_logic.js";

export function createBoard(
    state = "1b1b1b1b/b1b1b1b1/1b1b1b1b/8/8/w1w1w1w1/1w1w1w1w/w1w1w1w1",
    isWhiteMove = true,
    rule = createRule ()
) {
    return {
        state: state,
        isWhiteMove: isWhiteMove,
        rule: rule,
        isEnded: false
    };
}

export function createCapture(x, y) {
    return {
        x: x,
        y: y
    };
}

// moved from a struct to a Move command class
// export function createMove(fromX, fromY, toX, toY, type, captures=[]) {
//     return {
//         fromX: fromX, fromY: fromY,
//         toX: toX, toY: toY,
//         type: type,
//         captures: captures
//     };
// }
export function createMove(fromX, fromY, toX, toY, captures=[], isPromotion) {
    return new Move(
        fromX, fromY, toX, toY, captures, isPromotion
    );
}

export function createMoveFromNot(notation) {
    if (notation.length < 4) {
        return null;
    }
    let fromNot = notation.slice(0, 2);
    notation = notation.slice(2);
    let toNot = notation.slice(-2);
    notation = notation.slice(0, -2);
    let isPromotion = false;
    if (toNot === "=H") {
        isPromotion = true;
        toNot = notation.slice(-2);
        notation = notation.slice(0, -2);
    }
    let captures = [];
    if (notation.length > 4) {
        for (const captureNot of notation.split("x")) {
            let capture = boardLogic.notPos(captureNot.slice(1, -1));
            if (capture.x === -1 || capture.y === -1) {
                continue;
            }
            captures.push(createCapture(capture.x, capture.y));
        }        
    }
    let fromPos = boardLogic.notPos(fromNot);
    let toPos = boardLogic.notPos(toNot);
    return new Move (
        fromPos.x, fromPos.y,
        toPos.x, toPos.y,
        captures,
        isPromotion
    );
}

export function linkCaptures(capture, captures) {
    if (captures == null || captures.length <= 0) {
        return [capture];
    }
    let linked = [];
    for (const capture2 of captures) {
        linked.push(linkCapture(capture, capture2));
    }
    return linked;
}

export function linkCapture(capture1, capture2) {
    if (capture2 == null) {
        return capture1;
    }
    return createMove(
        capture1.fromX, capture1.fromY,
        capture2.toX, capture2.toY,
        capture1.captures.concat(capture2.captures),
        false
    );
}

export function createPiece(token, x, y, isWhite, isHaji) {
    return {
        token: token,
        x: x,
        y: y,
        isWhite: isWhite,
        isHaji: isHaji
    };
}

export function createRule(
    playerTime = 10*60,
    linkCaptureBehind = true,
    forceCaptureMax = true,
    noCaptureDie = false,
    flyingHaji = true,
    flyingHajiCapture = true,
    drawTurns = 40
) {
    return {
        playerTime: playerTime,
        linkCaptureBehind: linkCaptureBehind,
        forceCaptureMax: forceCaptureMax,
        noCaptureDie: noCaptureDie,
        flyingHaji: flyingHaji,
        flyingHajiCapture: flyingHajiCapture,
        drawTurns: drawTurns
    };
}