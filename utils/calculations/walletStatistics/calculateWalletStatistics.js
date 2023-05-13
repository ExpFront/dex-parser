const getDetailedTokensStatistics = require('./utils/getDetailedTokensStatistics');
const calculateTokensStatistics = require('./utils/calculateTokensStatistics');
const excludedTokens = require('./../../../config/excludedTokens')

const axios = require('axios').default;
const axiosConfig = require('./../../../config/axiosConfig')

const initialWalletStatistics = {
  openedPositions: {
    count: 0,
  },
  closedPositions: {
    count: 0,
  },
  pnl: 0,
  wins: 0,
  losses: 0,
}


// Скрипт подсчитывает общую статистику по кошельку

const calculateWalletStatistics = async (data, searchingWallet) => {

  const detailedTokensStatistics = await getDetailedTokensStatistics(data);
  const tokensStatistics = await calculateTokensStatistics(detailedTokensStatistics);


  const remainingPositionsPnlWithFee = await axios.get(`https://api.zerion.io/v1/wallets/${searchingWallet}/positions/?currency=usd`, axiosConfig)
    .then(({ data: { data }}) => data.reduce((acc, { attributes }) => {

      if (excludedTokens.includes(attributes.fungible_info.symbol)) return acc;

      console.log(attributes.value, 'attributes.value')
      return acc += attributes.value - 12 > 0 ? attributes.value - 12 : 0;
    }, 0));




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

      pnl: acc.pnl + curr.pnl,
      wins: acc.wins + curr.wins,
      losses: acc.losses + curr.losses,
    }
  }, initialWalletStatistics)

  

  return {
    details: tokensStatistics,

    ...walletStatistics,

    pnl: walletStatistics.pnl + remainingPositionsPnlWithFee,
    // onlyRemainingPnl: remainingPositionsPnlWithFee,

    winrate: {
      amount: `${walletStatistics.wins} / ${(walletStatistics.wins + walletStatistics.losses)}`,
      percent: walletStatistics.wins / (walletStatistics.wins + walletStatistics.losses) * 100
    }
  }

}

module.exports = calculateWalletStatistics;