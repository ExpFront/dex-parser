const getDetailedTokensStatistics = require('./utils/getDetailedTokensStatistics');
const calculateTokensStatistics = require('./utils/calculateTokensStatistics');
const excludedTokens = require('./../../../config/excludedTokens')

const initialWalletStatistics = {
  openedPositions: {
    count: 0,
  },
  closedPositions: {
    count: 0,
  },
  remainingPositions: {
    count: 0,
  },
  pnl: 0,
  unrealizedPnl: 0,
  wins: 0,
  losses: 0,
  unrealizedWins: 0,
  unrealizedLosses: 0
}


// Скрипт подсчитывает общую статистику по кошельку

const calculateWalletStatistics = async (data) => {

  const detailedTokensStatistics = getDetailedTokensStatistics(data);
  const tokensStatistics = await calculateTokensStatistics(detailedTokensStatistics);

  const walletStatistics = tokensStatistics.reduce((acc, curr) => {

    if (excludedTokens.includes(curr.token)) return acc;

    return {
      ...acc,

      openedPositions: {
        count: acc.openedPositions.count + curr.openedPositions.count
      },

      closedPositions: {
        count: acc.closedPositions.count + curr.closedPositions.count
      },

      remainingPositions: {
        count: curr.remainingPositions.amountInToken > 0 ? acc.remainingPositions.count + 1 : acc.remainingPositions.count
      },

      pnl: acc.pnl + curr.pnl,
      unrealizedPnl: acc.unrealizedPnl + curr.unrealizedPnl,
      wins: acc.wins + curr.wins,
      losses: acc.losses + curr.losses,
      unrealizedWins: acc.unrealizedWins + curr.unrealizedWins,
      unrealizedLosses: acc.unrealizedLosses + curr.unrealizedLosses,
    }
  }, initialWalletStatistics)


  return {
    details: tokensStatistics,

    ...walletStatistics,

    winrate: {
      amount: `${walletStatistics.wins} / ${(walletStatistics.wins + walletStatistics.losses)}`,
      percent: walletStatistics.wins / (walletStatistics.wins + walletStatistics.losses) * 100
    },

    unrealizedWinrate: {
      amount: `${walletStatistics.unrealizedWins} / ${(walletStatistics.unrealizedWins + walletStatistics.unrealizedLosses)}`,
      percent: walletStatistics.unrealizedWins / (walletStatistics.unrealizedWins + walletStatistics.unrealizedLosses) * 100
    },

  }

}

module.exports = calculateWalletStatistics;