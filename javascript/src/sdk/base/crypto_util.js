'use strict';

const secp256k1 = require('secp256k1');
const {randomBytes} = require('crypto');
const {Ecdsa} = require('../base/ecdsa');

class CryptoUtil {
    constructor() {

    }

    static make_private_key(private_key_wrap) {
        do {
            private_key_wrap.key = randomBytes(32);
        } while (!secp256k1.privateKeyVerify(private_key_wrap.key));
    }

    static make_address_by_assign_key(priv_key, addr_type, net_id) {
        const pub_key = secp256k1.publicKeyCreate(priv_key);
        return CryptoUtil.public_to_address(pub_key, addr_type, net_id);
    }

    static make_child_address_by_assigned_key(parent_addr,priv_key,addr_type,net_id) {
        const pub_key = secp256k1.publicKeyCreate(priv_key);
        return CryptoUtil.public_to_address(pub_key,addr_type,net_id);
    }

    static public_to_address(pub_key, addr_type, net_id) {
        const version_uint32 = net_id << 8 | addr_type;
        const version_string = version_uint32.toString();
        const ecdsa = new Ecdsa();
        return ecdsa.get_address(pub_key, version_string);
    }
}

module.exports.CryptoUtil = CryptoUtil;
