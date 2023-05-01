
const updateMappedDataOfTokens = (obj, tokenSymbol, transaction) => {
  Array.isArray(obj[tokenSymbol]) ? obj[tokenSymbol].push(transaction) : obj[tokenSymbol] = [transaction]
}


const calculateWalletStatistics = (data) => {
  const mappedDataOfTokens = {};
  const excludedTokens = ['ETH', 'USDC', 'USDT']
  const initialDetailedTokenStatistics = {
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

  const initialWalletStatistics = {
    pnl: 0,
    wins: 0,
    losses: 0,
    winrate: 0, // %
    openedPositions: {
      count: 0,
    },
    closedPositions: {
      count: 0,
    },
    remainingPositions: {
      amountInUSD: 0,
    }
  }




  // Вытаскиваем символы уникальных токенов (без эфира)
  data.map(transaction => {
    const { receivedToken, sentToken } = transaction;

    if (!excludedTokens.includes(receivedToken.tokenSymbol)) {
      updateMappedDataOfTokens(mappedDataOfTokens, receivedToken.tokenSymbol, transaction);
    }

    if (!excludedTokens.includes(sentToken.tokenSymbol)) {
      updateMappedDataOfTokens(mappedDataOfTokens, sentToken.tokenSymbol, transaction);
    }

  })

  

  // Проходимся по всем уникальным токенам (без эфира) и собираем статистику сделок по каждому токену
  const detailedTokensStatistics = Object.keys(mappedDataOfTokens).map(token => {

    return mappedDataOfTokens[token].reduceRight((acc, curr) => {

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

    }, initialDetailedTokenStatistics)

  })


  



  const walletStatistics = Object.keys(detailedTokensStatistics).reduce((acc, curr) => {

    return {
      ...acc,

      pnl:  acc.pnl + detailedTokensStatistics[curr].pnl,
      wins: acc.wins + detailedTokensStatistics[curr].wins,
      losses: acc.losses + detailedTokensStatistics[curr].losses,

      openedPositions: {
        ...acc.openedPositions,
        count: acc.openedPositions.count + detailedTokensStatistics[curr].openedPositions.count
      },

      closedPositions: {
        ...acc.closedPositions,
        count: acc.closedPositions.count + detailedTokensStatistics[curr].closedPositions.count
      },

      remainingPositions: {
        ...acc.remainingPositions,
        amountInUSD: acc.remainingPositions.amountInUSD + 1
      }
    }

  }, initialWalletStatistics)



  return {
    ...walletStatistics,
    winrate: {
      amount: `${walletStatistics.wins} / ${(walletStatistics.wins + walletStatistics.losses)}`,
      percent: walletStatistics.wins / (walletStatistics.wins + walletStatistics.losses),
    },
    remainingPositions: {
      ...walletStatistics.remainingPositions,
      count: walletStatistics.openedPositions.count - walletStatistics.closedPositions.count,
      amountInUSDWithFee: walletStatistics.remainingPositions.amountInUSD - (walletStatistics.openedPositions.count - walletStatistics.closedPositions.count) * 12

    },

  }
}


module.exports = calculateWalletStatistics;