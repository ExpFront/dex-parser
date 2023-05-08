const axios = require('axios').default;

const getTokensPrice = async (searchingTokens = '0x76c73e630b61551067ab78c6f5909b5ed74edb8a') => {
    return axios.get(`https://api.dexscreener.com/latest/dex/tokens/${[searchingTokens]}`)
        .catch(err => console.error(err));
}

module.exports = getTokensPrice;


