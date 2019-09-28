
class MethodProxy {
    
    /**
     * @param {TopJs} target
     * @param {MethodFactory} methodFactory
     *
     * @constructor
     */
    constructor(target, methodFactory) {
        return new Proxy(target, {
            /**
             * @param {TopJs} target
             * @param {String|Symbol} name
             *
             * @returns {any}
             */
            get: (target, name) => {
                if (methodFactory.hasMethod(name)) {
                    if (typeof target[name] !== 'undefined') {
                        throw new TypeError(
                            `Duplicated method ${name}. This method is defined as RPC call and as Object method.`
                        );
                    }

                    const method = methodFactory.createMethod(name, target);

                    /* eslint-disable no-inner-declarations */
                    function RpcMethod() {
                        method.setArguments(arguments);
                        return method.execute();
                    }
                    /* eslint-enable no-inner-declarations */

                    RpcMethod.method = method;
                    RpcMethod.request = function() {
                        method.setArguments(arguments);

                        return method;
                    };

                    return RpcMethod;
                }

                return Reflect.get(target, name);
            }
        });
    }
}

module.exports = MethodProxy;