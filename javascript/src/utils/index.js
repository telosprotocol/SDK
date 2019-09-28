'use strict';
const convert = require('./Convert');
const actionParam = require('./ActionParam');

String.prototype.format = function () {
    let values = arguments;
    return this.replace(/\{(\d+)\}/g, function (match, index) {
        if (values.length > index) {
            return values[index];
        } else {
            return "";
        }
    });
};

module.exports = {
    little_endian: convert.little_endian,
    hex2bytes: convert.hex2bytes,
    bytes2hex: convert.bytes2hex,
    bytes2Number: convert.bytes2Number,
    str2hex: convert.str2hex,
    bytes2str: convert.bytes2str,
    decodeActionParam: actionParam.decodeActionParam,
    decodeStringActionParam: actionParam.decodeStringActionParam
};
