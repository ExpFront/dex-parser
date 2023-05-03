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
    }
}


// Скрипт проходится по всем уникальным токенам и собирает детальную статистику сделок

const getDetailedTokensStatistics = (data) => {

    return Object.keys(data).map(token => {

        return data[token].reduceRight((acc, curr) => {

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
                }
            };

        }

        }, initialDetailedTokenStatistics)
    })
}

module.exports = getDetailedTokensStatistics;