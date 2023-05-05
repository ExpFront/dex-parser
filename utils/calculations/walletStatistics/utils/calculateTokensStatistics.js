const getTokensPrice = require('../../../api/token/getTokensPrice');

const calculateTokensStatistics = async (tokens) => {

    return Promise.all(tokens.map(async token => {

        token.remainingPositions.amountInUSDWithFee = 0;

        if (token.remainingPositions.amountInToken > 0) {

            const data = await getTokensPrice(token.remainingPositions.tokenHash);

            if (!data.pairs || liquidity.usd < 5000) {  // Если не смогли сфетчить —> пул ликвидности иссяк
                token.remainingPositions.amountInUSDWithFee = 0;
            } else {
                token.remainingPositions.amountInUSDWithFee = data.pairs[0].priceUsd * token.remainingPositions.amountInToken - 12;
            }

        }

        // Если закрывал частично позицию.
        if (token.closedPositions.amountInUSDWithFee > 0) {
            token.pnl = token.closedPositions.amountInUSDWithFee - token.openedPositions.amountInUSDWithFee;
            token.unrealizedPnl = token.pnl > 0 ? token.pnl : token.pnl - token.openedPositions.amountInUSDWithFee * (1 - token.closedPositions.amountInToken / token.openedPositions.amountInToken);
        } else {
            token.pnl = token.remainingPositions.amountInUSDWithFee > 0 ? token.remainingPositions.amountInUSDWithFee - token.openedPositions.amountInUSDWithFee : -token.openedPositions.amountInUSDWithFee;
            token.unrealizedPnl = token.pnl + token.remainingPositions.amountInUSDWithFee;
        }


        token.wins = token.pnl > 0 ? 1 : 0,
        token.losses = token.pnl < 0 ? 1 : 0,

        token.unrealizedWins = token.unrealizedPnl > 0 ? 1 : 0, 
        token.unrealizedLosses = token.unrealizedPnl < 0 ? 1 : 0

        return token;

    }))

}

module.exports = calculateTokensStatistics;




// Возвращает массив из объектов такого вида:

// [{
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
//       amountInUSDWithFee: 0
//     },
//     token: 'FEFE',
//     pnl: -34.02220537256433,
//     unrealizedPnl: -34.02220537256433,
//     wins: 0,
//     losses: 1,
//     unrealizedWins: 0,
//     unrealizedLosses: 1
//   }
// ]