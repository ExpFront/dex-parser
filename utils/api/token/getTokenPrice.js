const axios = require('axios').default;


const getTokensPrice = async (hash = '0x76c73e630b61551067ab78c6f5909b5ed74edb8a') => {
    if (Array.isArray(hash)) {
        return axios.get(`https://api.dexscreener.com/latest/dex/tokens/${[...hash]}`)
            .then(response => console.log(response.data.pairs[0].priceUsd))
            .catch(err => console.error(err));
    }

    return axios.get(`https://api.dexscreener.com/latest/dex/search/?q=${hash}`)
        .then(response => console.log(response.data.pairs[0].priceUsd))
        .catch(err => console.error(err));
    
}

module.exports = getTokensPrice;


