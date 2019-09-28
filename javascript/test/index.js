const TopJs = require('../src');
const transferTest = require('./transferTest');
const contractTest = require('./contractTest');

const urlStr = 'http://192.168.50.171:19081';
// a3aab9c186458ffd07ce1c01ba7edf9919724224c34c800514c60ac34084c63e
// 7279ed1b5b541ebc92796c5c07ab2a8add8e065ec17aaa91dfe97210b52b7a8a

transferTest(urlStr);

// contractTest(urlStr);