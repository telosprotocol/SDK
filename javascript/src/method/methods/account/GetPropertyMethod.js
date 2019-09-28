
const AbstractMethod = require('../../abstract/AbstractMethod');

class GetPropertyMethod extends AbstractMethod {

    constructor(moduleInstance) {
        super({
            methodName: 'get_property'
        }, moduleInstance);
    }

    /**
     * This method will be executed for get params.
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
        } = methodArguments[0] || {};
        account = account ? account : this.moduleInstance.defaultAccount;
        let { address, sequence_id, token } = account;

        const {
            contractAddress, type, data
        } = methodArguments[0];

        let parameters = {
            version: '1.0',
            account_address: address,
            token,
            method: this._methodName,
            sequence_id
        }
        const params = {
            version: '1.0',
            method: this._methodName,
            account_address: address,
            sequence_id,
            params: { account:contractAddress, type, data }
        }
        parameters.body = JSON.stringify(params);
        return parameters;
    }
}

module.exports = GetPropertyMethod;