const axios = require('axios').default;
const axiosConfig = require('./../../../config/axiosConfig')


const getWalletTransactions = (searchingWallet) => {
    return axios.get(`https://api.zerion.io/v1/wallets/${searchingWallet}/transactions/?currency=usd&page[size]=100`, axiosConfig)
        .catch(err => console.error(err.response.data, 'error'));
  
}

module.exports = getWalletTransactions;

