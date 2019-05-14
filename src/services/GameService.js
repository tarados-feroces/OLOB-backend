'use strict';
import { GameStatus } from '../constants/GameConstants';

const Chess = require('chess.js');

class GameService {
    init(player1, player2) {
        const chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        // const chess = new Chess('rn1qkbnr/ppPppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        chess.header('White', player1);
        chess.header('Black', player2);

        return chess;
    }

    makeStep(chess, step) {
        let from = step.from;
        let to = step.to;

        if (!from || !to) {
            from = this._transpileCoordsToStep(step.prevPos);
            to = this._transpileCoordsToStep(step.nextPos);
        }

        const figure = chess.get(from);

        let status = false;

        if ((to[1] === '1' && JSON.stringify(figure) === JSON.stringify({ type: 'p', color: 'b' })) ||
            (to[1] === '8' && JSON.stringify(figure) === JSON.stringify({ type: 'p', color: 'w' }))) {
            status = GameStatus.CHANGE;
        }

        console.log('figure', figure);

        if (status === GameStatus.CHANGE) {
            return { situation: { type: status }, pos: { from, to } };
        }

        const move = chess.move({
            from,
            to
        });

        if (chess.in_check()) {
            status = GameStatus.CHECK;
        }

        if (chess.in_checkmate()) {
            status = GameStatus.MATE;
        }

        if (chess.in_draw()) {
            status = GameStatus.DRAW;
        }

        const situation = {
            type: status
        };

        // if (status) {
        //     const board = this.chess.board();
        //     for (let line = 0; line < board.length; ++line) {
        //         for (let pos = 0; pos < line.length; ++pos) {
        //             if (board[line][pos].type === 'k' && board[line][pos] === this.chess.turn()) {
        //                 situation.x = pos;
        //                 situation.y = line;
        //             }
        //         }
        //     }
        // }

        return {
            chess,
            situation,
            currentUser: chess.turn(),
            step: { from, to, figure: move.piece, side: move.color }
        };
    }

    changeFigure(chess, figure, pos) {
        console.log(chess.turn());
        chess.remove(pos.from);
        chess.put(figure, pos.to);
        const fen = chess.fen().split(' ');
        fen[1] = fen[1] === 'w' ? 'b' : 'w';
        chess.load(fen.join(' '));

        return { chess, currentUser: chess.turn() };
    }

    getAvailableMoves(chess, pos) {
        const steps = chess.moves({ square: this._transpileCoordsToStep(pos), verbose: true });
        return steps.map((item) => this._transpileStepToCoords(item));
    }

    _transpileCoordsToStep(coords) {
        return `${String.fromCharCode(coords.x + 97)}${coords.y + 1}`;
    }

    _transpileStepToCoords(item) {
        return {
            x: item.to[0].charCodeAt(0) - 97,
            y: Number(item.to[1]) - 1,
            captured: Boolean(item.captured)
        };
    }

    getCurrentUser(chess) {
        return chess.turn();
    }
}

const gameService = new GameService();
export default gameService;
