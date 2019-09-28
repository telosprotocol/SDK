'use strict';

const {sha256} = require('js-sha256');
const base32 = require("base32");

let signature_method = {
    hmac_sha256 : 0,
    hmac_sha2 : 1
}

var rpc_signatrue = function () {
    this.m_method = signature_method.hmac_sha2;
    this.m_version = "1.0";
    this.m_secret_key = "";
    this.m_params = new Map();
    this.create_signature = function (source_str,sign_str) {
        var br = false;
        switch (this.m_method) {
            case signature_method.hmac_sha256:
                this.calc_hmac_sha256(source_str,this.m_secret_key);
                br = true;
                break;
            case signature_method.hmac_sha2:
                this.cal_hmac_sha2(source_str,this.m_secret_key);
                br = true;
                break;
            default:
                break;
        }
        return br;
    }
    this.recreate_signatrue = function (source_str,sign_str) {
        this.parse_parans(source_str);
        var msg = "";
        this.encode(msg);
        return this.create_signature(msg,sign_str);
    }
    this.calc_hmac_sha256 = function (source_str,secret_key) {
        return "";
    }
    this.cal_hmac_sha2 = function (source_str,secret_key) {
        const hmac_result = sha256.hmac(secret_key,source_str);
        const base32_result = base32.encode(hmac_result);
        return base32_result;
    }
    
    this.set_secret_key = function (key) {
        this.m_secret_key = key;
    }

    this.set_sign_method = function (sign_method) {
        if (sign_method === "HMAC_SHA2") {
            this.m_method = signature_method.hmac_sha2;
        }
    }
    
    this.set_sign_version = function (version) {
        this.m_version = version;
    }
    
    this.encode = function (body) {
        for (var param_key in this.m_params) {
            if (param_key !== this.m_signature_key) {
                body += (body.empty()?"":"&");
                body += "=";
                body += this.m_params[param_key];
            }
        }
    }
    
    this.parse_parans = function (content) {
        this.m_params.clear();
        const len = content.length;
        var pos_beg = 0;
        var pos_end = pos_beg;
        while (pos_end !== -1 && pos_beg < len) {
            pos_end = content.indexOf("&",pos_beg);
            if (pos_end === -1) {
                this.parse_keyvalue(content.substring(pos_beg,len - pos_beg));
            } else {
                this.parse_keyvalue(content.substring(pos_beg,pos_end - pos_beg));
                pos_beg = pos_end + 1;
            }
        }
    }
    this.parse_keyvalue = function (content) {
        const len = content.length;
        const pos = content.indexOf("=",0);
        if(-1 !== pos && 0 !== pos) {
            this.m_params[content.substring(0,pos)] = content.substring(pos + 1,len - pos - 1);
        }
    }
}

rpc_signatrue.s_signature_key = "";
rpc_signatrue.s_method_key = "";
rpc_signatrue.s_version_key = "";
rpc_signatrue.s_secretkey_key = "";
rpc_signatrue.s_method_value = "";
rpc_signatrue.s_version_value = "";

module.exports.rpc_signatrue = rpc_signatrue;