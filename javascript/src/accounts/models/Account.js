
class Account{

    constructor(options) {
        this.address = options.address;
        this.privateKey = options.privateKey;
        this.publicKey = options.publicKey;
        this.privateKeyBytes = options.privateKeyBytes;
        this._sequence_id = options.sequence_id || Date.now();
        this.token = '';
        this.nonce = 0;
        this.last_hash = '';
        this.last_hash_xxhash64 = '';
        this.last_unit_height = 0;
        this.balance = 0;
    }

    get sequence_id() {
        this._sequence_id = Number.parseInt(this._sequence_id) + 1;
        return this._sequence_id;
    }

    set sequence_id(sequence_id) {
        this._sequence_id = sequence_id;
    }
}

module.exports = Account;