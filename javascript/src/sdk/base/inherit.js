'use strict'

const inherit = function (sub_type, super_type) {
    const prototype = Object.create(super_type.prototype);
    prototype.constructor = sub_type;
    sub_type.prototype = prototype;
};

module.exports.inherit = inherit;