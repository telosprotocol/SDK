'use strict';

const ByteBuffer = require('ByteBuffer');

let ActionAssetOutParam = function (token_name,amount,memo) {
    this.m_token_name = token_name;
    this.m_amount = amount;
    this.m_memo = memo;
    this.create = function () {
        let stream = new ByteBuffer().littleEndian();
        stream.string(this.m_token_name).int64(this.m_amount).string(this.m_memo);
        return stream.pack();
    };
};

module.exports.ActionAssetOutParam = ActionAssetOutParam;
