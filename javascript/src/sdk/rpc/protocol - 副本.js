'use strict';
let XTransaction = require("../model/xtransaction").XTransaction;
let rpc_signatrue = require("../rpc/rpc_signatrue").rpc_signatrue;
let {CMD,RSP_SEGMENT} = require("./request_result_definition");
const {ResultBase,
    RequestTokenResult,CreateAccountResult,AccountInfoResult,TransferResult,
    GetPropertyReuslt,AccountTransactionResult,CreateConstractAccountResult,
    PublicConstractResult,CallConstractResult,CreateChildAccountResult,
    LockTokenResult,UnlockTokenResult} = require("../model/top_chain_types");
const {assert} = require("assert");

const k_account_address = "account_address";
const k_token = "token";
const k_signature = "signature";
const k_sign_method = "signature_method";
const k_sign_version = "signature_ver_code";
const k_secret_key = "secret_key";
const k_keyid = "keyid";
const {StringUtil} = require("../base/string_util");

const content_name = new Set([
    "account_address",
    "key_id",
    "nounce",
    "time_stamp",
    "signature",
    "token",
    "expire",
    "method",
    "action",
    "version",
    "seed",
    "hash",
    "gas",
    "gasprice",
    "sequence_id",
    "fragment_id",
    "cookie",
    "body"]);

class Protocol {
    constructor() {
        this.m_use_signature = false;
        this.m_trans_action = undefined;
        this.m_param_names = undefined;
    }

    encode(params, body) {
        let body_params_wrap = {str:""};
        this.encode_body(params, body_params_wrap);
        params.set("body",body_params_wrap.str);
        for (const pair of params) {
            if (this.is_param_key_effect(pair[0])) {
                body.str += (0 === body.length ? "" : "&");
                body.str += encodeURI(pair[0]);
                body.str += "=";
                body.str += pair[1];
            }
        }

        if (true === this.m_use_signature) {
            const br = this.signature(params, body);
            assert.ok(br,"signature failed");
        }
        return body.str.length;
    }

    decode(params, task_info) {
        let root = JSON.parse(params);
        let result = new ResultBase();
        const sequence_id = root[RSP_SEGMENT.SEQUENCE_ID];
        const error_no = root[RSP_SEGMENT.ERROR_NO];
        const error_msg = root[RSP_SEGMENT.ERROR_MSG];
        if (sequence_id.isString()) {
            result.set_sequence_id(sequence_id.toNumber());
        }
        if (error_no.isNumber()) {
            result.set_error(error_no.toNumber());
        }
        if (error_msg.isString()) {
            result.set_err_msg(error_msg.toString());
        }
        const func_call_back = task_info.get_callback();
        if (undefined === func_call_back) {
            return false;
        }
        func_call_back(result);
        return true;
    }

    encode_body(params, body_wrap) {
        let root = {};
        for (const pair of params) {
            if (pair[0] === "body" || pair[0] === "token") {
                continue;
            }
            if (this.is_param_key_effect(pair[0])) {
                root[pair[0]] = pair[1];
            }
        }
        if (undefined !== this.m_trans_action) {
            this.encode_transaction_params(root, this.m_trans_action);
        } else {
            this.encode_body_params(params, root);
        }
        body_wrap.str += JSON.stringify(root);
        return body_wrap.str.length;
    }
    set_transaction(trans_action) {
        this.m_trans_action = trans_action;
    }
    is_param_key_effect(key) {
        return content_name.has(key);
    }
    signature(params, body) {
        let secret_key = "";
        const sign_str = "";
        let val_find = params[rpc_signatrue.s_secretkey_key];
        if (undefined !== val_find) {
            secret_key = val_find;
        }
        if (this.m_secret_key.empty()) {
            return false;
        }
        let sign = new rpc_signatrue();
        sign.set_secret_key(secret_key);
        val_find = params[rpc_signatrue.s_method_key];
        if (undefined === val_find) {
            return false;
        }
        sign.set_sign_version(val_find);
        if (false === sign.create_signature(body.str, sign_str)) {
            return false;
        }
        body.str += (0 === body.str.length ? "" : "&");
        body.str += encodeURI(rpc_signatrue.s_signature_key);
        body.str += "=";
        body.str += encodeURI(sign_str);
        return true;
    }
    encode_transaction_params(root, tx) {
        root['params'] = {};
        let result_json = root['params'];
        result_json['version'] = tx.get_version();
        result_json['gas_price'] = tx.get_gas_price();
        result_json['gas_limit'] = tx.get_gas_limit();
        result_json['to_account_id'] = tx.get_to_account_id();
        result_json['from_account_id'] = tx.get_from_account_id();
        result_json['to_network_id'] = tx.get_to_network_id();
        result_json['from_network_id'] = tx.get_from_network_id();
        result_json['transaction_type'] = tx.get_transaction_type();
        result_json['transaction_len'] = tx.get_transaction_len();
        result_json['expire_duration'] = tx.get_expire_duration();
        result_json['fire_timestamp'] = tx.get_fire_timestamp();
        result_json['trans_random_nounce'] = tx.get_trans_random_nounce();
        result_json['hash_work_proof'] = tx.get_hash_work_proof();
        result_json['last_unit_hight'] = tx.get_last_unit_hight();
        result_json['last_unit_hash'] = tx.get_last_unit_hash();
        result_json['last_trans_nonce'] = tx.get_last_trans_nonce();
        result_json['last_trans_hash'] = tx.get_last_trans_hash();
        result_json['parent_account'] = tx.get_parent_account();
        result_json['authority_keys'] = tx.get_authority_keys();
        root['params']['source_action'] = {};
        const s_action_json = root['params']['source_action'];
        const source_action = tx.get_source_action();
        s_action_json['action_hash'] = source_action.get_action_hash();
        s_action_json['action_type'] = source_action.get_action_type();
        s_action_json['action_size'] = source_action.get_action_size();
        s_action_json['account_addr'] = source_action.get_account_addr();
        s_action_json['action_name'] = source_action.get_action_name();
        s_action_json['action_param'] = StringUtil.str2hex(source_action.get_action_param());
        s_action_json['action_authorization'] = StringUtil.str2hex(source_action.get_action_authorization());
        root['params']['target_action'] = {};
        const t_action_json = root['params']['target_action'];
        const target_action = tx.get_target_action();
        t_action_json['action_hash'] = target_action.get_action_hash();``
        t_action_json['action_type'] = target_action.get_action_type();
        t_action_json['action_size'] = target_action.get_action_size();
        t_action_json['account_addr'] = target_action.get_account_addr();
        t_action_json['action_name'] = target_action.get_action_name();
        const target_action_param = target_action.get_action_param();
        t_action_json['action_param'] =   target_action_param;
        t_action_json['action_authorization'] = StringUtil.str2hex(target_action.get_action_authorization());
        const trans_hash = tx.get_transaction_hash();
        result_json['transaction_hash'] =  (undefined === trans_hash?"":trans_hash.hex);
        result_json['authorization'] = tx.get_authorization();
        result_json['public_key'] = tx.get_public_key();
    }
    encode_body_params(params, root) {
        for (let name in this.m_param_names) {
            const val_find = params[name];
            if (undefined !== val_find) {
                root['param'][name] = val_find;
            } else {
                root['param'][name] = "";
            }
        }
        return true;
    }
}

Protocol.s_create_funcs = new Map();

Protocol.create = function(method) {
    Protocol.create.registed = false;
    if (false === Protocol.create.registed) {
        Protocol.regist_protocols();
        Protocol.create.registed = true;
    }
    let val_find = Protocol.s_create_funcs[method];
    if (undefined !== val_find) {
        return val_find();
    } else {
        val_find = Protocol.s_create_funcs["__default"];
        if (undefined !== val_find) {
            return val_find();
        }
    }
    return undefined;
}

class RequestTokenCmd extends Protocol {
    constructor() {
        super();
    }
    decode(params,task_info) {
        let root = params.data;
        let result = new RequestTokenResult();
        const sequence_id = root[RSP_SEGMENT.SEQUENCE_ID];
        const error_no = root[RSP_SEGMENT.ERROR_NO];
        const error_msg = root[RSP_SEGMENT.ERROR_MSG];
        result.set_sequence_id(Number(sequence_id))
        result.set_error(Number(error_no));
        result.set_err_msg(error_msg);
        const data = root[RSP_SEGMENT.DATA];
        if (undefined !== data) {
            result.set_token(data[k_token]);
            result.set_secret_key(data[k_secret_key]);
            result.set_sign_method(data[k_sign_method]);
            result.set_sign_version(data[k_sign_version]);
        }

        const func_call_back = task_info.get_callback();
        if (undefined === func_call_back) {
            const {http_handler_instance} = require("./http_handler");
            http_handler_instance.handle_request_token_result(result);
            return;
        }
        func_call_back(result);
        return;
    };
}

class CreateAccountCmd extends Protocol {
    constructor() {
        super();
        this.m_cur_param_names = ["account"];
        this.m_param_names = this.m_cur_param_names;
    }
    decode(params,task_info) {
        let root = params.data;
        let result = new CreateAccountResult();
        const sequence_id = root[RSP_SEGMENT.SEQUENCE_ID];
        const error_no = root[RSP_SEGMENT.ERROR_NO];
        const error_msg = root[RSP_SEGMENT.ERROR_MSG];
        result.set_sequence_id(Number(sequence_id))
        result.set_error(Number(error_no));
        result.set_err_msg(error_msg);

        const data = root[RSP_SEGMENT.DATA];
        if(undefined !== data) {
        }

        const func_call_back = task_info.get_callback();
        if (undefined === func_call_back) {
            const {http_handler_instance} = require("./http_handler");
            http_handler_instance.handle_create_account_result(result);
            return false;
        }
        func_call_back(result);
        return true;
    }
}

class AccountInfoCmd  extends Protocol {
    constructor() {
        super();
        this.m_cur_param_names = ["account","tx_hash"];
        this.m_param_names = this.m_cur_param_names;
    }
    decode(params,task_info) {
        let root = params.data;
        let result = new AccountInfoResult();
        const sequence_id = root[RSP_SEGMENT.SEQUENCE_ID];
        const error_no = root[RSP_SEGMENT.ERROR_NO];
        const error_msg = root[RSP_SEGMENT.ERROR_MSG];
        result.set_sequence_id(Number(sequence_id))
        result.set_error(Number(error_no));
        result.set_err_msg(error_msg);
        const data = root[RSP_SEGMENT.DATA];
        if(undefined !== data) {
            result.set_account(data['account'].toString());
            result.set_last_hash(data['last_hash'].toString());
            result.set_balance(Number(data['balance']));
            result.set_nonce(Number(data['nonce']));
            result.set_last_xxhash64(Number(data['last_hash_xxhash64']));
        }

        const func_call_back = task_info.get_callback();
        if (undefined === func_call_back) {
            const {http_handler_instance} = require("./http_handler");
            http_handler_instance.handle_account_info_result(result);
            return false;
        }
        func_call_back(result);
        return true;
    }
}

Protocol.regist_protocols = function() {
    Protocol.regist_create_function("__default",()=>{ return new Protocol();});
    Protocol.regist_create_function(CMD.TOKEN,()=> { return new RequestTokenCmd(); });
    Protocol.regist_create_function(CMD.CREATE_ACCOUNT,()=> { return new CreateAccountCmd(); });
    Protocol.regist_create_function(CMD.ACCOUNT_INFO,()=>{ return new AccountInfoCmd(); });
    Protocol.regist_create_function(CMD.ACCOUNT_TRANSACTION,()=>{ return new AccountTransactionCmd(); });
    Protocol.regist_create_function(CMD.TRANSFER,()=>{ return new TransferCmd(); });
    Protocol.regist_create_function(CMD.KEY_STORE,()=>{ return new KeyStoreCmd(); });
    Protocol.regist_create_function(CMD.GET_PROPERTY,()=>{ return new GetPropertyCmd(); });
    Protocol.regist_create_function(CMD.PUBLISH_CONTRACT,()=>{ return new PublicContractCmd(); });
    Protocol.regist_create_function(CMD.CREATE_CONTRACT,()=>{ return new CreateConstractCmd(); });
    Protocol.regist_create_function(CMD.CREATE_CHILD_ACCOUNT,()=>{ return new CreateChildAccountCmd(); });
    Protocol.regist_create_function(CMD.LOCK_TOKEN,()=>{ return new LockTokenCmd(); });
    Protocol.regist_create_function(CMD.UNLOCK_TOKEN,()=>{ return new UnlockTokenCmd(); });
}

Protocol.regist_create_function = function(method,create_func) {
    Protocol.s_create_funcs[method] = create_func;
}


class AccountTransactionCmd extends Protocol {
    constructor() {
        super();
        this.m_cur_param_names = ["account", "tx_hash"];
        this.m_param_names = this.m_cur_param_names;
    }
    decode(params, task_info) {
        let root = params.data;
        let result = new AccountInfoResult();
        const sequence_id = root[RSP_SEGMENT.SEQUENCE_ID];
        const error_no = root[RSP_SEGMENT.ERROR_NO];
        const error_msg = root[RSP_SEGMENT.ERROR_MSG];
        result.set_sequence_id(Number(sequence_id))
        result.set_error(Number(error_no));
        result.set_err_msg(error_msg);
        const data = root[RSP_SEGMENT.DATA];
        result.set_authorization(data['authorization']);
        result.set_expire_duration(Number(data['expire_duration']));
        result.set_fire_timestamp(Number(data['fire_timestamp']));
        result.set_from_account_id(Number(data['from_account_id']));
        result.set_from_network_id(Number(data['from_network_id']));
        result.set_hash_work_proof(Number(data['hash_work_proof']));
        result.set_last_trans_hash(Number(data['last_trans_hash']));
        result.set_last_trans_nonce(Number(data['last_trans_nonce']));
        result.set_last_unit_hash(Number(data['last_unit_hash']));
        result.set_last_unit_hight(Number(data['last_unit_hight']));
        result.set_to_account_id(Number(data['to_account_id']));
        result.set_to_network_id(Number(data['to_network_id']));
        result.set_trans_random_nounce(Number(data['trans_random_nounce']));
        result.set_transaction_hash(Number(data['transaction_hash']));
        result.set_transaction_len(Number(data['transaction_len']));
        result.set_transaction_type(Number(data['transation_type']));
        const source_action_data = data['source_action'];
        if(undefined !== source_action_data) {
            let source_action = result.get_source_action();
            source_action.set_account_addr(source_action_data['account_addr']);
            source_action.set_action_authorization(source_action_data['action_authorization']);
            source_action.set_action_hash(Number(source_action_data['action_hash']));
            source_action.set_action_name(source_action_data['action_name']);
            source_action.set_action_param(source_action_data['action_param']);
            source_action.set_action_size(source_action_data['action_size']);
        }
        const target_action_data = data['target_action'];
        if(undefined !== target_action_data) {
            let target_action = result.get_target_action();
            target_action.set_account_addr(target_action_data['account_addr']);
            target_action.set_action_authorization(target_action_data['action_authorization']);
            target_action.set_action_hash(Number(target_action_data['action_hash']));
            target_action.set_action_name(target_action_data['action_name']);
            target_action.set_action_param(target_action_data['action_param']);
            target_action.set_action_size(target_action_data['action_size']);
        }
        const func_call_back = task_info.get_callback();
        if (undefined === func_call_back) {
            const {http_handler_instance} = require("./http_handler");
            http_handler_instance.handle_account_transaction_result(result);
            return false;
        }
        func_call_back(result);
        return true;
    }
}

class TransferCmd extends Protocol {
    constructor() {
        super();
        this.m_cur_param_names = ["from","to","amount","nonce","last_hash"];
        this.m_param_names = this.m_cur_param_names;
    }
    encode_body_params(params,root) {
    }
    decode(params,task_info) {
        let root = params.data;
        let result = new AccountInfoResult();
        const sequence_id = root[RSP_SEGMENT.SEQUENCE_ID];
        const error_no = root[RSP_SEGMENT.ERROR_NO];
        const error_msg = root[RSP_SEGMENT.ERROR_MSG];
        result.set_sequence_id(Number(sequence_id))
        result.set_error(Number(error_no));
        result.set_err_msg(error_msg);
        const func_call_back = task_info.get_callback();
        if (undefined === func_call_back) {
            const {http_handler_instance} = require("./http_handler");
            http_handler_instance.handle_transfer_result(result);
            return false;
        }
        func_call_back(result);
    }
}

class KeyStoreCmd extends Protocol {
    constructor() {
        super();
        this.m_cur_param_names = ["from", "to", "type", "nonce", "last_hash", "key", "value"];
        this.m_param_names = this.m_cur_param_names;
    }

    encode_body_params(params,root) {
    }
    decode(params,task_info) {
    }
}

class GetPropertyCmd extends Protocol {
    constructor() {
        super();
        this.m_cur_param_names = ["account", "type", "data1", "data2"];
        this.m_param_names = this.m_cur_param_names;
    }

    encode_body_params(params,root) {
        let data1 = "";
        let data2 = "";
        let type = "";
        root['params'] = {};
        for (let name of this.m_cur_param_names) {
            const val_find = params.get(name);
            if (undefined !== val_find) {
                if("data1" === name) {
                    data1 = val_find;
                } else if ("data2" === name) {
                    data2 = val_find;
                } else {
                    if("type" === name) {
                        type = val_find;
                    }
                    root["params"][name] = val_find;
                }
            } else {
            }
        }
        if ("map" === type) {
            root["params"]["data"] +=data1;
            root["params"]["data"] += data2;
        } else {
            root["params"]["data"] = data1;
        }
        return true;
    }

    decode(params,task_info) {

    }
}

class CreateConstractCmd extends Protocol {
    constructor() {
        super();
    }

    decode(params,task_info) {
    }
}

class PublicContractCmd extends Protocol {
    constructor() {
        super();
    }
    decode(params,task_info) {
    }
}

class CreateChildAccountCmd extends Protocol {
    constructor() {
        super();
    }
    decode(params,task_info) {
    }
}

class LockTokenCmd extends Protocol {
    constructor() {
     super();
    }
    decode(params,task_info) {
    }
}

class UnlockTokenCmd extends  Protocol{
    constructor() {
        super();
    }
    decode(params,task_info) {
    }
}

module.exports.s_create_funcs = new Map();
module.exports.Protocol = Protocol;
