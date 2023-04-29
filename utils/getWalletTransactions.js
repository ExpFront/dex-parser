const axios = require('axios').default;
const axiosConfig = require('./../config/axiosConfig')


const getWalletTransactions = (searchingWallet) => {
    return axios.get(`https://api.zerion.io/v1/wallets/${searchingWallet}/transactions/?currency=usd&page[size]=100&filter[operation_types]=trade`, axiosConfig)
        .catch(err => console.error(err));
  
}

module.exports = getWalletTransactions;

