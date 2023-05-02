const axios = require('axios').default;


const getTokensPrice = async (tokens = '0x76c73e630b61551067ab78c6f5909b5ed74edb8a') => {

    const searchingTokens = tokens.reduce((acc, curr) =>  curr.amountInToken > 0 ? [ ...acc, curr.tokenHash ] : acc, [])

    return axios.get(`https://api.dexscreener.com/latest/dex/tokens/${[...searchingTokens]}`)
        .then(response => response.data.pairs.reduce((acc, curr) => {
            return {
                ...acc,
                [curr.baseToken.symbol]: curr.priceUsd
            }
        }, {})).catch(err => console.error(err));
    
}

module.exports = getTokensPrice;


