
const httpProvider = require('./core/HttpProvider');
const websocketProvider = require('./core/WebsocketProvider');

class ProvidersModuleFactory {

    /**
     * Resolves the correct provider with his adapter
     *
     * @method resolve
     *
     * @param {HttpProvider|WebsocketProvider} provider
     * @param {Object} options
     *
     * @returns {HttpProvider|WebsocketProvider}
     */
    resolve(provider, options) {
        if (!provider) {
            return provider;
        }
        if (typeof provider === 'string') {
            // HTTP
            if (/^http(s)?:\/\//i.test(provider)) {
                return this.createHttpProvider(provider, options);
            }
            // WS
            if (/^ws(s)?:\/\//i.test(provider)) {
                return this.createWebsocketProvider(provider, options);
            }

            // IPC
            // if (provider && isObject(net) && isFunction(net.connect)) {
            //     return this.providersModuleFactory.createIpcProvider(provider, net);
            // }
        }
        throw new Error('Invalid provider adapter');
    }

    createHttpProvider(provider, options) {
        return new httpProvider(provider, options);
    }

    createWebSocketProvider(provider, options) {
        return new websocketProvider(provider, options);
    }
}

exports.ProvidersModuleFactory = ProvidersModuleFactory;