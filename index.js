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

  const searchingWallets = ['0xc17e03c77dbe8e19fd12bcf9bdce024105702cbb'];

  try {

    searchingWallets.map(async searchingWallet => {
      const walletTransactions = await getWalletTransactions(searchingWallet);
      const mappedTransactionsData = handleWalletTransactions(walletTransactions);
      const walletStatistics = await calculateWalletStatistics(mappedTransactionsData, searchingWallet);
  
      console.log(walletStatistics)
      await addDataToGoogleSheet(searchingWallet, walletStatistics);
    })

  } catch (err) {
    console.error(`Error compiling script: ${err}`)
  }

});


