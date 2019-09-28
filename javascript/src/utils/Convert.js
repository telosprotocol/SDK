class Convert {

    static little_endian(str) {
        if (str !== '' && str !== undefined) {
            if (str.length % 2 === 1){
                str = '0' + str;
            }
            let new_str = '';
            for (let x = str.length; x >= 0; x = x - 2) {
                new_str += str.charAt(x)
                new_str += str.charAt(x + 1)
            }
            return new_str;
        } else {
            return str;
        }
    }

    static hex2bytes(str) {
        let pos = 0;
        let len = str.length;
        if (len % 2 !== 0) {
            return null;
        }
        len /= 2;
        let hexA = new Array();
        for (let i = 0; i < len; i++) {
            let s = str.substr(pos, 2);
            let v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }
        return hexA;
    }

    static bytes2hex(arr) {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
            let tmp = arr[i].toString(16);
            if (tmp.length === 1) {
                tmp = "0" + tmp;
            }
            str += tmp;
        }
        return str;
    }

    static bytes2Number(arr, isLittleEndian) {
        let target = [];
        if (isLittleEndian) {
            for (let i=0;i<arr.length;i++){
                target[i] = arr[arr.length -1 - i]
            }
        } else {
            target = arr;
        }
        let numHex = this.bytes2hex(target);
        let num = parseInt('0x' + numHex);
        return num;
    }
    static str2hex(str) {
        if(str === "")
            return "";
        let hex_char_code = [];
        hex_char_code.push("0x");
        for(let i = 0; i < str.length; i++) {
            hex_char_code.push((str.charCodeAt(i)).toString(16));
        }
        return hex_char_code.join("");
    }
    static bytes2str(arr) {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
            let tmp = arr[i].toString();
            if (tmp.length === 1) {
                tmp = "0" + tmp;
            }
            str += tmp;
        }
        return str;
    }
}

module.exports = Convert;