'use strict';
import { GameStatus } from '../constants/GameConstants';

const Chess = require('chess.js');

class GameService {
    init(player1, player2) {
        this.chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        this.chess.header('White', player1);
        this.chess.header('Black', player2);

        return this.chess.fen();
    }

    makeStep(game, step) {
        this.chess.load(game);
        console.log({
            from: this._transpileCoordsToStep(step.prevPos),
            to: this._transpileCoordsToStep(step.nextPos)
        });
        this.chess.move({
            from: this._transpileCoordsToStep(step.prevPos),
            to: this._transpileCoordsToStep(step.nextPos)
        });

        let status = false;

        if (this.chess.in_check()) {
            status = GameStatus.CHECK;
        }

        if (this.chess.game_over()) {
            status = GameStatus.MATE;
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
            fen: this.chess.fen(),
            situation,
            currentUser: this.chess.turn()
        };
    }

    getAvailableMoves(game, pos) {
        this.chess.load(game);
        const steps = this.chess.moves({ square: this._transpileCoordsToStep(pos), verbose: true });
        console.log(steps);
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

    saveGame(game, player1, player2) {

    }
}

const gameService = new GameService();
export default gameService;
