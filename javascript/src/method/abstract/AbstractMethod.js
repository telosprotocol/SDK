
const isFunction = require('lodash/isFunction');
const cloneDeep = require('lodash/cloneDeep');

class AbstractMethod {

    constructor(argsObj = {}, moduleInstance) {
        this.moduleInstance = moduleInstance;
        if (!argsObj.methodName) {
            throw new Error('method name is required !');
        }
        this._methodName = argsObj.methodName;
        this._use_transaction = argsObj.use_transaction | false;
        this._transationType = argsObj.transationType;
        this._sourceType = argsObj.sourceType;
        this._targetType = argsObj.targetType;
        this._arguments = {
            parameters: []
        };
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractWeb3Module} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {}

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {*} response
     *
     * @returns {*}
     */
    afterExecution(response) {
        return response;
    }

    async execute() {
        this.beforeExecution(this.moduleInstance);
        try {
            if (!this.moduleInstance.currentProvider) {
                throw new Error('provider is null');
            }
            let response = await this.moduleInstance.currentProvider.send(this._methodName, this._arguments.parameters);
            if (response) {
                response = this.afterExecution(response);
            }
            if (this._arguments.callback) {
                this._arguments.callback(false, response);
                return;
            }
            return response;
        } catch (error) {
            if (this._arguments.callback) {
                this._arguments.callback(error, null);
                return;
            }
            throw error;
        }
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
        return {};
    }

    encode(){}

    /**
     * Setter for the arguments property
     *
     * @method setArguments
     *
     * @param {IArguments} methodArguments
     */
    setArguments(methodArguments) {
        let parametersArray = cloneDeep([...methodArguments]);
        let callback = null;

        if (isFunction(parametersArray[parametersArray.length - 1])) {
            callback = parametersArray.pop();
        }
        // 调用子类的设置参数方法
        let _parameters = this.getArgs(parametersArray);

        this._arguments = {
            callback,
            parameters: _parameters,
        };
    }
}
module.exports = AbstractMethod;