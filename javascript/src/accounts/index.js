
const utxoLib = require('trezor-utxo-lib');
const secp256k1 = require('secp256k1');
const randombytes = require('randombytes');

const Account = require('./models/Account');
const StringUtil = require("../utils");

class Accounts{

    /**
     * This methods gives us the possibility to create a new account.
     *
     * @returns {Account}
     */
    generate() {
        let privateKeyBytes = '';
        do {
            privateKeyBytes = randombytes(32);
        } while (!secp256k1.privateKeyVerify(privateKeyBytes));

        const publicKeyBytes = secp256k1.publicKeyCreate(privateKeyBytes, false);

        const hash =  utxoLib.crypto.sha256(publicKeyBytes);
        const ripemd = utxoLib.crypto.ripemd160(hash);
        const address = utxoLib.address.toBase58Check(ripemd,0);

        return new Account({
            address: "T-0-" + address, 
            privateKey: StringUtil.bytes2hex(privateKeyBytes),
            publicKey: StringUtil.bytes2hex(privateKeyBytes),
            privateKeyBytes
        });
    }

    /**
     * This gives us the possibility to create a Account object from a private key.
     *
     * @param {String} privateKey
     *
     * @returns {Account}
     */
    generateByPrivateKey(privateKey) {
        if (privateKey.startsWith('0x')) {
            // privateKey = '0x' + privateKey;
            privateKey = privateKey.replace('0x', '');
        }

        // 64 hex characters + hex-prefix
        if (privateKey.length !== 64) {
            throw new Error("Private key must be 32 bytes long");
        }

        const privateKeyBytes = Buffer.from(StringUtil.hex2bytes(privateKey))
        let publicKeyBytes = secp256k1.publicKeyCreate(privateKeyBytes, false);

        const hash =  utxoLib.crypto.sha256(publicKeyBytes);
        const ripemd = utxoLib.crypto.ripemd160(hash);
        const address = utxoLib.address.toBase58Check(ripemd,0);

        // publicKey = secp256k1.publicKeyCreate(privateKey);

        return new Account({
            address: "T-0-" + address, 
            privateKey,
            publicKey: StringUtil.bytes2hex(publicKeyBytes),
            privateKeyBytes
        });
    }
}

module.exports = Accounts;