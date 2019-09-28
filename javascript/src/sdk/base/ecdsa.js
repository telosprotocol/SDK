'use strict';
const {sha256} = require('js-sha256');
const bs58check = require("bs58check");
let assert = require("assert");

const Ecdsa = function () {
    this.address_prefix_bytes_len = function (address_type) {
        if (address_type <= 0xFF) {
            return 1;
        }
        if (address_type <= 0xFFFF) {
            return 2;
        }
        if (address_type <= 0xFFFFFF) {
            return 3;
        }
        return 4;
    };

    this.address_write_prefix_bytes = function (address_type, out_uint8_array) {
        let index = 0;
        if (address_type > 0xFFFFFF) {
            out_uint8_array[index++] = address_type >> 24;
        }
        if (address_type > 0xFFFF) {
            out_uint8_array[index++] = (address_type >> 16) & 0xFF;
        }
        if (address_type > 0xFF) {
            out_uint8_array[index++] = (address_type >> 8) & 0xFF;
        }
        out_uint8_array[index] = address_type & 0xFF;
    };

    this.get_pubkeyhash = function (pub_key, uint8_addr_wrap) {
        let addr = uint8_addr_wrap.addr;
        let prefix_len = uint8_addr_wrap.begin_index;
        const h = Uint8Array.from(sha256.array(pub_key));
        assert.ok(addr.length - prefix_len > 20 && h.length > 20, "param invalid");
        for (let i = 0; i < 20; ++i) {
            addr[prefix_len + i] = h[i];
        }
    };

    this.get_address_raw = function (pub_key, version, uint8_addr_raw) {
        const prefix_len = this.address_prefix_bytes_len(version);
        this.address_write_prefix_bytes(version, uint8_addr_raw);
        return this.get_pubkeyhash(pub_key,
            {addr: uint8_addr_raw, begin_index: prefix_len});
    };

    this.get_address = function (pub_key, version) {
        let raw = new Uint8Array(65);
        const prefix_len = this.address_prefix_bytes_len(version);
        this.get_address_raw(pub_key, version, raw);
        const sub_raw = raw.slice(0, prefix_len + 20);
        const bs58check_buffer = bs58check.encode(sub_raw);
        return bs58check_buffer;
    };
};

module.exports.Ecdsa = Ecdsa;
