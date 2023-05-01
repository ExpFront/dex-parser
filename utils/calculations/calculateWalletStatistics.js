
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
        amountInUSDWithFee: 0,
        count: 0
      },
      closedPositions: {
        amountInToken: 0,
        amountInUSD: 0,
        amountInUSDWithFee: 0,
        count: 0
      },
      remainingPositions: {
        amountInToken: 0,
        amountInUSD: 0,
        amountInUSDWithFee: 0
      }
    }


  // Вытаскиваем символы уникальных токенов (без эфира)
  data.map(transaction => {
    const { receivedToken, sentToken } = transaction;

    if (receivedToken.tokenSymbol !== 'ETH') {
      updateMappedDataOfTokens(mappedDataOfTokens, receivedToken.tokenSymbol, transaction);
    }

    if (sentToken.tokenSymbol !== 'ETH') {
      updateMappedDataOfTokens(mappedDataOfTokens, sentToken.tokenSymbol, transaction);
    }

  })

  

  // Проходимся по всем уникальным токенам (без эфира) и собираем статистику сделок по каждому токену
  Object.keys(mappedDataOfTokens).map(token => {

    tokensStatistics[token] = mappedDataOfTokens[token].reduceRight((acc, curr) => {

      const { receivedToken, sentToken, fee } = curr;
      const { openedPositions, closedPositions, remainingPositions } = acc;


      if (receivedToken.tokenSymbol === token) {
        const amountInUSD = receivedToken.amountInUSD ? receivedToken.amountInUSD : sentToken.amountInUSD;

        return { 
          ...acc,
          openedPositions: {
            amountInToken: openedPositions.amountInToken + receivedToken.amountInToken,
            amountInUSD: openedPositions.amountInUSD + amountInUSD,
            amountInUSDWithFee: openedPositions.amountInUSDWithFee + amountInUSD + fee.amountInUSD,
            count: openedPositions.count + 1 
          },
          remainingPositions: {
            amountInToken: remainingPositions.amountInToken + receivedToken.amountInToken,
            amountInUSD: remainingPositions.amountInUSD + amountInUSD,
            amountInUSDWithFee: remainingPositions.amountInUSDWithFee + amountInUSD - 12
          }
        }

      } else if (sentToken.tokenSymbol === token) {
        const pnl = sentToken.amountInUSD - fee.amountInUSD - openedPositions.amountInUSDWithFee;
        const wins = pnl > 0 ? acc.wins + 1 : acc.wins;
        const losses = pnl < 0 ? acc.losses + 1 : acc.losses;

        return { 
          ...acc,
          pnl,
          wins,
          losses,
          closedPositions: {
            amountInToken: closedPositions.amountInToken + sentToken.amountInToken,
            amountInUSD: closedPositions.amountInUSD + sentToken.amountInUSD,
            amountInUSDWithFee: closedPositions.amountInUSDWithFee + sentToken.amountInUSD + fee.amountInUSD,
            count: closedPositions.count + 1 
          },
          remainingPositions: {
            amountInToken: remainingPositions.amountInToken - sentToken.amountInToken,
            amountInUSD: remainingPositions.amountInUSD - sentToken.amountInUSD,
            amountInUSDWithFee: remainingPositions.amountInUSDWithFee - sentToken.amountInUSD
          }
        };

      }

    }, initialTokenStatistics)

  })


  return tokensStatistics;
}


module.exports = calculateWalletStatistics;