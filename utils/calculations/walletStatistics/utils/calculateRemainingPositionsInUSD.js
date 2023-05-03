const getTokensPrice = require('../../../api/token/getTokensPrice');

const calculateRemainingPositionsInUSD = async (tokens) => {
    const tokenHashes = tokens.reduce((acc, curr) => [ ...acc, curr.tokenHash ], [])
    const tokensPrice = await getTokensPrice(tokenHashes)

    return tokensPrice.pairs.reduce((acc, curr) => {
        const { baseToken, priceUsd, liquidity } = curr;

        if (liquidity.usd < 10) return acc; // Не считаем, если нет ликвидности в пуле для продажи по текущему прайсу

        const token = tokens.filter(item => {
            return item.tokenHash.toLowerCase() === baseToken.address.toLowerCase()
        })[0]

        return acc + priceUsd * token.amountInToken - 12;
    }, 0)
}

module.exports = calculateRemainingPositionsInUSD;

// TODO: refactor