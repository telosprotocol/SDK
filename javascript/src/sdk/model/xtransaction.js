'use strict';

const {sha256} = require('js-sha256');
const ByteBuffer = require("ByteBuffer");
const {StringUtil} = require("../base/string_util");

class XTransactionHeader {
    constructor() {
        this.m_transaction_type = 0;
        this.m_transaction_len = 0;
        this.m_version = 0;
        this.m_to_network_id = 0;
        this.m_from_network_id = 0;
        this.m_to_account_id = 0;
        this.m_from_account_id = 0;
        this.m_gas_price = 0;
        this.m_gas_limit = 0;
        this.m_expire_duration = 0;
        this.m_fire_timestamp = 0;
        this.m_trans_random_nounce = 0;
        this.m_hash_work_proof = 0;
        this.m_last_unit_hight  = 0;
        this.m_last_unit_hash  = 0;
        this.m_last_trans_nonce  = 0;
        this.m_last_trans_hash  = "";
        this.m_parent_account = "";
        this.m_authority_keys = "";
    }

    serialize_write(stream) {
        const begin_pos = new Uint8Array(stream.pack()).length;
        let last_trans_hash = this.m_last_trans_hash;
        last_trans_hash = last_trans_hash.replace("0x","");
        let le_last_trans_hash =  StringUtil.little_endian(last_trans_hash);
        const last_trans_hash_byte = StringUtil.hex2bytes(le_last_trans_hash);
        stream.ushort(this.m_transaction_type)
            .ushort(this.m_transaction_len)
            .uint32(this.m_version)
            .int64(this.m_to_account_id)
            .int64(this.m_from_account_id)
            .ushort(this.m_to_network_id)
            .ushort(this.m_from_network_id)
            .uint32(this.m_gas_price)
            .uint32(this.m_gas_limit)
            .ushort(this.m_expire_duration)
            .int64(this.m_fire_timestamp)
            .uint32(this.m_trans_random_nounce)
            .uint32(this.m_hash_work_proof)
            .int64(this.m_last_unit_hight)
            .int64(this.m_last_unit_hash)
            .int64(this.m_last_trans_nonce)
            .byteArray(last_trans_hash_byte,8)
            .string(this.m_parent_account)
            .string(this.m_authority_keys);
        const end_pos = new Uint8Array(stream.pack()).length;
        return end_pos - begin_pos;
    }

    get_transaction_type() {
        return this.m_transaction_type;
    }
    set_transaction_type(transaction_type) {
        this.m_transaction_type = transaction_type;
    }
    get_transaction_len() {
        return this.m_transaction_len;
    }
    set_transaction_len(transaction_len) {
        this.m_transaction_len = transaction_len;
    }
    get_version() {
        return this.m_version;
    }
    set_version(version) {
        this.m_version = version;
    }
    get_to_network_id() {
        return this.m_to_network_id;
    }
    set_to_network_id(to_network_id) {
        this.m_to_network_id = to_network_id;
    }
    get_from_network_id() {
        return this.m_from_network_id;
    }
    set_from_network_id() {
        return this.m_from_network_id;
    }
    get_to_account_id() {
        return this.m_to_account_id;
    }
    set_to_account_id(to_account_id) {
        this.m_to_account_id = to_account_id;
    }
    get_from_account_id() {
        return this.m_from_account_id;
    }
    set_from_account_id(from_account_id) {
        this.m_from_account_id = from_account_id;
    }
    get_gas_price() {
        return this.m_gas_price;
    }
    set_gas_price(gas_price) {
        this.m_gas_price = gas_price;
    }
    get_gas_limit() {
        return this.m_gas_limit;
    }
    set_gas_limit(gas_limit) {
        this.m_gas_limit = gas_limit;
    }
    get_expire_duration() {
        return this.m_expire_duration;
    }
    set_expire_duration(expire_duration) {
        this.m_expire_duration = expire_duration;
    }
    get_fire_timestamp() {
        return this.m_fire_timestamp;
    }
    set_fire_timestamp(fire_timestamp) {
        this.m_fire_timestamp = fire_timestamp;
    }

    get_trans_random_nounce() {
        return this.m_trans_random_nounce;
    }

    set_trans_random_nounce(trans_random_nounce) {
        this.m_trans_random_nounce = trans_random_nounce;
    }

    get_hash_work_proof() {
        return this.m_hash_work_proof;
    }
    set_hash_work_proof(hash_work_proof) {
        return  this.m_hash_work_proof;
    }
    get_last_unit_hight() {
        return this.m_last_unit_hight;
    }
    set_last_unit_hight(last_unit_high) {
        this.m_last_unit_hight = last_unit_high;
    }
    get_last_unit_hash() {
        return this.m_last_unit_hash;
    }
    set_last_unit_hash(last_unit_hash) {
        this.last_unit_hash = last_unit_hash;
    }
    get_last_trans_nonce() {
        return this.m_last_trans_nonce;
    }
    set_last_trans_nonce(last_trans_nonce) {
        this.m_last_trans_nonce = last_trans_nonce;
    }
    get_last_trans_hash() {
        return this.m_last_trans_hash;
    }
    set_last_trans_hash(last_trans_hash) {
        this.m_last_trans_hash = last_trans_hash;
    }
    get_parent_account() {
        return this.m_parent_account;
    }
    set_parent_account(parent_account) {
        this.m_parent_account = parent_account;
    }
    get_authority_keys() {
        return this.m_authority_keys;
    }
    set_authority_keys(authority_keys) {
        this.m_authority_keys = authority_keys;
    }
}

class XAction {
    constructor() {
        this.m_action_hash = 0;
        this.m_action_type = 0;
        this.m_action_size = 0;
        this.m_account_addr = "";
        this.m_action_name = "";
        this.m_action_param = [];
        this.m_action_authorization = "";
    }

    serialize_write(stream) {
        const begin_pos = new Uint8Array(stream.pack()).length;
        stream.uint32(this.m_action_hash)
            .ushort(this.m_action_type)
            .ushort(this.m_action_size)
            .string(this.m_account_addr)
            .string(this.m_action_name);
        if(0 === this.m_action_param.length) {
            stream.string("")
                .string(this.m_action_authorization);
        } else {
            stream.uint32(this.m_action_param.length)
                .byteArray(this.m_action_param,this.m_action_param.length)
                .string(this.m_action_authorization);
        }

        const end_pos = new Uint8Array(stream.pack()).length;
        return end_pos - begin_pos;
    }

    get_action_hash() {
        return this.m_action_hash;
    }

    set_action_hash(action_hash) {
        this.m_action_hash = action_hash;
    }

    get_action_type() {
        return this.m_action_type;
    }

    set_action_type(action_type) {
        this.m_action_type = action_type;
    }

    get_action_size() {
        return this.m_action_size;
    }

    set_action_size(action_size) {
        this.m_action_size = action_size;
    }

    get_account_addr() {
        return this.m_account_addr;
    }

    set_account_addr(account_addr) {
        this.m_account_addr = account_addr;
    }

    get_action_name() {
        return this.m_action_name;
    }

    set_acton_name(action_name) {
        this.m_action_name = action_name;
    }

    get_action_param() {
        return this.m_action_param;
    }

    set_action_param(action_param) {
        this.m_action_param = action_param;
    }

    get_action_authorization() {
        return this.m_action_authorization;
    }

    set_action_authorization(action_authorization) {
        this.m_action_authorization = action_authorization;
    }

    sha2() {
        let stream = new ByteBuffer();
        stream.uint32(this.m_action_hash)
            .ushort(this.m_action_type)
            .ushort(this.m_action_size)
            .string(this.m_account_addr)
            .string(this.m_action_name)
            .string(this.m_action_param);
        const buffer = stream.pack();
        return hash.sha256().update(buffer).digest();
    }
}

class XTransaction extends XTransactionHeader {
    constructor() {
        super();
        this.m_source_action = new XAction();
        this.m_target_action = new XAction();
        this.m_transaction_hash = undefined;
        this.m_authorization = "";
        this.m_public_key = "";
    }
    serialize_write(stream) {
        const begin_pos = new Uint8Array(stream.pack()).length;
        super.serialize_write(stream);
        this.m_source_action.serialize_write(stream);
        this.m_target_action.serialize_write(stream);
        const end_pos = new Uint8Array(stream.pack()).length;
        return end_pos - begin_pos;
    }

    get_source_action() {
        return this.m_source_action;
    }
    set_source_action(source_action) {
        this.m_source_action = source_action;
    }
    get_target_action() {
        return this.m_target_action;
    }
    set_target_action(target_action) {
        this.m_target_action = target_action;
    }
    get_transaction_hash() {
        return this.m_transaction_hash;
    }
    set_transaction_hash(transaction_hash) {
        this.m_transaction_hash = transaction_hash;
    }
    get_authorization() {
        return this.m_authorization;
    }
    set_authorization(authorization) {
        this.m_authorization = authorization;
    }
    get_public_key() {
        return this.m_public_key;
    }
    set_public_key(public_key) {
        this.m_public_key = public_key;
    }

    set_digest() {
        let stream = new ByteBuffer().littleEndian();
        this.serialize_write(stream);
        let hash = sha256.create();
        hash.update(stream.pack());
        const hash_array = hash.array();
        const hash_hex = hash.hex();
        this.m_transaction_hash = {array:hash_array,hex:"0x" + hash_hex};
    }
}

module.exports.create_action = function() {
    let obj = new XAction();
    return obj;
}

module.exports.create_xtransaction = function() {
    let obj = new XTransaction();
    return obj;
}

module.exports.XTransaction = XTransaction;
