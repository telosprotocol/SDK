'use strict';

const {UserInfo} = require("./user_info");

let g_user_info = new UserInfo();

let GLOBAL = {
    LOCAL_HOST_PORT_HTTP:"localhost:3000",
    SERVER_HOST_PORT_HTTP : "192.168.50.211:19090",
    SERVER_HOST_PORT_WS : "134.209.60.215:9999",
    SDK_VERSION : "1.0",
    ACCONT_ONE :"T-0-1Nnw5nNMFoYHJqMvQaG4tKJCWfZ3z1cNUb",
    ACCONT_TWO : "T-0-1Nnw5nNMFoYHJqMvQaG4tKJCWfZ3z1cNUb",
    START_WITH_HTTP_MODE:1,
    USE_RPC_SIGNATURE : true,
    MIN_DEPOSIT : 100
 };

 let sequence_id = Date.now();


 function get_sequence_id() {
  sequence_id = sequence_id + 1;
  return sequence_id;
 };

let XTransactionType = {
     CreateUserAccount : 0,
    CreateContractAccount: 1,
    DeployContract: 2,
    RunContract: 3,
    Transfer: 4,
    PropertyOp: 5,
    AliasName: 6,
    GlobalName: 7,
    FreeJoinRequest: 8,
    GlobalOp: 9,
    GlobalOpReverse: 10,
    SetAccountKeys: 11,
    LockToken: 12,
    UnlockToken : 13,
    GetConsensusRandom : 15,
    CreateChildAccount : 16
};

module.exports.GLOBAL = GLOBAL;
module.exports.get_sequence_id = get_sequence_id;
module.exports.XTransactionType = XTransactionType;
module.exports.g_user_info = g_user_info;
