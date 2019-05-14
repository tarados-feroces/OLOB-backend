'use strict';
import { gameModel } from '../models';

const crypto = require('crypto');

class PartyService {
    constructor() {
        this.parties = {};
        this.userToParty = {};
    }

    add(playerID1, playerID2, game, messages = [], steps = []) {
        const partyID = this._countPartyID(playerID1, playerID2);
        console.log(partyID);

        this.parties[partyID] = {
            playerID1,
            playerID2,
            game,
            messages,
            steps
        };

        this.userToParty[playerID1] = partyID;
        this.userToParty[playerID2] = partyID;

        // this.save(playerID1, playerID2, game, partyID);
    }

    async delete(id) {
        console.log('deleting party');
        const { playerID1, playerID2 } = this.parties[id];
        this.parties[id] = undefined;
        this.userToParty[playerID1] = undefined;
        this.userToParty[playerID2] = undefined;

        // await gameModel.findOneAndRemove({ partyID: id });
    }

    addMessage(req, message) {
        const party = this.getCurrentParty(req);
        party.messages.push(message);
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

    updatePartyGame(req, game, step) {
        const party = this.getCurrentParty(req);
        party.game = game;
        step && party.steps.push(step);
    }

    getUserParty(id) {
        return this.parties[this.userToParty[id]];
    }

    getUserPartyID(id) {
        return this.userToParty[id];
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
