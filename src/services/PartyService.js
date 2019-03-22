'use strict';
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
    }

    delete(id) {
        const { playerID1, playerID2 } = this.parties[id];
        delete this.parties[id];
        delete this.userToParty[playerID1];
        delete this.userToParty[playerID2];
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

    updatePartyGame(req, game) {
        this.parties[this.userToParty[req.session.user.id]].game = game;
    }

    getEnemyOfUser(req) {
        const partyID = this.getCurrentParty(req);
        return this.parties[partyID].playerID1 === req.session.user.id ?
            this.parties[partyID].playerID2 :
            this.parties[partyID].playerID1;
    }
}

const partyService = new PartyService();
export default partyService;
