
const updateMappedDataOfTokens = (obj, tokenSymbol, transaction) => {
  Array.isArray(obj[tokenSymbol]) ? obj[tokenSymbol].push(transaction) : obj[tokenSymbol] = [transaction]
}


const calculateWalletStatistics = (data) => {
    const mappedDataOfTokens = {};
    const tokensStatistics = {};
    const initialTokenStatistics = {
      pnl: 0,
      wins: 0,
      losses: 0,
      openedPositions: {
        amountInToken: 0,
        amountInUSD: 0,
        amountInUsdWithFee: 0,
        count: 0
      },
      closedPositions: {
        amountInToken: 0,
        amountInUSD: 0,
        amountInUsdWithFee: 0,
        count: 0
      }
    }



    data.map(transaction => {
      const { receivedToken, sentToken } = transaction;

      if (receivedToken.tokenSymbol !== 'ETH') {
        updateMappedDataOfTokens(mappedDataOfTokens, receivedToken.tokenSymbol, transaction);
      }

      if (sentToken.tokenSymbol !== 'ETH') {
        updateMappedDataOfTokens(mappedDataOfTokens, sentToken.tokenSymbol, transaction);
      }

    })

    


    Object.keys(mappedDataOfTokens).map(token => {

      tokensStatistics[token] = mappedDataOfTokens[token].reduceRight((acc, curr, id) => {

        if (curr.receivedToken.tokenSymbol === token) {
          const amountInUSD = curr.receivedToken.amountInUSD ? curr.receivedToken.amountInUSD : curr.sentToken.amountInUSD;

          return { 
            ...acc,
            openedPositions: {
              amountInToken: acc.openedPositions.amountInToken + curr.receivedToken.amountInToken,
              amountInUSD: acc.openedPositions.amountInUSD + amountInUSD,
              amountInUsdWithFee: acc.openedPositions.amountInUsdWithFee + curr.receivedToken.amountInUSD + curr.fee.amountInUSD,
              count: acc.openedPositions.count + 1 
            }
          }

        } else if (curr.sentToken.tokenSymbol === token) {
          const pnl = curr.sentToken.amountInUSD - curr.fee.amountInUSD - acc.openedPositions.amountInUsdWithFee;
          const wins = pnl > 0 ? acc.wins + 1 : acc.wins;
          const losses = pnl < 0 ? acc.losses + 1 : acc.losses;


          return { 
            ...acc,
            pnl,
            wins,
            losses,
            closedPositions: {
              amountInToken: acc.closedPositions.amountInToken + curr.sentToken.amountInToken,
              amountInUSD: acc.closedPositions.amountInUSD + curr.sentToken.amountInUSD,
              amountInUsdWithFee: acc.closedPositions.amountInUsdWithFee + curr.sentToken.amountInUSD + curr.fee.amountInUSD,
              count: acc.closedPositions.count + 1 
            },
            
          };
        }
      }, initialTokenStatistics)
    })

    console.log(tokensStatistics)

    return tokensStatistics;
}

module.exports = calculateWalletStatistics;