
// 驼峰规则，首字母改成小写

// Account
exports.accountInfo = require('./account/AccountInfoMethod');
exports.createAccount = require('./account/CreateAccountMethod');
exports.accountTransaction = require('./account/AccountTransactionMethod');

// transaction
exports.requestToken = require('./account/RequestTokenMethod');
exports.transfer = require('./account/TransferMethod');

// contract
exports.publishContract = require('./account/PublishContractMethod');
exports.getProperty = require('./account/GetPropertyMethod');
exports.callContract = require('./account/CallContractMethod');