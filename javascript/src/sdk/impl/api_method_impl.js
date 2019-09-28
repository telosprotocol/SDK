'use strict';

const {randomBytes} = require('crypto');
const {TaskInfo} = require('./task_info');
let {XTransactionType,GLOBAL,get_sequence_id} = require('../model/global_defination');
const ByteBuffer = require('ByteBuffer');
let trans_module = require('../model/xtransaction');
let {XActionType} = require('../model/top_chain_types');
const secp256k1 = require('secp256k1');
const {http_handler_instance,MsgHandleType} = require("../rpc/http_handler");
const {CMD} = require("../rpc/request_result_definition");
const {CryptoUtil} = require("../base/crypto_util");
const {StringUtil} = require("../base/string_util");
const {ActionAssetOutParam} = require('./xaction_param');

const use_private_key = true;

const APIMethodImpl = function () {
    this.set_user_info = function (info,uinfo,method,callback,use_transaction) {
        info.set_use_transaction(use_transaction);
        info.set_host(GLOBAL.SERVER_HOST_PORT_HTTP);
        info.set_callback(callback);
        info.set_params("version",GLOBAL.SDK_VERSION);
        info.set_method(method);
        info.set_params("account_address",uinfo.get_account());
        info.set_params("method",(true === use_transaction?"send_transaction":method));
        info.set_params("token",uinfo.get_token());
        info.set_task_id(get_sequence_id());
        info.set_params("sequence_id",info.get_task_id().toString());
        info.set_params("rpc_signature::secretkey_key_",uinfo.get_secret_key());
        info.set_params("rpc_signature::method_key_",uinfo.get_sign_method());
        info.set_params("rpc_signature::version_key_",uinfo.get_sign_version());
    };
    this.make_private_key = function (private_key_wrap,address_wrap) {
        CryptoUtil.make_private_key(private_key_wrap);
        address_wrap.address= CryptoUtil.make_address_by_assign_key(private_key_wrap.key,0,0);
        return "" !== address_wrap.address.length;
    };
    this.make_child_private_key = function (parent_addr,private_key,address_wrap) {
      CryptoUtil.make_private_key(private_key);
      const addr_type = parseInt("001",8);
      address_wrap.address = CryptoUtil.make_child_address_by_assigned_key(parent_addr,private_key,addr_type);
      return "" !== address_wrap.address.length;
    };
    this.set_private_key = function (user_info,private_key) {
        let arr = [];
        for (let i = 0, j = private_key.length; i < j; ++i) {
            arr.push(private_key.charCodeAt(i));
        }
        user_info.set_private_key(
            String.fromCharCode.apply(null, new Uint8Array(arr)));
        user_info.set_account(CryptoUtil.make_address_by_assign_key(user_info.get_private_key()));
        return "" !== user_info.get_account();
    };
    this.hash_signature_action = function (action,private_key) {
        const action_hash = action.sha2();
        const hash_buffer = Buffer.from(action_hash);
        const private_key_buffer = Buffer.from(private_key);
        const auth = secp256k1.sign(hash_buffer, private_key_buffer).signature;
        const auth_hex = "0x" + StringUtil.bytes2hex(auth);
        action.set_action_authorization(auth_hex);
        return action_hash;
    };
    this.hash_signature = function (trans_action,private_key) {
        trans_action.set_digest();
        const hash =  trans_action.get_transaction_hash();
        const hash_buffer = Buffer.from(hash.array);
        const private_key_buffer = Buffer.from(private_key);
        const pub_key = secp256k1.publicKeyCreate(private_key_buffer);
        const secp256k1_sign = secp256k1.sign(hash_buffer, private_key_buffer);
        let stream = new ByteBuffer().littleEndian();
        stream.byte(secp256k1_sign.recovery).byteArray(secp256k1_sign.signature,secp256k1_sign.signature.length);
        const stream_array =  new Uint8Array(stream.pack());
        const auth_hex = "0x" + StringUtil.bytes2hex(stream_array);
        trans_action.set_authorization(auth_hex);
        trans_action.set_public_key("0x" + StringUtil.bytes2hex(pub_key));
    };
    this.create_account = function (user_info,func) {
        if("" === user_info.get_account()) {
            return false;
        }
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.CREATE_ACCOUNT,func,true);
        let sb =new ByteBuffer().littleEndian();
        const account = user_info.get_account();
        let params = sb.string(account).pack();
        //const params = StringUtil.bytes2str(new Uint8Array(array));
        let trans_action = task_info.get_trans_action();
        trans_action.set_transaction_type(XTransactionType.CreateUserAccount);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash("0xF6E9BE5D70632CF5");
        //trans_action.set_last_trans_hash(0);
        let src_action = trans_module.create_action();
        src_action.set_action_type(XActionType.SourceNull);
        src_action.set_account_addr(account);
        src_action.set_action_param(new Uint8Array(0));
        trans_action.set_source_action(src_action);
        let target_action = trans_module.create_action();
        target_action.set_action_type(XActionType.CreateUserAccount);
        target_action.set_account_addr(user_info.get_account());
        //target_action.set_action_param(params);
        target_action.set_action_param(params);
        trans_action.set_target_action(target_action);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };

    this.account_info = function (user_info,func) {
        if ("" === user_info.get_account() || "" === user_info.get_token()) {
            return false;
        }
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.ACCOUNT_INFO,func,false);
        task_info.set_params("account",user_info.get_account());
        task_info.set_callback(func);
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
    };

    this.request_token = function(user_info,func) {
        let account = user_info.get_account();
        if("" === account) {
            return false;
        }
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.TOKEN,func,false);
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };

    this.key_store = function (user_info,type,value,func) {
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.KEY_STORE,func,true);
        let sb = new ByteBuffer().littleEndian();
        const param_t =  sb.string(type).string(value).pack();
        const param_s = sb.int64(0).pack();
        const x_type = XTransactionType.SetAccountKeys;
        const s_type = XActionType.AssertOut;
        const t_type = XActionType.SetAccountKeys;
        let trans_action = task_info.get_trans_action();
        trans_action.set_gas_limit(10000);
        trans_action.set_gas_price(1);
        trans_action.set_transaction_type(x_type);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let src_action = trans_module.create_action();
        src_action.set_action_type(s_type);
        src_action.set_account_addr(user_info.get_account());
        src_action.set_action_param(param_s);
        trans_action.set_source_action(src_action);
        let target_action = trans_module.create_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr(user_info.get_account());
        target_action.set_action_param(param_t);
        trans_action.set_target_action(target_action);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };

    this.transfer = function (user_info,from,to,amout,func) {
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.TRANSFER,func,true);
        //let byte_buffer = new ByteBuffer().littleEndian();
        let action_asset_out_param = new ActionAssetOutParam("",amout,"");
        const param = action_asset_out_param.create();
        let trans_action = task_info.get_trans_action();
        trans_action.set_transaction_type(XTransactionType.Transfer);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(XActionType.AssertOut);
        source_action.set_account_addr(from);
        source_action.set_action_param(param);
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(XActionType.AssetIn);
        target_action.set_account_addr(to);
        target_action.set_action_param(param);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };
    this.account_transaction = function (user_info,account,last_hash,func) {
        if ("" === user_info.get_account() || "" === user.get_token()) {
            return false;
        }
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.TRANSFER,func,false);
        task_info.set_params("account",account);
        task_info.set_params("tx_hash",last_hash);
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };
    this.create_constract = function (user_info,
                                      constract_address,
                                      constract_code,
                                      constract_private_key,
                                      func) {
        if("" === user_info.get_account() ||
            "" === user_info.get_token() ||
            "" === user_info.get_last_hash()) {
            return false;
        }
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.CREATE_CONTRACT,func);
        let byte_buffer = new ByteBuffer().littleEndian();
        const param_s = byte_buffer.int64(GLOBAL.MIN_DEPOSIT).pack();
        const param_t = byte_buffer.string(constract_code).pack();
        const type = 1;
        const s_type = 3;
        const t_type = 3;
        let trans_action = task_info.get_trans_action();
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(s_type);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(param_s);
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr(constract_address);
        target_action.set_action_param(param_t);
        if (use_private_key) {
            this.hash_signature_action(target_action, constract_private_key);
        }
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };
    this.publish_constract = function (user_info,
                                       constract_account,
                                       constract_code,
                                       func) {
        if("" === user_info.get_account() ||
            "" === user_info.get_token() ||
            "" === user_info.get_last_hash()) {
            return false;
        }
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.PUBLISH_CONTRACT,func,true);
        let byte_buffer = new ByteBuffer().littleEndian();
        const param = byte_buffer.string(constract_code).pack();
        let trans_action = task_info.get_trans_action();
        trans_action.set_transaction_type(XTransactionType.DeployContract);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(XActionType.SourceNull);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param("");
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(XActionType.DeployConstract);
        target_action.set_account_addr(constract_account);
        target_action.set_action_param(param);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };
    this.call_constract = function (user_info,
                                    constract_account,
                                    constract_func,
                                    constract_params,
                                    func) {
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.CALL_CONTRACT,func);
        let byte_buffer = new ByteBuffer().littleEndian();
        const param = byte_buffer.string(constract_params).pack();
        let trans_action = task_info.get_trans_action();
        trans_action.set_transaction_type(XTransactionType.DeployContract);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(XActionType.SourceNull);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(new Uint8Array(0));
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(XActionType.DeployConstract);
        target_action.set_account_addr(constract_account);
        target_action.set_action_param(param);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };
    this.get_property = function (user_info,type,data1,data2,func) {
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.GET_PROPERTY,func,false);
        task_info.set_params("account",user_info.get_account());
        task_info.set_params("type",type);
        task_info.set_params("data1",data1);
        task_info.set_params("data2",data2);
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
        return true;
    };
    this.create_sub_account = function (user_info,child_address,child_private_key,func) {
        if("" === user_info.get_account() ||
            "" === user_info.get_token() ||
            "" === user_info.get_last_hash() ||
            "" === user_info.get_child().get_account()) {
            return false;
        }
        const public_key = this.get_public_key(user_info.get_private_key());
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.CREATE_CHILD_ACCOUNT,func);
        let byte_buffer = new ByteBuffer().littleEndian();
        const param_s = byte_buffer.int64(GLOBAL.MIN_DEPOSIT).pack();
        const param_t = byte_buffer.pack();
        const type = XTransactionType.CreateChildAccount;
        const s_type = 17;
        const t_type = 17;
        const trans_action = task_info.get_trans_action();
        trans_action.set_transaction_type(type);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = task_info.get_source_action();
        source_action.set_action_type(s_type);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(param_s);
        let target_action = task_info.get_target_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr(child_address);
        target_action.set_action_param(param_t);
        if (undefined !== child_private_key) {
            this.hash_signature_action(target_action, child_private_key);
        }
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
    };
    this.get_public_key = function (private_key) {
        let priv_key = private_key_wrap.private_key;
        do {
            priv_key = randomBytes(32)
        } while (!secp256k1.privateKeyVerify(priv_key));
        return secp256k1.publicKeyCreate(priv_key);
    };
    this.lock_token = function (user_info,version,amout,unlock_type,unlock_value,func) {
        let task_info = new TaskInfo();
        this.set_user_info(info,user_info,CMD.LOCK_TOKEN,func);
        let stream_t = new ByteBuffer().littleEndian();
        stream_t = stream_t.uint32(version).int64(amout).uint32(unlock_type);
        for(let value of unlock_value) {
            stream_t.string(value);
        }
        const param_t =stream_t.pack();
        let stream_s = new ByteBuffer().littleEndian();
        const param_s = stream_s.int64(0).pack();
        const x_type = XTransactionType.LockToken;
        const s_type = XActionType.AssertOut;
        const t_type = XActionType.LockToken;
        let trans_action = task_info.get_trans_action();
        trans_action.set_gas_limit(10000);
        trans_action.set_gas_price(1);
        trans_action.set_transaction_type(x_type);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = task_info.get_trans_action();
        source_action.set_action_type(s_type);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(param_s);
        let target_action = task_info.get_target_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr(user_info.get_account());
        target_action.set_action_param(param_t);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
    };
    this.unlock_token = function (user_info,version,tx_hash,signs,func) {
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.UNLOCK_TOKEN,func);
        let stream_t = new ByteBuffer().littleEndian();
        stream_t = stream_t.uint32(version).string(tx_hash);
        for(let sign of signs) {
            stream_t.string(sign);
        }
        const param_t = stream_t.pack();
        let stream_s = new ByteBuffer().littleEndian();
        const param_s =  stream_s.int64(0).pack();
        const x_type = XTransactionType.UnlockToken;
        const s_type = XActionType.AssertOut;
        const t_type = XActionType.UnlockToken;
        let trans_action = task_info.get_trans_action();
        trans_action.set_gas_limit(10000);
        trans_action.set_gas_price(1);
        trans_action.set_transaction_type(x_type);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(s_type);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(param_s);
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr(user_info.get_account());
        target_action.set_action_param(param_t);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
    };
    this.get_vote = function (user_info,amount,validity_period,func) {
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.GET_VOTE,func);
        let stream_t = new ByteBuffer().littleEndian();
        const param_t = stream_t.uint32(amount).uint32(validity_period).pack();
        const x_type = XTransactionType.UnlockToken;
        const s_type = XActionType.AssertOut;
        const t_type = XActionType.UnlockToken;
        let trans_action = task_info.get_trans_action();
        trans_action.set_gas_limit(10000);
        trans_action.set_gas_price(1);
        trans_action.set_transaction_type(x_type);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(s_type);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(param_t);
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr(user_info.get_account());
        target_action.set_action_param(param_t);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
    };
    this.vote = function (user_info,addr_to,lock_hash,amout,expiration,func) {
        if("" === lock_hash) {
            return;
        }
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.VOTE,func,true);
        const hash = StringUtil.hex2bytes(lock_hash);
        let stream_s = new ByteBuffer().littleEndian();
        const param_s =
            stream_s
            .string(addr_to)
            .uint32(hash.length).byteArray(hash,hash.length)
            .int64(amout).int64(expiration).pack();
        let stream_t = new ByteBuffer().littleEndian();
        const param_t =
            stream_t
            .string(user_info.get_account())
            .string(addr_to)
            .uint32(hash.length).byteArray(hash,hash.length)
            .int64(amout).int64(expiration).pack();
        const x_type = XTransactionType.UnlockToken;
        const s_type = XActionType.AssertOut;
        const t_type = XActionType.UnlockToken;
        let trans_action = task_info.get_trans_action();
        trans_action.set_gas_limit(10000);
        trans_action.set_gas_price(1);
        trans_action.set_transaction_type(x_type);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(s_type);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(param_s);
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr("T-vote_smart_constract");
        target_action.set_action_name("vote");
        target_action.set_action_param(param_t);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
    };
    this.abolish_vote = function(user_info,cadidate_address,turns,amount,func) {
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.ABOLISH_VOTE,func);
        let stream_t = new ByteBuffer().littleEndian();
        const param_t =  stream_t.int64(turns).uint32(amount).pack();
        let stream_s = new ByteBuffer().littleEndian();
        const param_s = stream_s.int64(0).pack();
        const x_type = XTransactionType.UnlockToken;
        const s_type = XActionType.AssertOut;
        const t_type = XActionType.UnlockToken;
        let trans_action = task_info.get_trans_action();
        trans_action.set_gas_limit(10000);
        trans_action.set_gas_price(1);
        trans_action.set_transaction_type(x_type);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(s_type);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(param_s);
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr(user_info.get_account());
        target_action.set_action_param(param_t);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
    };
    this.return_vote = function (user_info,func) {
        let task_info = new TaskInfo();
        this.set_user_info(task_info,user_info,CMD.RETURN_VOTE,func);
        let stream_t = new ByteBuffer().littleEndian();
        const param_t = stream_t.int64(0).pack();
        let stream_s = new ByteBuffer().littleEndian();
        const param_s = stream_s.int64(0).pack();
        const x_type = XTransactionType.UnlockToken;
        const s_type = XActionType.AssertOut;
        const t_type = XActionType.UnlockToken;
        let trans_action = task_info.get_trans_action();
        trans_action.set_gas_limit(10000);
        trans_action.set_gas_price(1);
        trans_action.set_transaction_type(x_type);
        trans_action.set_last_trans_nonce(user_info.get_nonce());
        const cur_timestamp = Math.round(new Date().getTime() / 1000);
        trans_action.set_fire_timestamp(cur_timestamp);
        trans_action.set_expire_duration(100);
        trans_action.set_last_trans_hash(user_info.get_last_hash_xxhash64());
        let source_action = trans_action.get_source_action();
        source_action.set_action_type(s_type);
        source_action.set_account_addr(user_info.get_account());
        source_action.set_action_param(param_s);
        let target_action = trans_action.get_target_action();
        target_action.set_action_type(t_type);
        target_action.set_account_addr(user_info.get_account());
        target_action.set_action_param(param_t);
        const private_key = user_info.get_private_key();
        if (use_private_key) {
            this.hash_signature(trans_action, private_key);
        }
        http_handler_instance.post_message(MsgHandleType.MsgAddTask,task_info);
    }
};

module.exports.APIMethodImpl = APIMethodImpl;
