'use strict';
const{TransMode,TransBase,TransHttp} = require('../rpc/trans_base');
const {Protocol} = require('../rpc/protocol');
let {g_user_info} = require("../model/global_defination");
const {ErrorCode} = require("./request_result_definition");
const assert = require("assert");

let MsgHandleType = {
    MsgBase : 100,
    MsgResponse : 101,
    MsgAddTask : 102
};

const ResponseContent = function () {
    this.m_content = "";
    this.get_content = function () {
        return this.m_content;
    };
    this.set_content = function (content) {
        this.m_content = content;
    }
};

const HttpHandler = function () {
    this.m_protocol = new Protocol();
    this.m_trans = undefined;
    this.m_task_info = undefined;
    this.init = function () {
        this.regist_transmode();
    };
    this.regist_transmode = function () {
        TransBase.regist_create_function(
            TransMode.HTTP,(host)=>{
                return new TransHttp(host);
            });
    };
    this.post_message = function (id, param1, param2) {
        switch (id) {
            case MsgHandleType.MsgResponse:
                this.handle_msg_response(param1);
                break;
            case MsgHandleType.MsgAddTask:
                this.handle_msg_add_task(param1);
                break;
            default:
                break;
        }
    };
    this.handle_msg_response = function (response) {
        this.m_protocol.decode(response, this.m_task_info);
    };
    this.handle_msg_add_task = function (task_info) {
        this.m_task_info = task_info;
        this.m_trans = TransBase.create(TransBase.s_default_mode, this.m_task_info.host);
        this.m_protocol = Protocol.create(this.m_task_info.get_method());
        if (true === this.m_task_info.get_use_transaction()) {
            this.m_protocol.set_transaction(this.m_task_info.get_trans_action());
        }
        assert.ok(
            undefined !== this.m_trans && undefined !== this.m_protocol,
            "trans is undefined or protocol is undefined");
        let content = {str:""};
        this.m_protocol.encode(this.m_task_info.get_params(), content);
        console.log(content);
        return this.m_trans.do_trans(content.str, this.handle_msg_response.bind(this));
    };
    this.handle_request_token_result = function (result) {
        console.log(result);
        if(ErrorCode.Success === result.get_error()) {
            console.log(result);
            g_user_info.set_token(result.get_token());
            g_user_info.set_secret_key(result.get_secret_key());
            g_user_info.set_sign_method(result.get_sign_method());
            g_user_info.set_sign_version(result.get_sign_version());
        }
    };
    this.handle_create_account_result = function(result) {
        console.log(result);
        if (ErrorCode.Success === result.get_error()) {
        }
    };
    this.handle_account_info_result = function (result) {
        console.log(result);
        if (ErrorCode.Success === result.get_error()) {
            g_user_info.set_account(result.get_account());
            g_user_info.set_last_hash(result.get_last_hash());
            g_user_info.set_balance(result.get_balance());
            g_user_info.set_nonce(result.get_nonce());
            g_user_info.set_last_hash_xxhash64(result.get_last_hash_xxhash64());
            g_user_info.set_last_unit_height(result.get_last_unit_height());
        }
    };
    this.handle_account_transaction_result = function (result) {
        console.log(result);
        if (ErrorCode.Success === result.get_error()) {
        }
    };
    this.handle_transfer_result = function (result) {
        console.log(result);
        if (ErrorCode.Success === result.get_error()) {
        }
    };
};

const http_handler_instance = new HttpHandler();

module.exports.http_handler_instance = http_handler_instance;
module.exports.MsgHandleType = MsgHandleType;
