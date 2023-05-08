const excludedTokens = ['ETH', 'USDC', 'USDT', 'BNB']

const handleWalletTransactions = ({ data }) => {
    return data.reduce(( acc, curr ) => {
        const { attributes } = curr;
        const { mined_at, operation_type, status, fee, transfers } = attributes;

        if (operation_type === "trade" && status === 'confirmed') {
            const tokenName = excludedTokens.includes(transfers[0].fungible_info.symbol) ? transfers[1].fungible_info.symbol : transfers[0].fungible_info.symbol;

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
                    amountInToken: transfers[0].quantity.float,
                    // amountInUSD: transfers[2] ? transfers[2].value : transfers[1].value
                    amountInUSD: transfers[1].fungible_info.symbol === 'USDT' ? transfers[2] ? transfers[2].quantity.float + transfers[1].quantity.float : transfers[1].quantity.float : transfers[0].value
                },

                sentToken: {
                    tokenSymbol: transfers[1].fungible_info.symbol,
                    tokenPriceThatTime: transfers[1].price,
                    // amountInToken: transfers[2] ? transfers[1].quantity.float : transfers[1].quantity.float,
                    amountInToken: transfers[2] ? transfers[2].quantity.float + transfers[1].quantity.float : transfers[1].quantity.float,
                    // amountInUSD: transfers[0].value
                    amountInUSD: transfers[0].fungible_info.symbol === 'USDT' ? transfers[0].quantity.float : transfers[2] ? transfers[2].value + transfers[1].value  : transfers[1].value
                }
            }

            acc[tokenName] = Array.isArray(acc[tokenName]) ? [ ...acc[tokenName], newData ]: [ newData ];
        }

        return acc;
    }, {})
}

module.exports = handleWalletTransactions;

