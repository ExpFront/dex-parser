
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
      // amountInUSD: 0,
      // amountInUSDWithFee: 0
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
      chunks: [],
    }
      // amountInUSD: 0,
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

      const { tokenHash, receivedToken, sentToken, fee } = curr;
      const { openedPositions, closedPositions, remainingPositions } = acc;


      if (receivedToken.tokenSymbol === token) {
        const amountInUSD = receivedToken.amountInUSD ? receivedToken.amountInUSD : sentToken.amountInUSD;

        return {
          ...acc,
          token,
          openedPositions: {
            amountInToken: openedPositions.amountInToken + receivedToken.amountInToken,
            amountInUSD: openedPositions.amountInUSD + amountInUSD,
            amountInUSDWithFee: openedPositions.amountInUSDWithFee + amountInUSD + fee.amountInUSD,
            count: openedPositions.count + 1 
          },

          remainingPositions: {
            ...remainingPositions,
            tokenHash,
            amountInToken: remainingPositions.amountInToken + receivedToken.amountInToken,
            // amountInUSD: remainingPositions.amountInUSD + amountInUSD,
            // amountInUSDWithFee: remainingPositions.amountInUSDWithFee + amountInUSD - 12
          }
        }

      } else if (sentToken.tokenSymbol === token) {
        const pnl = sentToken.amountInUSD - fee.amountInUSD - openedPositions.amountInUSDWithFee;
        const wins = pnl > 0 ? acc.wins + 1 : acc.wins;
        const losses = pnl < 0 ? acc.losses + 1 : acc.losses;

        return { 
          ...acc,

          token,
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
            ...remainingPositions,
            amountInToken: remainingPositions.amountInToken - sentToken.amountInToken,
            // amountInUSD: remainingPositions.amountInUSD - sentToken.amountInUSD,
            // amountInUSDWithFee: remainingPositions.amountInUSDWithFee - sentToken.amountInUSD
          }
        };

      }

    }, initialDetailedTokenStatistics)

  })


  // console.log(detailedTokensStatistics, 'detailedTokensStatistics')
  
  const walletStatistics = detailedTokensStatistics.reduce((acc, curr) => {
    // console.log(curr, 'curr')
    return {
      ...acc,

      pnl:  acc.pnl + curr.pnl,
      wins: acc.wins + curr.wins,
      losses: acc.losses + curr.losses,

      openedPositions: {
        ...acc.openedPositions,
        count: acc.openedPositions.count + curr.openedPositions.count
      },

      closedPositions: {
        ...acc.closedPositions,
        count: acc.closedPositions.count + curr.closedPositions.count
      },

      remainingPositions: {
        ...acc.remainingPositions,

        chunks: [
          ...acc.remainingPositions.chunks,
          {
            tokenHash: curr.remainingPositions.tokenHash,
            tokenSymbol: curr.token,
            amountInToken: curr.remainingPositions.amountInToken
          }
        ]
      }
    }

  }, initialWalletStatistics)

  // console.log(walletStatistics.remainingPositions)

  return {
    ...walletStatistics,
    winrate: {
      amount: `${walletStatistics.wins} / ${(walletStatistics.wins + walletStatistics.losses)}`,
      percent: walletStatistics.wins / (walletStatistics.wins + walletStatistics.losses) * 100,
    },
    remainingPositions: {
      ...walletStatistics.remainingPositions,
      count: walletStatistics.openedPositions.count - walletStatistics.closedPositions.count,
    },

  }
}


// TODO: Нужно переделать рассчет remainingPositions (брать текущий прайс токена) + рефакторинг
module.exports = calculateWalletStatistics;