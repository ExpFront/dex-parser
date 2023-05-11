const excludedTokens = require('./../../../config/excludedTokens')

const handleWalletTransactions = ({ data }) => {
    return data.reduce(( acc, curr ) => {
        const { attributes } = curr;
        const { mined_at, operation_type, status, fee, transfers } = attributes;

        if (operation_type === "trade" && status === 'confirmed' && !(!excludedTokens.includes(transfers[0].fungible_info.symbol) && !excludedTokens.includes(transfers[transfers.length - 1].fungible_info.symbol))) {
            const tokenName = excludedTokens.includes(transfers[0].fungible_info.symbol) ? transfers[1].fungible_info.symbol : transfers[0].fungible_info.symbol;

            const { sentTokenAmountInToken, receivedTokenAmountInToken, sentTokenAmountInUSD, receivedTokenAmountInUSD } = transfers.reduce((acc, curr, id) => {
                return {
                    sentTokenAmountInToken: id === 0 ? acc.sentTokenAmountInToken : acc.sentTokenAmountInToken + curr.quantity.float,
                    receivedTokenAmountInToken: id === transfers.length - 1 ? acc.receivedTokenAmountInToken : acc.receivedTokenAmountInToken + curr.quantity.float,
                    sentTokenAmountInUSD: id === 0 ? acc.sentTokenAmountInUSD : acc.sentTokenAmountInUSD + curr.value,
                    receivedTokenAmountInUSD: id === transfers.length - 1 ? acc.receivedTokenAmountInUSD : acc.receivedTokenAmountInUSD + curr.value
                }
            }, {
                sentTokenAmountInToken: 0,
                receivedTokenAmountInToken: 0,
                sentTokenAmountInUSD: 0,
                receivedTokenAmountInUSD: 0
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
                    amountInUSD: (transfers[transfers.length - 1].value ? transfers[transfers.length - 1].value : receivedTokenAmountInUSD) // не уверен что так
                },

                sentToken: {
                    tokenSymbol: transfers[1].fungible_info.symbol,
                    tokenPriceThatTime: transfers[1].price,
                    amountInToken: sentTokenAmountInToken,
                    amountInUSD: transfers[0].value ? transfers[0].value : sentTokenAmountInUSD

                    // amountInUSD: transfers[0].fungible_info.symbol === 'USDT' ? transfers[0].quantity.float : transfers[2] ? transfers[2].value + transfers[1].value  : transfers[1].value
                }
            }

            acc[tokenName] = Array.isArray(acc[tokenName]) ? [ ...acc[tokenName], newData ]: [ newData ];
        }

        //учёт отправленных токенов
        if (operation_type === "send" && status === 'confirmed') {
            if (!excludedTokens.includes(transfers[0].fungible_info.symbol)) {
                const tokenName = transfers[0].fungible_info.symbol

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
                        tokenSymbol: 0,
                        tokenPriceThatTime: 0,
                        amountInToken: 0,
                        amountInUSD: 0 
                    },

                    sentToken: {

                        tokenSymbol: transfers[0].fungible_info.symbol,
                        tokenPriceThatTime: transfers[0].price,
                        amountInToken: transfers[0].quantity.float,
                        amountInUSD: transfers[0].value
                    }
                }

                acc[tokenName] = Array.isArray(acc[tokenName]) ? [ ...acc[tokenName], newData ]: [ newData ];
            } 
        }


        if (operation_type === "receive" && status === 'confirmed') {
            if (!excludedTokens.includes(transfers[0].fungible_info.symbol)) {
                const tokenName = transfers[0].fungible_info.symbol

                const { sentTokenAmountInToken, receivedTokenAmountInToken, sentTokenAmountInUSD, receivedTokenAmountInUSD } = transfers.reduce((acc, curr, id) => {
                    return {
                        receivedTokenAmountInToken: acc.receivedTokenAmountInToken + curr.quantity.float,
                        receivedTokenAmountInUSD: acc.receivedTokenAmountInUSD + curr.value
                    }
                }, {
                    receivedTokenAmountInToken: 0,
                    receivedTokenAmountInUSD: 0
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
                        amountInToken: receivedTokenAmountInToken,
                        amountInUSD: receivedTokenAmountInUSD
                    },

                    sentToken: {

                        tokenSymbol: '',
                        tokenPriceThatTime: 0,
                        amountInToken: 0,
                        amountInUSD: 0
                    }
                }

                acc[tokenName] = Array.isArray(acc[tokenName]) ? [ ...acc[tokenName], newData ]: [ newData ];
            } 
        }


        //учёт транзакций с токенами с двух сторон
        if (operation_type === "trade" && status === 'confirmed' && !excludedTokens.includes(transfers[0].fungible_info.symbol) && !excludedTokens.includes(transfers[transfers.length - 1].fungible_info.symbol)) {
            const tokenNameFirst = transfers[0].fungible_info.symbol;
            const tokenNameSecond = transfers[transfers.length - 1].fungible_info.symbol;
            const { sentTokenAmountInToken, receivedTokenAmountInToken, sentTokenAmountInUSD, receivedTokenAmountInUSD } = transfers.reduce((acc, curr, id) => {
                return {
                    sentTokenAmountInToken: id === 0 ? acc.sentTokenAmountInToken : acc.sentTokenAmountInToken + curr.quantity.float,
                    receivedTokenAmountInToken: id === transfers.length - 1 ? acc.receivedTokenAmountInToken : acc.receivedTokenAmountInToken + curr.quantity.float,
                    sentTokenAmountInUSD: id === 0 ? acc.sentTokenAmountInUSD : acc.sentTokenAmountInUSD + curr.value,
                    receivedTokenAmountInUSD: id === transfers.length - 1 ? acc.receivedTokenAmountInUSD : acc.receivedTokenAmountInUSD + curr.value
                }
            }, {
                sentTokenAmountInToken: 0,
                receivedTokenAmountInToken: 0,
                sentTokenAmountInUSD: 0,
                receivedTokenAmountInUSD: 0
            });

            const newDataForFirstToken = {
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
                    amountInToken: receivedTokenAmountInToken,
                    amountInUSD: (transfers[transfers.length - 1].value ? transfers[transfers.length - 1].value : receivedTokenAmountInUSD) // не уверен что так
                },

                sentToken: {
                    tokenSymbol: '',
                    tokenPriceThatTime: 0,
                    amountInToken: 0,
                    amountInUSD: 0

                }
            }

            const newDataForSecondToken = {
                transactionTime: mined_at,
                tokenHash: transfers[transfers.length - 1].fungible_info.implementations[0].address,

                fee: {
                    tokenSymbol: fee.fungible_info.symbol,
                    tokenPriceThatTime: fee.price,
                    amountInToken: fee.quantity.float,
                    amountInUSD: fee.value
                },

                receivedToken: {
                    tokenSymbol: '',
                    tokenPriceThatTime: 0,
                    amountInToken: 0,
                    amountInUSD: 0
                },

                sentToken: {
                    tokenSymbol: transfers[1].fungible_info.symbol,
                    tokenPriceThatTime: transfers[1].price,
                    amountInToken: sentTokenAmountInToken,
                    amountInUSD: transfers[0].value ? transfers[0].value : sentTokenAmountInUSD

                }
            }

            acc[tokenNameFirst] = Array.isArray(acc[tokenNameFirst]) ? [ ...acc[tokenNameFirst], newDataForFirstToken ]: [ newDataForFirstToken ];
            acc[tokenNameSecond] = Array.isArray(acc[tokenNameSecond]) ? [ ...acc[tokenNameSecond], newDataForSecondToken ]: [ newDataForSecondToken ];
        }

        return acc;
    }, {})
}

module.exports = handleWalletTransactions;

