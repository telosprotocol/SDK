'use strict';

const ByteBuffer = require("../../utils/ByteBuffer");
const {sha256} = require('js-sha256');

class XAction {
    constructor() {
        this.action_hash = 0;
        this.action_type = 0;
        this.action_size = 0;
        this.account_addr = "";
        this.action_name = "";
        this.action_param = [];
        this.action_authorization = "";
    }

    serialize_write(stream) {
        const begin_pos = new Uint8Array(stream.pack()).length;
        stream.uint32(this.action_hash)
            .ushort(this.action_type)
            .ushort(this.action_size)
            .string(this.account_addr)
            .string(this.action_name);
        if(0 === this.action_param.length) {
            stream.string("")
                .string(this.action_authorization);
        } else {
            stream.uint32(this.action_param.length)
                .byteArray(this.action_param,this.action_param.length)
                .string(this.action_authorization);
        }

        const end_pos = new Uint8Array(stream.pack()).length;
        return end_pos - begin_pos;
    }

    set_digest() {
        let stream = new ByteBuffer().littleEndian();
        this.serialize_write(stream);
        let hash = sha256.create();
        hash.update(stream.pack());
        const hash_array = hash.array();
        const hash_hex = hash.hex();
        return {array:hash_array,hex:"0x" + hash_hex};
    }

    get_action_hash() {
        return this.action_hash;
    }

    set_action_hash(action_hash) {
        this.action_hash = action_hash;
    }

    get_action_type() {
        return this.action_type;
    }

    set_action_type(action_type) {
        this.action_type = action_type;
    }

    get_action_size() {
        return this.action_size;
    }

    set_action_size(action_size) {
        this.action_size = action_size;
    }

    get_account_addr() {
        return this.account_addr;
    }

    set_account_addr(account_addr) {
        this.account_addr = account_addr;
    }

    get_action_name() {
        return this.action_name;
    }

    set_acton_name(action_name) {
        this.action_name = action_name;
    }

    get_action_param() {
        return this.action_param;
    }

    set_action_param(action_param) {
        this.action_param = action_param;
    }

    get_action_authorization() {
        return this.action_authorization;
    }

    set_action_authorization(action_authorization) {
        this.action_authorization = action_authorization;
    }

    sha2() {
        let stream = new ByteBuffer();
        stream.uint32(this.action_hash)
            .ushort(this.action_type)
            .ushort(this.action_size)
            .string(this.account_addr)
            .string(this.action_name)
            .string(this.action_param);
        const buffer = stream.pack();
        return hash.sha256().update(buffer).digest();
    }
}

module.exports = XAction;