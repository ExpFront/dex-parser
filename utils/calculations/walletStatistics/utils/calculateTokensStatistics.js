
const calculateTokensStatistics = async (tokens) => {

    return await Promise.all(tokens.map(async token => {

        // Если открытой позиции не было, а закрытая была. (такое бывает из-за лимита на объем сфетченных транзакций)

        if (token.closedPositions.amountInUSDWithFee > 0) { // Если закрывал частично позицию.
            token.pnl = token.closedPositions.amountInUSDWithFee - token.openedPositions.amountInUSDWithFee;
        } else {
            token.pnl = -token.openedPositions.amountInUSDWithFee;
        }

        token.wins = token.pnl > 0 ? 1 : 0;
        token.losses = token.pnl < 0 ? 1 : 0;

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