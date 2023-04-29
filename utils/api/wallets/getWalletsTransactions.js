const getWalletTransactions = require('./getWalletTransactions')

const getWalletsTransactions = (searchingWallets) => {
    const arrOfPromises = [];
  
    searchingWallets.map((wallet, id) => arrOfPromises.push(getWalletTransactions(wallet)))
  
    Promise.all(arrOfPromises)
      .then(fetchedWalletsData => {
        console.log(fetchedWalletsData, 'fetchedWalletsData')
  
        fetchedWalletsData.map((wallet, i) => {
            const wins = 0
            const loses = 0
            const winrate = `${wins}/${loses}`
            const tokenTransfers = []
  
            wallet.data.map((data, j) => {
                const issTradeOperationType = data.length > 0 && (data.attributes.operation_type === "trade")
  
                if (issTradeOperationType) {
                    const IsTokenPurchase = data.attributes.transfers[0].fungible_info.symbol !== "ETH" && data.attributes.transfers[0].fungible_info.symbol !== "USDC"

                    if (IsTokenPurchase) {
                        const tokenTransfer = {}
                        tokenTransfer.token = data.attributes.transfers[0].fungible_info.name
                        tokenTransfer.date =  data.attributes.mined_at

                        if (data.attributes.transfers[0].direction == 'in') {
                            tokenTransfer.type = 'Buy'
                        } else {
                            tokenTransfer.type = 'Sell'
                            tokenTransfer.for = `${data.attributes.transfers[1].value} USD`
                            tokenTransfers.push(tokenTransfer)
                        }
                    }

                }
  
          })

          console.log(tokenTransfers)
          console.log(`${searchingWallets[i]} winrate - ` + winrate)
        })
  
      })
      .catch(err => console.error(err));
  }

  
  module.exports = getWalletsTransactions;