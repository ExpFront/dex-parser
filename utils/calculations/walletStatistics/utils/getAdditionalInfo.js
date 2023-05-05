const calculateTokensCurrentData = require('./calculateTokensCurrentData');


// => сумма позиций в USD, которые уже невозможно закрыть
const calcLossOnOutOfLiquidityHashes = (outOfLiquidityHashes, allRemainingPositions) => {
  return outOfLiquidityHashes.reduce((acc, curr) => {
    const foundedElement = allRemainingPositions.chunks.find(element => element.tokenHash === curr);

    return foundedElement ? acc + foundedElement.amountInToken * foundedElement.tokenPriceThatTime : acc
  }, 0)
}



// => дополнительная статистика по кошельку
const getAdditionalInfo = async (walletStatistics) => {

  const { amountInUSDWithFee, outOfLiquidityHashes } = await calculateTokensCurrentData(walletStatistics.remainingPositions.chunks);

  const { additionalLossesCount, additionalLoss, additionalClosedPositionsCount } = {
    additionalLossesCount: outOfLiquidityHashes.length,
    additionalLoss: calcLossOnOutOfLiquidityHashes(outOfLiquidityHashes, walletStatistics.remainingPositions),
    additionalClosedPositionsCount: outOfLiquidityHashes.length,
  }
  
  
  return {
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

}


module.exports = getAdditionalInfo;