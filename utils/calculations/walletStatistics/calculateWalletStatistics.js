const getDetailedTokensStatistics = require('./utils/getDetailedTokensStatistics')
const calculateRemainingPositionsInUSD = require('./utils/calculateRemainingPositionsInUSD')


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





  const { amountInUSDWithFee, outOfLiquidityHashes } = await calculateRemainingPositionsInUSD(walletStatistics.remainingPositions.chunks);

  const calcLossOnOutOfLiquidityHashes = (hashes) => {
    return hashes.reduce((acc, curr) => {
      const data = walletStatistics.remainingPositions.chunks.find(element => element.tokenHash === curr);

      return acc + data.amountInToken * data.tokenPriceThatTime
    }, 0)
  }


  const { additionalLossesCount, additionalLoss, additionalClosedPositionsCount } = {
    additionalLossesCount: outOfLiquidityHashes.length,
    additionalLoss: calcLossOnOutOfLiquidityHashes(outOfLiquidityHashes),
    additionalClosedPositionsCount: outOfLiquidityHashes.length,
  }




  const additionalInfo = {
    pnl: walletStatistics.pnl - additionalLoss,
    losses: walletStatistics.losses + additionalLossesCount,

    closedPositions: {
      ...walletStatistics.closedPositions,
      count: walletStatistics.closedPositions.count + additionalClosedPositionsCount
    },

    winrate: {
      amount: `${walletStatistics.wins} / ${(walletStatistics.wins + walletStatistics.losses + outOfLiquidityHashes.length)}`,
      percent: walletStatistics.wins / (walletStatistics.wins + walletStatistics.losses + outOfLiquidityHashes.length) * 100,
    },

    remainingPositions: {
      ...walletStatistics.remainingPositions,
      amountInUSDWithFee,
      count: walletStatistics.openedPositions.count - walletStatistics.closedPositions.count,
    },
  }


  return {
    ...walletStatistics,
    ...additionalInfo
  }
}

module.exports = calculateWalletStatistics;