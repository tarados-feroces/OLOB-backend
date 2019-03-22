'use strict';
import { BoardLetters, GameStatus } from '../constants/GameConstants';

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

        let status = GameStatus.NORMAL;

        if (this.chess.in_check()) {
            status = GameStatus.CHECK;
        }

        if (this.chess.game_over()) {
            status = GameStatus.MATE;
        }

        console.log(this.chess.fen());

        return { fen: this.chess.fen(), status, currentUser: this.chess.turn() };
    }

    getAvailableMoves(game, pos) {
        this.chess.load(game);
        const steps = this.chess.moves({ square: this._transpileCoordsToStep(pos) });
        return steps.map((item) => this._transpileStepToCoords(item));
    }

    _transpileCoordsToStep(coords) {
        return `${BoardLetters[coords.x]}${coords.y + 1}`;
    }

    _transpileStepToCoords(step) {
        return {
            x: step[1],
            y: step[0]
        };
    }
}

const gameService = new GameService();
export default gameService;
