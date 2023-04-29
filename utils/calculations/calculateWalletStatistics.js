const calculateWalletStatistics = (data) => {
    console.log(data, 'data')

    // const newData = data.filter(transaction => data.includes(transaction.))


    return {
      winrate: {
        // percent: ,
        // amountOfAllTrades: ,
        // amountOfProfitTrades: ,
        // amountOfStillOpenedTrades: 
      },
      profit: {
        // usd: ,
        // percent:
      }
    }
}

module.exports = calculateWalletStatistics;



// {
  //   winrate: calculateWinrate(mappedTransactionsData), // percent, amountOfAllTrades
  //   // profit: calculateProfit(mappedTransactionsData) // usd: , percent: .
  // }

// [4, 6, 8, 12].any(isPrime)

// [
//     {
//       transactionTime: '2023-04-28T12:02:35Z',
//       fee: {
//         tokenSymbol: 'ETH',
//         tokenPriceThatTime: 1904.1799999999998,
//         amountInToken: 0.0065258835628798,
//         amountInUSD: 12.426456962764457
//       },
//       receivedToken: {
//         tokenSymbol: 'KEKW',
//         tokenPriceThatTime: null,
//         amountInToken: 609475034581.738,
//         amountInUSD: null
//       },
//       sentToken: {
//         tokenSymbol: 'ETH',
//         tokenPriceThatTime: 1904.1799999999998,
//         amountInToken: 0.02,
//         amountInUSD: 38.0836
//       }
//     },
//     {
//       transactionTime: '2023-04-27T23:39:47Z',
//       fee: {
//         tokenSymbol: 'ETH',
//         tokenPriceThatTime: 1910.2599999999998,
//         amountInToken: 0.0060408110255368,
//         amountInUSD: 11.539519669641926
//       },
//       receivedToken: {
//         tokenSymbol: 'ETH',
//         tokenPriceThatTime: 1910.2599999999998,
//         amountInToken: 0.0251811527419836,
//         amountInUSD: 48.10254883690159
//       },
//       sentToken: {
//         tokenSymbol: 'JEET',
//         tokenPriceThatTime: 1.1212458046959014e-9,
//         amountInToken: 42958734362.301956,
//         amountInUSD: 48.167300678776726
//       }
//     },
//     {
//       transactionTime: '2023-04-27T23:34:11Z',
//       fee: {
//         tokenSymbol: 'ETH',
//         tokenPriceThatTime: 1910.94,
//         amountInToken: 0.0049309915058837,
//         amountInUSD: 9.422828908253399
//       },
//       receivedToken: {
//         tokenSymbol: 'JEET',
//         tokenPriceThatTime: 1.1253677993402678e-9,
//         amountInToken: 42958734362.301956,
//         amountInUSD: 48.344376351746895
//       },
//       sentToken: {
//         tokenSymbol: 'ETH',
//         tokenPriceThatTime: 1910.94,
//         amountInToken: 0.0253326699021024,
//         amountInUSD: 48.40921222272356
//       }
//     },
//     {
//       transactionTime: '2023-04-25T18:33:23Z',
//       fee: {
//         tokenSymbol: 'ETH',
//         tokenPriceThatTime: 1842.9099999999999,
//         amountInToken: 0.0060273300978976,
//         amountInUSD: 11.107826910716465
//       },
//       receivedToken: {
//         tokenSymbol: 'FEFE',
//         tokenPriceThatTime: 5.268025300310664e-9,
//         amountInToken: 4349709265.917263,
//         amountInUSD: 22.914378461847864
//       },
//       sentToken: {
//         tokenSymbol: 'ETH',
//         tokenPriceThatTime: 1842.9099999999999,
//         amountInToken: 0.01271568060218,
//         amountInUSD: 23.43385493856354
//       }
//     }
//   ]