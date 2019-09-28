const TopJs = require('../src');
const fs = require("fs");

module.exports = async () => {
    const topjs = new TopJs();
    const url = await topjs.getDefaultServerUrl('http://hacker.topnetwork.org/');
    // url = 'http://192.168.50.171:19081';
    topjs.setProvider(url);
    let pAccount = topjs.accounts.generate();
    let cAccount = topjs.accounts.generate();
    console.log('contractAccount >>> address >', cAccount.address);
    await topjs.requestToken();
    const createAccountResult = await topjs.createAccount({
        account: pAccount
    });
    // console.log('createAccountResult >>>>> ', JSON.stringify(createAccountResult));
    setTimeout(async()=>{
        const accountInfo = await topjs.accountInfo({
            account: pAccount
        });
        if (accountInfo.data) {
            pAccount.nonce = accountInfo.data.nonce;
            pAccount.last_hash_xxhash64 = accountInfo.data.last_hash_xxhash64;
        }
        // console.log('accountInfo >>> ', JSON.stringify(accountInfo));
        var data = fs.readFileSync('D:/project/gerrit/js-sdk/test/map.lua');
        const publishContractResult = await topjs.publishContract({
            account: pAccount,
            contractAccount: cAccount,
            contractCode: data.toString(),
            deposit: 200,
        });
        // console.log('publishContractResult >>> ', JSON.stringify(publishContractResult));
        setTimeout(async() => {
            const contractAccountInfo = await topjs.accountInfo({
                account: cAccount
            });
            // console.log('contractAccountInfo >>> ', JSON.stringify(contractAccountInfo));
            const result = await topjs.getProperty({
                contractAddress: cAccount.address,
                type: 'map',
                data: ['hmap', 'key']
            });
            console.log('getProperty Result >>> ', JSON.stringify(result));
            const accountInfoResult = await topjs.getProperty({
                contractAddress: cAccount.address,
                type: 'string',
                data: 'temp_1'
            });
            console.log('getProperty Result >>> ', JSON.stringify(accountInfoResult));
        }, 3000)

        
        setTimeout(async() => {
            const accountInfo = await topjs.accountInfo({
                account: pAccount
            });
            if (accountInfo.data) {
                pAccount.nonce = accountInfo.data.nonce;
                pAccount.last_hash_xxhash64 = accountInfo.data.last_hash_xxhash64;
            }
            const result = await topjs.callContract({
                account: pAccount,
                contractAddress: cAccount.address,
                actionName: 'opt_map',
                actionParam: [{
                    type: 'string',
                    value: 'inkey'
                }, {
                    type: 'number',
                    value: 65
                }]
            });
            console.log('callContract Result >>> ', JSON.stringify(result));
            
            setTimeout(async ()=> {
                const accountInfoResult = await topjs.getProperty({
                    contractAddress: cAccount.address,
                    type: 'map',
                    data: ['hmap', 'inkey']
                });
                console.log('getProperty Result >>> ', JSON.stringify(accountInfoResult));
                
                const result = await topjs.getProperty({
                    contractAddress: cAccount.address,
                    type: 'map',
                    data: ['hmap', 'key']
                });
                console.log('getProperty Result >>> ', JSON.stringify(result));
            }, 3000)

        }, 3000)
    }, 1000)
};

