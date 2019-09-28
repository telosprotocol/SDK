'use strict'

const {randomBytes} = require('crypto');
const secp256k1 = require('secp256k1');

var secp_crypto = function () {

    this.create_privkey = function () {
        let privkey
        do {
            privkey = randomBytes(32)
        } while (!secp256k1.privateKeyVerify(privkey))
        this.private_key = privkey;
        return privke;
    }

    this.create_pubkey = function (privkey) {
        return secp256k1.publicKeyCreate(privkey);
    }

    this.sign = function(msg,privkey) {
        this.signature = secp256k1.sign(msg, privkey).signature;
        return this.signature.toString('hex');
    }
    
    this.verify = function (msg, pubkey) {
        return secp256k1.verify(msg, this.signature, pubkey);
    }
}

module.exports.create_secp_crypto = function() {
    let obj = new secp_crypto();
    return obj;
}