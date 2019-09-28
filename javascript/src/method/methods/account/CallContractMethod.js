
const AbstractMethod = require('../../abstract/AbstractMethod');
const xActionType = require('../../model/XActionType');
const xTransactionType = require('../../model/XTransactionType');
const actionParamUtils = require('../../../utils/ActionParam');
const XTransaction = require('../../lib/XTransaction');
const XAction = require('../../lib/XAction');
const ByteBuffer = require('../../../utils/ByteBuffer');
const secp256k1 = require('secp256k1');
const StringUtil = require("../../../utils");
const accounts = require("../../../accounts");

class CallContractMethod extends AbstractMethod {

    constructor(moduleInstance) {
        super({
            methodName: 'send_transaction',
            use_transaction: true,
        }, moduleInstance);
        this.transAction = null;
    }

    /**
     * This method will be executed for get args.
     *
     * @method addArgsKey
     *
     * @param {*} methodArguments
     *
     * @returns {Object}
     */
    getArgs(methodArguments) {
        let {
            account,
            txHash
        } = methodArguments[0] || {};
        account = account ? account : this.moduleInstance.defaultAccount;
        let { address, sequence_id, token, privateKeyBytes, publicKey, last_hash_xxhash64, nonce, } = account;

        let parameters = {
            version: '1.0',
            account_address: address,
            token,
            method: 'send_transaction',
            sequence_id
        }

        const params = {
            version: '1.0',
            method: true === this.use_transaction ? 'send_transaction' : this._methodName,
            account_address: address,
            sequence_id,
        }

        if (methodArguments.length !== 1) {
            throw new Error('publish contract args length is not right');
        }
        const txArgs = methodArguments[0];
        const contractAddress = txArgs['contractAddress'];
        const actionName = txArgs['actionName'];
        const actionParam = txArgs['actionParam'];
        const amount = txArgs['amount'] || 0;
        const note = txArgs['note'] || '';
        const coinType = txArgs['coinType'] || '';
        
        const sourceActionParam = actionParamUtils.ActionAssetOutParam(coinType, amount, note);
        const targetActionParam = actionParamUtils.genCallContractParam(actionParam);
        
        
        const transAction = new XTransaction();
        transAction.set_transaction_type(xTransactionType.RunContract);
        transAction.set_last_trans_nonce(nonce);
        const cur_timestamp = Math.round(new Date() / 1000);
        transAction.set_fire_timestamp(cur_timestamp);
        transAction.set_expire_duration(100);
        transAction.set_last_trans_hash(last_hash_xxhash64);
        transAction.set_deposit(100000);

        const sourceAction = new XAction();
        sourceAction.set_action_type(xActionType.AssertOut);
        sourceAction.set_account_addr(address);
        sourceAction.set_action_param(sourceActionParam);

        const targetAction = new XAction();
        targetAction.set_action_type(xActionType.RunConstract);
        targetAction.set_account_addr(contractAddress);
        targetAction.set_acton_name(actionName)
        targetAction.set_action_param(targetActionParam);
        
        transAction.set_source_action(sourceAction);
        transAction.set_target_action(targetAction);

        transAction.set_digest();
        const hash =  transAction.get_transaction_hash();
        const hash_buffer = Buffer.from(hash.array);
        const private_key_buffer = Buffer.from(privateKeyBytes);
        const secp256k1_sign = secp256k1.sign(hash_buffer, private_key_buffer);
        let stream = new ByteBuffer().littleEndian();
        stream.byte(secp256k1_sign.recovery).byteArray(secp256k1_sign.signature,secp256k1_sign.signature.length);
        const stream_array =  new Uint8Array(stream.pack());
        const auth_hex = "0x" + StringUtil.bytes2hex(stream_array);
        
        sourceAction.set_action_param("0x" + StringUtil.bytes2hex(sourceActionParam));
        targetAction.set_action_param("0x" + StringUtil.bytes2hex(targetActionParam));
        
        transAction.set_authorization(auth_hex);
        transAction.set_transaction_hash(hash.hex);
        transAction.set_public_key("0x" + StringUtil.bytes2hex(publicKey));

        params.params = transAction;
        this.transAction = transAction;
        parameters.body = JSON.stringify(params);
        return parameters;
    }
}

module.exports = CallContractMethod;