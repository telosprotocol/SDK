'use strict';

const axios = require('axios');

let TransMode = {
    HTTP:0,
    HTTPS:1,
    WS:2,
    WSS:3
};


class TransBase {
    constructor(host) {
        this.m_host = host;
        this.m_uri = "/";
        axios.defaults.baseURL = "http://" + this.m_host;
        axios.defaults.url = this.m_uri;
        axios.defaults.headers['Content-Type'] = "application/json";
    }
    set_uri(uri) {
        this.m_uri = uri;
    }
    get_uri() {
        return this.m_uri;
    }
    set_host(host) {
        this.m_host = host;
    }
    get_host() {
        return this.m_host;
    }
}

TransBase.create = function (mode,host) {
    const val_find = TransBase.s_create_funcs[mode];
    if(undefined !== val_find) {
        return val_find(host);
    }
    return undefined;
}

TransBase.regist_create_function = function(trans_mode,create_func) {
    TransBase.s_create_funcs[trans_mode] = create_func;
}

TransBase.s_create_funcs = new Map();
TransBase.s_default_mode = TransMode.HTTP;

class TransHttp extends TransBase {
    constructor(host) {
        super(host);
    }
    do_trans(content,rsp_handle_callback) {
        console.log("http://" + this.m_host + this.m_uri);

        return axios.post(this.m_uri, content)
            .then((response) => {
                rsp_handle_callback(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

module.exports.TransMode = TransMode;
module.exports.TransHttp =TransHttp
module.exports.TransBase = TransBase;

