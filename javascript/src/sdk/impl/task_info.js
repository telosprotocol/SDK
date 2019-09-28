'use strict';

let transaction_module = require('../model/xtransaction');

let Param = {
    Account : "account",
    BlockType : "block_type",
    BlockOwner: "block_owner",
    GetBlockType : "get_block_type",
    BlockHash : "block_hash",
    BlockHeight : "block_height"
};

class TaskInfo {
    constructor() {
        this.task_id = 0;
        this.host = "";
        this.uri = "";
        this.content = "";
        this.method = "";
        this.params = new Map();
        this.trans_action = transaction_module.create_xtransaction();
        this.use_transaction = false;
    }
    get_task_id() {
        return this.task_id;
    }
    set_task_id(task_id) {
        this.task_id = task_id;
    }
    get_host() {
        return this.host;
    }
    set_host(host) {
        this.host = host;
    }
    get_uri() {
        return this.uri;
    }
    set_uri(uri) {
        this.uri = uri;
    }
    get_content() {
        return this.content;
    }
    set_content(content) {
        return this.content;
    }
    get_method() {
        return this.method;
    }
    set_method(method) {
        this.method = method;
    }
    get_params() {
        return this.params;
    }
    set_params(params) {
        this.params = params;
    }
    set_params(key,value) {
        this.params[key] = value;
    }
    get_trans_action() {
        return this.trans_action;
    }
    set_trans_action(trans_action) {
        this.trans_action = trans_action;
    }
    get_use_transaction() {
        return this.use_transaction;
    }
    set_use_transaction(use_transaction) {
        this.use_transaction = use_transaction;
    }
    get_callback() {
        return this.callback;
    }
    set_callback(callback) {
        this.callback = callback;
    }
}

module.exports.TaskInfo = TaskInfo;
module.exports.Param = Param;
