const axios = require('axios').default;
const http = require('http');

const getWalletTransactions = require('./utils/api/wallets/getWalletTransactions')
const handleWalletTransactions = require('./utils/api/wallets/handleWalletTransactions')

const calculateWalletStatistics = require('./utils/calculations/walletStatistics/calculateWalletStatistics')

const addDataToGoogleSheet = require('./utils/api/google/addDataToGoogleSheet')


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/json');
});


server.listen(3002, 'localhost', async () => {
  console.log(`Server running at http://localhost:3002/`);

  const searchingWallets = ['0xf731bd55dba8679a9585fa5719f4219762a87347', '0x27b36a9aecedee6df3f9dd43b854e15dc783474d', '0xd69fb1f885fc8b6a561b8ed363ba7c42c666106d', '0x0270b12dc4a6f5e63d0b2b0c5991c7fb8c1c594d']

  try {

    searchingWallets.map(async searchingWallet => {
      const walletTransactions = await getWalletTransactions(searchingWallet);
      const mappedTransactionsData = handleWalletTransactions(walletTransactions);
      const walletStatistics = await calculateWalletStatistics(mappedTransactionsData);
  
      console.log(walletStatistics)
      await addDataToGoogleSheet(searchingWallet, walletStatistics);
    })

  } catch (err) {
    console.error(`Error compiling script: ${err}`)
  }
});




