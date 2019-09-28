'use strict';

class ResultBase {
    constructor(error,err_msg,sequence_id) {
        this.error = error;
        this.err_msg = err_msg;
        this.sequence_id = sequence_id;
    }
    get_error() {
        return this.error;
    }
    set_error(error) {
        this.error = error;
    }
    get_err_msg() {
        return this.err_msg;
    }
    set_err_msg(err_msg) {
        this.err_msg = err_msg;
    }
    get_sequence_id() {
        return this.sequence_id;
    }
    set_sequence_id(sequence_id) {
        this.sequence_id = sequence_id;
    }
}

class CreateAccountResult extends ResultBase {
    constructor(account) {
        super();
        this.account = account;
    }
}

let XActionType = {
    AssertOut : 0,
    SourceNull: 1,
    CreateUserAccount: 2,
    CreateConstractAccount: 3,
    DeployConstract: 4,
    RunConstract: 5,
    AssetIn: 6,
    PropertyOp: 7,
    AliasName: 8,
    GlobalName: 9,
    JoinRequest: 11,
    SetAccountKeys: 12,
    LockToken : 13,
    UnlockToken : 14,
    GetConsensusRandom : 16
}

class RequestTokenResult extends ResultBase {
    constructor(
        error, err_msg, sequence_id,
        token, secret_key, sign_method, sign_version) {
        super(error, err_msg, sequence_id);
        this.m_token = token;
        this.m_secret_key = secret_key;
        this.m_sign_method = sign_method;
        this.m_sign_version = sign_version;
    }
    set_token(token) {
        this.m_token = token;
    }
    set_secret_key(secret_key) {
        this.m_secret_key = secret_key;
    }
    set_sign_method(sign_method) {
        this.m_sign_method = sign_method;
    }
    set_sign_version(sign_version) {
        this.set_sign_version = sign_version;
    }
    get_token() {
        return this.m_token;
    }
    get_secret_key() {
        return this.m_secret_key;
    }
    get_sign_method() {
        return this.m_sign_method;
    }
    get_sign_version() {
        return this.m_sign_version;
    }
}

class AccountInfoResult extends ResultBase {
    constructor() {
        super();
        this.m_balance = 0;
        this.m_nonce = 0;
        this.m_account = "";
        this.m_last_hash = "";
        this.m_last_hash_xxhash64 = "";
        this.m_last_unit_height = 0;
    }
    get_balance() {
        return this.m_balance;
    }
    set_balance(balance) {
        this.m_balance = balance;
    }
    get_nonce() {
        return this.m_nonce;
    }
    set_nonce(nonce) {
        this.m_nonce = nonce;
    }
    get_account() {
        return this.m_account;
    }
    get_last_unit_height() {
        return this.m_last_unit_height;
    }
    set_account(account) {
        this.m_account = account;
    }
    get_last_hash() {
        return this.m_last_hash;
    }
    set_last_hash(last_hash) {
        this.m_last_hash = last_hash;
    }
    get_last_hash_xxhash64() {
        return this.m_last_hash_xxhash64;
    }
    set_last_xxhash64(last_xxhash64) {
        this.m_last_hash_xxhash64 = last_xxhash64;
    }
    set_last_unit_height(last_unit_height) {
        this.m_last_unit_height = last_unit_height;
    }
}

class TransferResult extends ResultBase {
    constructor() {
        super();
        this.m_info = "";
    }
    get_info() {
        return this.m_info;
    }
    set_info(info) {
        this.m_info = info;
    }
}

class GetPropertyReuslt extends ResultBase {
    constructor() {
        super();
    }
}


class AccountTransactionResult extends ResultBase {
    constructor() {
        super();
        this.m_authorization = "";
        this.m_expire_duration = 0 ;
        this.m_fire_timestamp = 0;
        this.m_from_account_id = 0;
        this.m_from_network_id = 0;
        this.m_hash_work_proof = 0;
        this.m_last_trans_hash = 0;
        this.m_last_trans_nonce = 0;
        this.m_last_unit_hash = 0;
        this.m_last_unit_hight = 0;
        this.m_to_account_id = 0;
        this.m_to_network_id = 0;
        this.m_trans_random_nounce = 0;
        this.m_transaction_hash = "";
        this.m_transaction_len = 0;
        this.m_transaction_type = 0;
        this.m_source_action = new AccountTransactionResult.Action();
        this.m_target_action = new AccountTransactionResult.Action();
    }
    get_authorization() {
        return this.m_authorization;
    }
    set_authorization(authotization) {
        this.m_authorization = authotization;
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
    get_from_account_id() {
        return this.m_from_account_id;
    }
    set_from_account_id(from_account_id) {
        this.m_from_account_id = from_account_id;
    }
    get_from_network_id() {
        return this.m_from_network_id;
    }
    set_from_network_id(from_network_id) {
        this.m_from_network_id = from_network_id;
    }
    get_hash_work_proof() {
        return this.m_hash_work_proof;
    }
    set_hash_work_proof(hash_work_proof) {
        this.m_hash_work_proof = hash_work_proof;
    }
    get_last_trans_hash() {
        return this.m_last_trans_hash;
    }
    set_last_trans_hash(last_trans_hash) {
        this.m_last_trans_hash = last_trans_hash;
    }
    get_last_trans_nonce() {
        return this.m_last_trans_nonce;
    }
    set_last_trans_nonce(last_trans_nonce) {
        this.m_last_trans_nonce = last_trans_nonce;
    }
    get_last_unit_hash() {
        return this.m_last_unit_hash;
    }
    set_last_unit_hash(last_unit_hash) {
        this.m_last_unit_hash = last_unit_hash;
    }
    get_last_unit_hight() {
        return this.m_last_unit_hight;
    }
    set_last_unit_hight(last_unit_high) {
        this.m_last_unit_hight = last_unit_high;
    }
    get_to_account_id() {
        return this.m_to_account_id;
    }
    set_to_account_id(to_account_id) {
        this.m_to_account_id = to_account_id;
    }
    get_to_network_id() {
        return this.m_to_network_id;
    }
    set_to_network_id(to_network_id) {
        this.m_to_network_id = to_network_id;
    }
    get_trans_random_nounce() {
        return this.m_trans_random_nounce;
    }
    set_trans_random_nonce(trans_random_nonce) {
        this.m_trans_random_nounce  = trans_random_nonce;
    }
    get_transaction_hash() {
        return this.m_transaction_hash;
    }
    set_transaction_hash(transaction_hash) {
        this.m_transaction_hash = transaction_hash;
    }
    get_transaction_len() {
        return this.m_transaction_len;
    }
    set_transaction_len(transaction_len) {
        this.m_transaction_len = transaction_len;
    }
    get_transaction_type() {
        return this.m_transaction_type;
    }
    set_transaction_type(transaction_type) {
        this.m_transaction_type = transaction_type;
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
        this.m_target_action  =target_action;
    }
}

AccountTransactionResult.Action = function() {
    this.m_account_addr = "";
    this.m_action_authorization = "";
    this.m_action_hash = 0;
    this.m_action_name = "";
    this.m_action_param = "";
    this.m_action_type = 0;
    this.m_action_size = 0;
    this.get_account_addr = function () {
        return this.m_account_addr;
    };
    this.set_account_addr = function(account_addr) {
        this.m_account_addr = account_addr;
    };
    this.get_action_authorization = function () {
        return this.m_action_authorization;
    };
    this.set_action_authorization = function (action_authorization) {
        this.m_action_authorization = action_authorization;
    }
    this.get_action_hash = function() {
        return this.m_action_hash;
    }
    this.set_action_hash = function (action_hash) {
        this.m_action_hash = action_hash;
    }
    this.get_action_name = function () {
        return this.m_action_name;
    }
    this.set_action_name = function (action_name) {
        this.m_action_name = action_name;
    }
    this.get_action_param = function () {
        return this.m_action_param;
    }
    this.set_action_param = function (action_param) {
        this.m_action_param = action_param;
    }
    this.get_action_size = function () {
        return this.m_action_type;
    }
    this.set_action_size = function(action_type) {
        this.m_action_type = action_type;
    }
    this.get_action_type = function() {
        return this.m_action_type;
    }
    this.set_action_type = function (action_type) {
        this.m_action_type = action_type;
    }
};

class CreateConstractAccountResult extends ResultBase{
    constructor() {
        super();
    }
}

class PublicConstractResult extends  ResultBase {
    constructor() {
        super();
    }
}

class CallConstractResult extends ResultBase {
    constructor() {
        super();
    }
}

class CreateChildAccountResult extends  ResultBase {
    constructor() {
        super();
    }
}

class LockTokenResult extends ResultBase {
    constructor() {
        super();
    }
}

class UnlockTokenResult extends  ResultBase {
    constructor() {
        super();
    }
}

class GetVoteResult extends ResultBase {
    constructor() {
        super();
    }
}

class VoteResult extends ResultBase {
    constructor() {
        super();
    }
}

class AbolishVoteResult extends  ResultBase {
    constructor() {
        super();
    }
}

class ReturnVoteResult extends  ResultBase {
    constructor() {
        super();
    }
}

module.exports.XActionType = XActionType;
module.exports.RequestTokenResult = RequestTokenResult;
module.exports.ResultBase = ResultBase;
module.exports.CreateAccountResult = CreateAccountResult;
module.exports.AccountInfoResult = AccountInfoResult;
module.exports.TransferResult = TransferResult;
module.exports.GetPropertyResult = GetPropertyReuslt;
module.exports.AccountTransactionResult = AccountTransactionResult;
module.exports.Action = AccountTransactionResult.Action;
module.exports.CreateConstractAccountResult = CreateConstractAccountResult;
module.exports.PublishConstractResult = PublicConstractResult;
module.exports.CallConstractResult = CallConstractResult;
module.exports.CreateChildAccountResult = CreateChildAccountResult;
module.exports.LockTokenResult = LockTokenResult;
module.exports.UnlockTokenResult = UnlockTokenResult;
module.exports.create_create_account_result = function() {
    let obj = new CreateAccountResult();
    return obj;
}
