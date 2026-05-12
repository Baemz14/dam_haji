import { Move } from "/dam_haji/game_logic/move.js";

class MoveNode {
    constructor(parent, move, children=[]) {
        this.parent = parent;
        this.move = move;
        this.children = children;
    }

    isRoot() {
        return !this.move;
    }

    isEnd() {
        return this.children.length <= 0;
    }

    hasBranches() {
        return this.children.length > 1;
    }
}

export class MoveHistory {
    constructor() {
        this.root = new MoveNode(null, null);
        this.head = this.root;
    }

    addMove(move) {
        let moveNot = move.notation();
        for (const child of this.head.children) {
            //console.log(`${moveNot} vs ${child.move.notation()}`);
            if (moveNot === child.move.notation()) {
                this.head = child; // if already have this move just move to existing one
                return;
            }
        }
        let newNode = new MoveNode(this.head, move);
        this.head.children.push(newNode);
        this.head = newNode;
    }

    undo(board) {
        if (this.head.isRoot()) { return; }
        this.head.move.undo(board);
        this.head = this.head.parent? this.head.parent: this.head;
    }

    redo(board, index=0) {
        if (this.head.children.length > index) {
            //pick the first child for now
            this.head.children[index].move.execute(board);
            this.head = this.head.children[index];
        }
    }

    firstMove(board) {
        while(!this.head.isRoot()) {
            this.undo(board);
        }
    }

    lastMove(board) {
        while(this.head.children.length > 0) {
            this.redo(board);
        }
    }

    getHistoryFlat() {
        let history = [];
        for (const [i, child] of this.root.children.entries()) {
            history.push(...this.getNodeHistoryFlat(child, 1, i>0));
        }
        return history;
    }

    getNodeHistoryFlat(node, depth, isBranch) {
        let history = [{
            depth: depth,
            notation: node.move.notation(),
            isWhite: node.move.isWhite,
            ref: node,
            isBranch: isBranch
        }];
        for (const [i, child] of node.children.entries()) {
            history.push(...this.getNodeHistoryFlat(child, !node.move.isWhite? depth+1: depth, i>0));
        }
        return history;
    }

    getHistory() {
        return this.getNodeHistory(this.root, 1);
    }

    getNodeHistory(parent, depth ,isBranch=false) {
        if (!parent) {
            return [];
        } if (!isBranch && parent.isEnd()) {
            return [];
        }
        let isWhite = parent.isRoot() || !parent.move.isWhite;
        let white = null, black = null;

        if (isBranch) {
            isWhite = parent.move.isWhite;
            if (isWhite) {
                white = parent;
                black = white.isEnd()? null: white.children[0];
            } else {
                white = null;
                black = parent;
            }
        } else {  
            if (isWhite) {
                white = parent.children[0];
                black = white.isEnd()? null: white.children[0];
            } else {
                white = null;
                black = parent.children[0];
            }
        }

        let newHistor = {
            turn: depth,
            white: white? white.move.notation(): "...",
            black: black? black.move.notation(): "...",
            whiteRef: white,
            blackRef: black,
            isWhiteActive: white === this.head,
            isBlackActive: black === this.head,
            variations: []
        };

        if (!isBranch) {
            for (let i = 1; i < parent.children.length; i++) {
                newHistor.variations.push(this.getNodeHistory(parent.children[i], depth, true));
            }
        }
        if (white && white.children.length > 1) {
            for (let i = 1; i < white.children.length; i++) {
                newHistor.variations.push(this.getNodeHistory(white.children[i], depth, true));
            }
        }
        if (!black || black.isEnd()) {
            return [newHistor];
        }
        return [newHistor, ...this.getNodeHistory(black, depth+1)];
    }

    goToNode(moveNode, board) {
        let backTrace = [];
        for (let node = moveNode; node !== this.root; node = node.parent) {
            backTrace.push(node);
        }
        this.firstMove(board);
        for (let i = backTrace.length-1; i >= 0; i--) {
            backTrace[i].move.execute(board);
        }
        this.head = moveNode;
    }

    restart() {
        this.root = new MoveNode(null, null);
        this.head = this.root;
    }
}