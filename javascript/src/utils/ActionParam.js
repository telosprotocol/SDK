'use strict';

const ByteBuffer = require('./ByteBuffer');
const convert = require('./Convert');

class ActionParam{

    static ActionAssetOutParam(token_name,amount,memo) {
        let stream = new ByteBuffer().littleEndian();
        stream.string(token_name).int64(amount).string(memo);
        return stream.pack();
    };

    static decodeStringActionParam(strBytes, startIndex){
        if (!strBytes || strBytes.length == 0){
            return null;
        }
        let coinTypeLengthBytes = strBytes.slice(startIndex, startIndex + 4);
        let coinTypeLength = this.bytes2Number(coinTypeLengthBytes, true);
        if (coinTypeLength == 0){
            return {
                str: "",
                index: startIndex + 4
            };
        }
        startIndex = startIndex + 4;
        let coinTypeBytes = strBytes.slice(startIndex, startIndex + coinTypeLength);
        let coinTypeStr = Buffer.from(coinTypeBytes).toString('utf8', 0, coinTypeLength);
        return {
            str: coinTypeStr,
            index: startIndex + coinTypeLength
        };
    }

    static decodeActionParam(hexStr){
        if (!hexStr || hexStr.length <= 2) {
            return null;
        }
        hexStr = hexStr.replace('0x', '');
        const actionParamBytes = convert.hex2bytes(hexStr);
        let coinTypeResult = this.decodeStringActionParam(actionParamBytes, 0);
        let amountBytes = actionParamBytes.slice(coinTypeResult.index, coinTypeResult.index + 8);
        let amount = this.bytes2Number(amountBytes, true);
        let { str } = this.decodeStringActionParam(actionParamBytes, coinTypeResult.index + 8);
        return{
            coinType: coinTypeResult.str, amount, note: str
        }
    }

    /**
     * 
     * @param {*} actionParam 
     */
    static genCallContractParam(actionParam){
        const XActionParamType = {
            number: '%ld',
            string: '%s',
            bool: '%c',
        };
        if (!actionParam || !Array.isArray(actionParam) || actionParam.length <= 0){
            return [];
        }
        let stream = new ByteBuffer().littleEndian();
        stream.byte(actionParam.length);
        for(var i=0;i<actionParam.length;i++){
            let temp = actionParam[i];
            if (temp && XActionParamType[temp.type]) {
                if (temp.type == 'number') {
                    stream.byte(1);
                    stream.int64(temp.value);
                } else if (temp.type == 'string') {
                    stream.byte(2);
                    stream.string(temp.value);
                } else if (temp.type == 'bool') {
                    stream.byte(3);
                    stream.byte(temp.value);
                } else {
                    throw new Error('do not support type');
                }
            }
        }
        return stream.pack();
    }
}

module.exports = ActionParam;