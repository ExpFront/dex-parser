const axios = require('axios').default;
const axiosConfig = require('./../../../config/axiosConfig')

const responseResult = {
    page: 1,
    data: []
    };

const getWalletTransactions = (searchingWallet, pageSize = 100, customUrl) => {
    const initialUrl = `https://api.zerion.io/v1/wallets/${searchingWallet}/transactions/?currency=usd&page[size]=${pageSize}&filter[asset_types]=fungible&filter[chain_ids]=ethereum`;

    return axios.get(customUrl || initialUrl, axiosConfig)
        .then(async response => {


            if (response.data.links.next && page < 64) { // Фетчинг данных со следующий страницы, пока не столкнемся с лимитом в 64 страницы
                console.log(`... fetching additional data from page: ${responseResult.page + 1} ...`)

                responseResult.data.push(...response.data.data)
                responseResult.page++;

                return await getWalletTransactions(searchingWallet, pageSize, response.data.links.next)

            } else {
                console.log(`All data was fetched. Count of all pages is: ${responseResult.page}`)
                responseResult.data.push(...response.data.data)

                return responseResult;
            }
            

        })
        .catch(err => console.error(err, 'error'));
}

module.exports = getWalletTransactions;

