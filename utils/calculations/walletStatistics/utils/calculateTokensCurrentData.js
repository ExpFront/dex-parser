const getTokensPrice = require('../../../api/token/getTokensPrice');

const calculateTokensCurrentData = async (tokens) => {
    const tokenHashes = tokens.reduce((acc, curr) => [ ...acc, curr.tokenHash ], [])
    const tokensPrice = await getTokensPrice(tokenHashes)

    // Считаем остаток позиций в USD
    const amountInUSDWithFee = tokensPrice.pairs.reduce((acc, curr) => {
        const { baseToken, priceUsd, liquidity } = curr;

        if (liquidity.usd < 100) return acc; // Не считаем, если нет ликвидности в пуле для продажи по текущему прайсу

        const token = tokens.filter(item => {
            return item.tokenHash.toLowerCase() === baseToken.address.toLowerCase()
        })[0]

        return acc + priceUsd * token.amountInToken - 12; // 12 is fee
    }, 0)


    // Определяем позиции, которые уже невозможно закрыть (нет ликвидности, пары больше не существует)
    const outOfLiquidityHashes = tokenHashes.filter(item => {
        const wasTokenPriceFetchedAndLiquidityPoolIsNotEmpty = tokensPrice.pairs.find(element => {
            return element.baseToken.address.toLowerCase() === item.toLowerCase() && element.liquidity.usd >= 100
        });

        return !wasTokenPriceFetchedAndLiquidityPoolIsNotEmpty;
    })
    
    return {
        amountInUSDWithFee, 
        outOfLiquidityHashes
    };
}

module.exports = calculateTokensCurrentData;