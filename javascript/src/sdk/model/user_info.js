'use strict';

const key_len = 32;

const UInfo = function (account,private_key) {
    this.m_account = account;
    this.m_privary_key = private_key;

    this.get_account = function () {
        return this.m_account;
    }

    this.set_account = function (account) {
        this.m_account = account;
    }

    this.get_private_key = function () {
        return this.m_privary_key;
    }

    this.set_private_key = function (private_key) {
        this.m_privary_key = private_key;
    }
}

const UserInfo = function () {
    this.token = "";
    this.account = "";
    this.balance = 0;
    this.last_hash = "";
    this.last_hash_xxhash64 = "";
    this.nonce = 0;
    this.secret_key = "";
    this.sign_method = "";
    this.sign_version = "";
    this.last_unit_height = 0;
    this.private_key = new Buffer(32);
    this.child = new UInfo();

    this.get_token = function() {
        return this.token;
    }

    this.set_token = function(token) {
        this.token =token;
    }

    this.get_account = function() {
        return this.account;
    }

    this.set_account = function(account) {
        this.account = account;
    }

    this.get_balance = function() {
        return this.balance;
    }

    this.set_balance = function(balance) {
        this.balance = balance;
    }

    this.get_last_hash = function() {
        return this.last_hash;
    }

    this.set_last_hash = function(last_hash) {
        this.last_hash = last_hash;
    }

    this.get_last_hash_xxhash64 = function() {
        return this.last_hash_xxhash64;
    }

    this.set_last_hash_xxhash64 = function(last_hash_xxhash64) {
        this.last_hash_xxhash64 = last_hash_xxhash64;
    }

    this.get_nonce = function() {
        return this.nonce;
    }

    this.set_nonce = function(nonce) {
        this.nonce = nonce;
    }

    this.get_secret_key = function() {
        return  this.secret_key;
    }

    this.set_secret_key = function(secret_key) {
        this.secret_key = secret_key;
    }

    this.get_sign_method = function() {
        return this.sign_method;
    }

    this.set_sign_method = function(sign_method) {
        this.sign_method = sign_method;
    }

    this.get_sign_version = function() {
        return this.sign_version;
    }

    this.set_sign_version = function(sign_version) {
        this.sign_version = sign_version;
    }

    this.get_private_key = function() {
        return this.private_key;
    }

    this.set_private_key = function(private_key) {
        this.private_key = private_key;
    }

    this.get_child = function() {
        return this.child;
    }

    this.set_child = function(child) {
        this.child = child;
    }

    this.get_last_unit_height = function() {
        return this.m_last_unit_height;
    }

    this.set_last_unit_height = function(last_unit_height) {
        this.m_last_unit_height = last_unit_height;
    }

    this.clear = function() {
        this.token = "";
        this.account = "";
        this.balance = 0;
        this.last_hash = "";
        this.last_hash_xxhash64 = 0;
        this.nonce = 0;
        this.secret_key = "";
        this.sign_method = "";
        this.sign_version = "";
        this.private_key = new Array(key_len);
    }
};

UserInfo.key_len = 32;

module.exports.UserInfo = UserInfo;
module.exports.create_user_info = function() {
    let obj = new UserInfo();
    return obj;
};
