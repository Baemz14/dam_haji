import { Move } from "/dam_haji/game_logic/move.js";

class MoveNode {
    constructor(parent, move, children=[]) {
        this.parent = parent;
        this.move = move;
        this.children = children;
    }

    is_root() {
        return !this.move;
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
        if (this.head.is_root()) { return; }
        this.head.move.undo(board);
        this.head = this.head.parent? this.head.parent: this.head;
    }

    redo(board) {
        if (this.head.children.length > 0) {
            //pick the first child for now
            this.head.children[0].move.execute(board);
            this.head = this.head.children[0];
        }
    }

    firstMove(board) {
        while(!this.head.is_root()) {
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
            history.push(...this.getNodeHistory(child, 1, i>0));
        }
        return history;
    }

    getNodeHistory(node, depth, isBranch) {
        let history = [{
            depth: depth,
            notation: node.move.notation(),
            isWhite: node.move.isWhite,
            ref: node,
            isBranch: isBranch
        }];
        for (const [i, child] of node.children.entries()) {
            history.push(...this.getNodeHistory(child, depth+1, i>0));
        }
        return history;
    }
}