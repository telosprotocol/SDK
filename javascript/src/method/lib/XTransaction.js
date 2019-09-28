'use strict';

const {sha256} = require('js-sha256');
const ByteBuffer = require("../../utils/ByteBuffer");
const StringUtil = require("../../utils");
const XAction = require('./XAction');

class XTransactionHeader {
    constructor() {
        this.transaction_type = 0;
        this.transaction_len = 0;
        this.version = 0;
        this.to_network_id = 0;
        this.from_network_id = 0;
        this.to_account_id = 0;
        this.from_account_id = 0;
        this.gas_price = 0;
        this.gas_limit = 0;
        this.deposit = 0;
        this.expire_duration = 0;
        this.fire_timestamp = 0;
        this.trans_random_nounce = 0;
        this.hash_work_proof = 0;
        this.last_unit_hight  = 0;
        this.last_unit_hash  = 0;
        this.last_trans_nonce  = 0;
        this.last_trans_hash  = "";
        this.parent_account = "";
        this.authority_keys = "";
    }

    serialize_write(stream) {
        const begin_pos = new Uint8Array(stream.pack()).length;
        let last_trans_hash = this.last_trans_hash;
        last_trans_hash = last_trans_hash.replace("0x","");
        let le_last_trans_hash =  StringUtil.little_endian(last_trans_hash);
        const last_trans_hash_byte = StringUtil.hex2bytes(le_last_trans_hash);
        stream.ushort(this.transaction_type)
            .ushort(this.transaction_len)
            .uint32(this.version)
            .int64(this.to_account_id)
            .int64(this.from_account_id)
            .ushort(this.to_network_id)
            .ushort(this.from_network_id)
            .uint32(this.deposit)
            // .uint32(this.gas_price)
            // .uint32(this.gas_limit)
            .ushort(this.expire_duration)
            .int64(this.fire_timestamp)
            .uint32(this.trans_random_nounce)
            .uint32(this.hash_work_proof)
            .int64(this.last_unit_hight)
            .int64(this.last_unit_hash)
            .int64(this.last_trans_nonce)
            .byteArray(last_trans_hash_byte,8)
            .string(this.parent_account)
            .string(this.authority_keys);
        const end_pos = new Uint8Array(stream.pack()).length;
        return end_pos - begin_pos;
    }

    get_transaction_type() {
        return this.transaction_type;
    }
    set_transaction_type(transaction_type) {
        this.transaction_type = transaction_type;
    }
    get_transaction_len() {
        return this.transaction_len;
    }
    set_transaction_len(transaction_len) {
        this.transaction_len = transaction_len;
    }
    get_version() {
        return this.version;
    }
    set_version(version) {
        this.version = version;
    }
    get_to_network_id() {
        return this.to_network_id;
    }
    set_to_network_id(to_network_id) {
        this.to_network_id = to_network_id;
    }
    get_from_network_id() {
        return this.from_network_id;
    }
    set_from_network_id() {
        return this.from_network_id;
    }
    get_to_account_id() {
        return this.to_account_id;
    }
    set_to_account_id(to_account_id) {
        this.to_account_id = to_account_id;
    }
    get_from_account_id() {
        return this.from_account_id;
    }
    set_from_account_id(from_account_id) {
        this.from_account_id = from_account_id;
    }
    get_gas_price() {
        return this.gas_price;
    }
    set_gas_price(gas_price) {
        this.gas_price = gas_price;
    }
    get_gas_limit() {
        return this.gas_limit;
    }
    set_gas_limit(gas_limit) {
        this.gas_limit = gas_limit;
    }
    set_deposit(deposit) {
        this.deposit = deposit;
    }
    get_deposit() {
        return this.deposit;
    }
    get_expire_duration() {
        return this.expire_duration;
    }
    set_expire_duration(expire_duration) {
        this.expire_duration = expire_duration;
    }
    get_fire_timestamp() {
        return this.fire_timestamp;
    }
    set_fire_timestamp(fire_timestamp) {
        this.fire_timestamp = fire_timestamp;
    }

    get_trans_random_nounce() {
        return this.trans_random_nounce;
    }

    set_trans_random_nounce(trans_random_nounce) {
        this.trans_random_nounce = trans_random_nounce;
    }

    get_hash_work_proof() {
        return this.hash_work_proof;
    }
    set_hash_work_proof(hash_work_proof) {
        return  this.hash_work_proof;
    }
    get_last_unit_hight() {
        return this.last_unit_hight;
    }
    set_last_unit_hight(last_unit_high) {
        this.last_unit_hight = last_unit_high;
    }
    get_last_unit_hash() {
        return this.last_unit_hash;
    }
    set_last_unit_hash(last_unit_hash) {
        this.last_unit_hash = last_unit_hash;
    }
    get_last_trans_nonce() {
        return this.last_trans_nonce;
    }
    set_last_trans_nonce(last_trans_nonce) {
        this.last_trans_nonce = last_trans_nonce;
    }
    get_last_trans_hash() {
        return this.last_trans_hash;
    }
    set_last_trans_hash(last_trans_hash) {
        this.last_trans_hash = last_trans_hash;
    }
    get_parent_account() {
        return this.parent_account;
    }
    set_parent_account(parent_account) {
        this.parent_account = parent_account;
    }
    get_authority_keys() {
        return this.authority_keys;
    }
    set_authority_keys(authority_keys) {
        this.authority_keys = authority_keys;
    }
}

class XTransaction extends XTransactionHeader {
    constructor() {
        super();
        this.source_action = new XAction();
        this.target_action = new XAction();
        this.transaction_hash = undefined;
        this.authorization = "";
        this.public_key = "";
    }
    serialize_write(stream) {
        const begin_pos = new Uint8Array(stream.pack()).length;
        super.serialize_write(stream);
        this.source_action.serialize_write(stream);
        this.target_action.serialize_write(stream);
        const end_pos = new Uint8Array(stream.pack()).length;
        return end_pos - begin_pos;
    }

    get_source_action() {
        return this.source_action;
    }
    set_source_action(source_action) {
        this.source_action = source_action;
    }
    get_target_action() {
        return this.target_action;
    }
    set_target_action(target_action) {
        this.target_action = target_action;
    }
    get_transaction_hash() {
        return this.transaction_hash;
    }
    set_transaction_hash(transaction_hash) {
        this.transaction_hash = transaction_hash;
    }
    get_authorization() {
        return this.authorization;
    }
    set_authorization(authorization) {
        this.authorization = authorization;
    }
    get_public_key() {
        return this.public_key;
    }
    set_public_key(public_key) {
        this.public_key = public_key;
    }

    set_digest() {
        let stream = new ByteBuffer().littleEndian();
        this.serialize_write(stream);
        let hash = sha256.create();
        hash.update(stream.pack());
        const hash_array = hash.array();
        const hash_hex = hash.hex();
        this.transaction_hash = {array:hash_array,hex:"0x" + hash_hex};
    }
}

module.exports = XTransaction;
