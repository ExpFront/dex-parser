const getDetailedTokensStatistics = require('./utils/getDetailedTokensStatistics');
const getAdditionalInfo = require('./utils/getAdditionalInfo');


// Скрипт подсчитывает общую статистику по кошельку
const calculateWalletStatistics = async (data) => {
  const detailedTokensStatistics = getDetailedTokensStatistics(data);
  const initialWalletStatistics = {
    pnl: 0,
    wins: 0,
    losses: 0,
    openedPositions: {
      count: 0,
    },
    closedPositions: {
      count: 0,
      countOfPartiallyClosedPositions: 0,
    },
    remainingPositions: {
      chunks: [],
    }
  }


  const walletStatistics = detailedTokensStatistics.reduce((acc, curr) => {
    const newData = {
      ...acc,

      pnl:  acc.pnl + curr.pnl,
      wins: acc.wins + curr.wins,
      losses: acc.losses + curr.losses,

      openedPositions: {
        count: acc.openedPositions.count + curr.openedPositions.count
      },

      closedPositions: {
        count: acc.closedPositions.count + curr.closedPositions.count,
        countOfPartiallyClosedPositions: acc.closedPositions.countOfPartiallyClosedPositions + curr.closedPositions.countOfPartiallyClosedPositions,
      },
    }

    const newRemainingPositions = {
      remainingPositions: {
        chunks: [
          ...acc.remainingPositions.chunks,
          {
            tokenHash: curr.remainingPositions.tokenHash,
            tokenSymbol: curr.token,
            amountInToken: curr.remainingPositions.amountInToken,
            tokenPriceThatTime: curr.remainingPositions.tokenPriceThatTime // in USD
          }
        ]
      }
    }

    return curr.remainingPositions.amountInToken > 0 ? { ...newData, ...newRemainingPositions } : newData;

  }, initialWalletStatistics)




  const additionalInfo = await getAdditionalInfo(walletStatistics);

  return {
    ...walletStatistics,
    ...additionalInfo
  }
}

module.exports = calculateWalletStatistics;