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
}

module.exports = handleWalletTransactions;

