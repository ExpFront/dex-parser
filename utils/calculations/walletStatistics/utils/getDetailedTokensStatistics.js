const initialDetailedTokenStatistics = {
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
      count: 0,
      countOfPartiallyClosedPositions: 0
    },
    remainingPositions: {
      amountInToken: 0,
    }
}


// Скрипт проходится по всем уникальным токенам и собирает детальную статистику сделок

const getDetailedTokensStatistics = (data) => {

    return Object.keys(data).map(token => {

        return data[token].reduceRight((acc, curr) => {
            
            const { tokenHash, receivedToken, sentToken, fee } = curr;
            const { openedPositions, closedPositions, remainingPositions } = acc;

            // if (receivedToken.tokenSymbol === '$MONG' || sentToken.tokenSymbol === '$MONG') console.log(curr, 'curr')

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
                    }
                }

            } else if (sentToken.tokenSymbol === token) {
                return { 
                    ...acc,

                    token,

                    closedPositions: {
                        amountInToken: closedPositions.amountInToken + sentToken.amountInToken,
                        amountInUSD: closedPositions.amountInUSD + sentToken.amountInUSD,
                        amountInUSDWithFee: closedPositions.amountInUSDWithFee + sentToken.amountInUSD - fee.amountInUSD,
                        count: remainingPositions.amountInToken - sentToken.amountInToken === 0 ? closedPositions.count + 1 : closedPositions.count,
                        countOfPartiallyClosedPositions: remainingPositions.amountInToken - sentToken.amountInToken === 0 ? closedPositions.countOfPartiallyClosedPositions : closedPositions.countOfPartiallyClosedPositions + 1,
                    },

                    remainingPositions: {
                        ...remainingPositions,
                        amountInToken: remainingPositions.amountInToken - sentToken.amountInToken,
                    }
                };

            }

            return acc;

        }, initialDetailedTokenStatistics)
    })
}

module.exports = getDetailedTokensStatistics;





// Возвращает массив из объектов такого вида:
//   [{
//     openedPositions: {
//       amountInToken: 4349709265.917263,
//       amountInUSD: 22.914378461847864,
//       amountInUSDWithFee: 34.02220537256433,
//       count: 1
//     },
//     closedPositions: {
//       amountInToken: 0,
//       amountInUSD: 0,
//       amountInUSDWithFee: 0,
//       count: 0,
//       countOfPartiallyClosedPositions: 0
//     },
//     remainingPositions: {
//       amountInToken: 4349709265.917263,
//       tokenHash: '0x76c73e630b61551067ab78c6f5909b5ed74edb8a',
//       tokenPriceThatTime: 7.821719405283e-9
//     },
//     token: 'FEFE'
//   }
// ]