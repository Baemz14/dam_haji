export function createBoard(
    state = "1b1b1b1b/b1b1b1b1/1b1b1b1b/8/8/w1w1w1w1/1w1w1w1w/w1w1w1w1",
    isWhiteMove = true,
    rule = createRule (15*60, true, true, false, true, 20)
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

export function createMove(fromX, fromY, toX, toY, type, captures=[]) {
    return {
        fromX: fromX, fromY: fromY,
        toX: toX, toY: toY,
        type: type,
        captures: captures
    };
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
        "CAPTURE",
        capture1.captures.concat(capture2.captures)
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
    playerTime,
    linkCaptureBehind,
    forceCaptureMax,
    noCaptureDie,
    flyingHaji,
    drawTurns
) {
    return {
        playerTime: playerTime,
        linkCaptureBehind: linkCaptureBehind,
        forceCaptureMax: forceCaptureMax,
        noCaptureDie: noCaptureDie,
        flyingHaji: flyingHaji,
        drawTurns: drawTurns
    };
}