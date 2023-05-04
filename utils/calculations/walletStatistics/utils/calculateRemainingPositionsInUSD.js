const getTokensPrice = require('../../../api/token/getTokensPrice');

const calculateRemainingPositionsInUSD = async (tokens) => {
    const tokenHashes = tokens.reduce((acc, curr) => [ ...acc, curr.tokenHash ], [])
    const tokensPrice = await getTokensPrice(tokenHashes)

    const amountInUSDWithFee = tokensPrice.pairs.reduce((acc, curr) => {
        const { baseToken, priceUsd, liquidity } = curr;


        if (liquidity.usd < 100) return acc; // Не считаем, если нет ликвидности в пуле для продажи по текущему прайсу

        const token = tokens.filter(item => {
            return item.tokenHash.toLowerCase() === baseToken.address.toLowerCase()
        })[0]

        return acc + priceUsd * token.amountInToken - 12;
    }, 0)


    const outOfLiquidityHashes = tokenHashes.filter(item => {
        const wasTokenPriceFetchedAndItIsNotEmpty = tokensPrice.pairs.find(element => {
            return element.baseToken.address.toLowerCase() === item.toLowerCase() && element.liquidity.usd > 100
        });

        return !wasTokenPriceFetchedAndItIsNotEmpty;
    })
    
    return {
        amountInUSDWithFee, 
        outOfLiquidityHashes
    };
}

module.exports = calculateRemainingPositionsInUSD;

// TODO: refactor