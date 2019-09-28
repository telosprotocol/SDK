'use strict';

let RSP_SEGMENT = {
    ERROR_NO : "errno",
    ERROR_NO2 : "error",
    ERROR_MSG : "errmsg",
    SEQUENCE_ID : "sequence_id",
    DATA : "data"
};

let ErrorCode = {
    Success : 0,
    JsonParseError : 1,
    SignError : 4,
};

let CMD = {
    TOKEN : "request_token",
    CREATE_ACCOUNT: "create_account",
    ACCOUNT_INFO: "account_info",
    TRANSFER: "transfer",
    ACCOUNT_TRANSACTION: "account_transaction",
    KEY_STORE: "keystore",
    CREATE_CONTRACT: "create_constract",
    GET_PROPERTY: "get_property",
    PUBLISH_CONTRACT: "publish_contract",
    CALL_CONTRACT : "call_contract",
    CREATE_CHILD_ACCOUNT: "create_child_account",
    LOCK_TOKEN: "lock_token",
    UNLOCK_TOKEN: "unlock_token",
    GET_VOTE: "get_vote",
    VOTE : "vote",
    ABOLISH_VOTE : "abolish_vote",
    RETURN_VOTE : "return_vote"
}

module.exports.RSP_SEGMENT = RSP_SEGMENT;
module.exports.CMD = CMD;
module.exports.ErrorCode = ErrorCode;
