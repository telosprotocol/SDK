'use strict';

const {TransMode,TransBase} = require("./rpc/trans_base");
let {GLOBAL,g_user_info} = require("./model/global_defination");
const {APIMethodImpl} = require("./impl/api_method_impl");
const {http_handler_instance} = require("./rpc/http_handler");
const {StringUtil} = require('./base/string_util');
//const ByteBuffer = require('ByteBuffer');
const ByteBuffer = require('ByteBuffer');
const secp256k1 = require('secp256k1');
const {randomBytes} = require('crypto');

const DEFAULT_ACCOUNT = GLOBAL.ACCONT_ONE;
let g_server_host_port = "";

const change_trans_mode = function (use_http) {
    if(true === use_http) {
        g_server_host_port = GLOBAL.SERVER_HOST_PORT_HTTP;
        TransBase.s_default_mode = TransMode.HTTP;
    } else {
        g_server_host_port = GLOBAL.SERVER_HOST_PORT_WS;
        TransBase.s_default_mode = TransMode.WS;
    }
};

const make_private_key = function () {
    console.log(g_user_info);
    let private_key_wrap = {key:""};
    let address_wrap = {address:""};
    let local_storage = window.localStorage;
    let item = local_storage.getItem("top_private_key");
    if(item != null) {
        let item_bytes = StringUtil.hex2bytes(item);
        g_user_info.set_private_key(item_bytes);
    } else {
        api_method_impl.make_private_key(private_key_wrap,address_wrap);
        g_user_info.set_private_key(private_key_wrap.key);
        let hex_key = StringUtil.bytes2hex(private_key_wrap.key);
        local_storage.setItem("top_private_key",hex_key);
    }
};

g_user_info.set_account(DEFAULT_ACCOUNT);
http_handler_instance.init();
change_trans_mode(true);
let api_method_impl = new APIMethodImpl();
make_private_key();

window.request_token = function () {
    console.log(g_user_info);
    api_method_impl.request_token(g_user_info);
};

window.create_account = function () {
    console.log(g_user_info);
    api_method_impl.create_account(g_user_info);
};

window.make_private_key = function () {
    make_private_key();
};

window.get_property = function () {
    const type = "list";
    const data1 = "param1";
    const data2 = "param2";
    api_method_impl.get_property(g_user_info,type,data1,data2);
};

window.transfer = function () {
    const from_account = g_user_info.get_account();
    const to_account = "T-0-1EHzT2ejd12uJx7BkDgkA7B5DS1nM6AXyF";
    //const to_account = "T-0-1EHzT2ejd12uJx7BkDgkA7B5F";
    api_method_impl.transfer(g_user_info,from_account,to_account,10);
};

window.account_info = function () {
    api_method_impl.account_info(g_user_info);
};

window.key_store = function () {
    const type = document.getElementById("key").value;
    const value = document.getElementById("value").value;
    console.log("type:{0},value:{1}".format(type,value));
    api_method_impl.key_store(g_user_info,type,value);
};

/*
let byte_buffer = new ByteBuffer().littleEndian();
let buffer_pack = byte_buffer.string("a").pack();
console.log(buffer_pack);
let byte_buffer2 = new ByteBuffer().littleEndian();
console.log(byte_buffer2.byteArray(buffer_pack,buffer_pack.length).pack());*/
