'use strict';
import { gameModel } from '../models';

const crypto = require('crypto');

class PartyService {
    constructor() {
        this.parties = {};
        this.userToParty = {};
    }

    add(playerID1, playerID2, game) {
        const partyID = this._countPartyID(playerID1, playerID2);
        console.log(partyID);

        this.parties[partyID] = {
            playerID1,
            playerID2,
            game
        };

        this.userToParty[playerID1] = partyID;
        this.userToParty[playerID2] = partyID;

        // this.save(playerID1, playerID2, game, partyID);
    }

    async delete(id) {
        const { playerID1, playerID2 } = this.parties[id];
        delete this.parties[id];
        delete this.userToParty[playerID1];
        delete this.userToParty[playerID2];

        // await gameModel.findOneAndRemove({ partyID: id });
    }

    _countPartyID(playerID1, playerID2) {
        const data = playerID1.toString() + playerID2.toString();
        const shasum = crypto.createHash('sha1');
        shasum.update(data);
        return shasum.digest('hex');
    }

    getCurrentParty(req) {
        return this.parties[this.userToParty[req.session.user.id]];
    }

    getCurrentPartyID(req) {
        return this.userToParty[req.session.user.id];
    }

    updatePartyGame(req, game) {
        this.parties[this.userToParty[req.session.user.id]].game = game;
    }

    getUserParty(id) {
        return this.parties[this.userToParty[id]];
    }

    getEnemyOfUser(id) {
        const party = this.getUserParty(id);
        return party.playerID1 === id ?
            party.playerID2 :
            party.playerID1;
    }

    async save(playerID1, playerID2, game, partyID) {
        await gameModel.create({ playerID1, playerID2, game, partyID });
    }
}

const partyService = new PartyService();
export default partyService;
