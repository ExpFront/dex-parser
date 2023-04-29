const handleWalletTransactions = ( { data: { data } }) => {
    const mappedTransactionsData = [];

    data.map(( transaction, id ) => {
        const { attributes } = transaction;
        const { mined_at, operation_type, status, fee, transfers } = attributes;


        if (operation_type === "trade" && status === 'confirmed') {

            const mappedTransactionData = {
                transactionTime: mined_at,

                fee: {
                    tokenSymbol: fee.fungible_info.symbol,
                    tokenPriceThatTime: fee.price,
                    amountInToken: fee.quantity.float,
                    amountInUSD: fee.value
                },

                receivedToken: {
                    tokenSymbol: transfers[0].fungible_info.symbol,
                    tokenPriceThatTime: transfers[0].price,
                    amountInToken: transfers[0].quantity.float,
                    amountInUSD: transfers[0].value
                },

                sentToken: {
                    tokenSymbol: transfers[1].fungible_info.symbol,
                    tokenPriceThatTime: transfers[1].price,
                    amountInToken: transfers[1].quantity.float,
                    amountInUSD: transfers[1].value
                }

            }

            mappedTransactionsData.push(mappedTransactionData)

        }

    })

    return mappedTransactionsData;
    

    // if (operationType === "trade") {

    // }


    // transactions.map((wallet, i) => {
    //     const wins = 0
    //     const loses = 0
    //     const winrate = `${wins}/${loses}`
    //     const tokenTransfers = []

    //     wallet.data.map((data, j) => {
    //         const issTradeOperationType = data.length > 0 && (data.attributes.operation_type === "trade")

    //         if (issTradeOperationType) {
    //             const IsTokenPurchase = data.attributes.transfers[0].fungible_info.symbol !== "ETH" && data.attributes.transfers[0].fungible_info.symbol !== "USDC"

    //             if (IsTokenPurchase) {
    //                 const tokenTransfer = {}
    //                 tokenTransfer.token = data.attributes.transfers[0].fungible_info.name
    //                 tokenTransfer.date =  data.attributes.mined_at

    //                 if (data.attributes.transfers[0].direction == 'in') {
    //                     tokenTransfer.type = 'Buy'

    //                 } else {
    //                     tokenTransfer.type = 'Sell'
    //                     tokenTransfer.for = `${data.attributes.transfers[1].value} USD`
    //                     tokenTransfers.push(tokenTransfer)
    //                 }
    //             }

    //         }

    //     })

    //     console.log(tokenTransfers)
    //     console.log(`${searchingWallets[i]} winrate - ` + winrate)
    // })
}

module.exports = handleWalletTransactions;

