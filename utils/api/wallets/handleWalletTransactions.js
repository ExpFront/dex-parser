const excludedTokens = require('./../../../config/excludedTokens')

const handleWalletTransactions = ({ data }) => {
    return data.reduce(( acc, curr ) => {
        const { attributes } = curr;
        const { mined_at, operation_type, status, fee, transfers } = attributes;

        if (operation_type === "trade" && status === 'confirmed') {
            const tokenName = excludedTokens.includes(transfers[0].fungible_info.symbol) ? transfers[1].fungible_info.symbol : transfers[0].fungible_info.symbol;

            const { sentTokenAmountInToken, receivedTokenAmountInToken } = transfers.reduce((acc, curr, id) => {
                return {
                    sentTokenAmountInToken: id === 0 ? acc.sentTokenAmountInToken : acc.sentTokenAmountInToken + curr.quantity.float,
                    receivedTokenAmountInToken: id === transfers.length - 1 ? acc.receivedTokenAmountInToken : acc.receivedTokenAmountInToken + curr.quantity.float
                }
            }, {
                sentTokenAmountInToken: 0,
                receivedTokenAmountInToken: 0
            });


            const newData = {
                transactionTime: mined_at,
                tokenHash: transfers[0].fungible_info.implementations[0].address,

                fee: {
                    tokenSymbol: fee.fungible_info.symbol,
                    tokenPriceThatTime: fee.price,
                    amountInToken: fee.quantity.float,
                    amountInUSD: fee.value
                },

                receivedToken: {
                    tokenSymbol: transfers[0].fungible_info.symbol,
                    tokenPriceThatTime: transfers[0].price,
                    // amountInToken: transfers[0].quantity.float,
                    amountInToken: receivedTokenAmountInToken,
                    amountInUSD: transfers.length > 2 ? transfers[transfers.length - 1].value : transfers[1].value // не уверен что так
                },

                sentToken: {
                    tokenSymbol: transfers[1].fungible_info.symbol,
                    tokenPriceThatTime: transfers[1].price,
                    amountInToken: sentTokenAmountInToken,
                    amountInUSD: transfers[0].value

                    // amountInUSD: transfers[0].fungible_info.symbol === 'USDT' ? transfers[0].quantity.float : transfers[2] ? transfers[2].value + transfers[1].value  : transfers[1].value
                }
            }

            acc[tokenName] = Array.isArray(acc[tokenName]) ? [ ...acc[tokenName], newData ]: [ newData ];
        }

        return acc;
    }, {})
}

module.exports = handleWalletTransactions;

