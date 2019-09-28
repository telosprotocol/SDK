const TopJs = require('../src');

module.exports = async (urlStr) => {
    const topjs = new TopJs();
    const url = await topjs.getDefaultServerUrl('http://hacker.topnetwork.org/');
    topjs.setProvider(url);
    await topjs.requestToken();
    const createAccountResult = await topjs.createAccount();
    console.log('createAccountResult >>>>> ', createAccountResult);

    setTimeout(async() => {
        const f = await topjs.accountInfo();
        console.log('userInfo >>>>> ', f);
        
        const transferResult = await topjs.transfer({
            to: 'T-0-1EHzT2ejd12uJx7BkDgkA7B5DS1nM6AXyF',
            amount: 110,
            data: 'hello top hahah hahah'
        });
        console.log('transferResult >>> ', transferResult);

        setTimeout(async() => {
            const s = await topjs.accountInfo();
            console.log('userInfo >>>>> ', s);
            const d = await topjs.accountTransaction();
            const actionParamObj = topjs.utils.decodeActionParam(d.data.target_action.action_param);
            console.log('userInfo >>>>> ', d);
            console.log('userInfo >>>>> ', actionParamObj);
        }, 3000);
        
    }, 3000);
};

