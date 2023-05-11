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

  const searchingWallets = ['0x5aceb63d52d0d7081a72f254401893ffcf81381a' , '0xdB1777B808bFeCaA6bAC975ad4C3F47a6e3FC1A8', '0xC545eCEF8BB304650C6f28925b3A9B043d3AFA66', '0x322874ec9e38b3d16846242a8afc739086198dd9', '0x5b2d5e2e150b707be70864f642d8b0087478ee83', '0xe2e70bf57d924ab3323897d738195f2c2799669d', '0x5fa8f38531ecec8d009ba4ea54c2f98c1cee91e4', '0x08b5d99e75c7d821da91ce8615c015c73fac312a', '0xd69fb1f885fc8b6a561b8ed363ba7c42c666106d', '0x46a20e894ea07ca431c1bc03aba19225a5dcf5aa', '0x0270b12dc4a6f5e63d0b2b0c5991c7fb8c1c594d', '0x5aceb63d52d0d7081a72f254401893ffcf81381a', '0xad1dfeff0e581ae72145c37a296cf95299c27d76', '0xc58dc8c4d1e3b838ba674b74ce56f78390d3a3c8', '0x505308bcb20a2e4fe0ab91f8e4e852b843273d68', '0x92c6b6b4a1817e76b56eb3e1724f9df6026dd63c', '0x6234b9e61e111ab4a719044fd96cb33a1cc51a01', '0x547fbdae292eb2f74e6dab610fc2437a68047a8a', '0x617e88a35f6869680482f6bd08075e4732e0d18c', '0x27b234bae8fb6fc36e607c60eeced1e110c545f8', '0xccc1dd37e79a06024d7da3de65e13f291183d05e', '0xafb33624215742ef3cd3952828265dccdc508e16']

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




