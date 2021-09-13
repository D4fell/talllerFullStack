const { priceQuote } = require ('../utils/priceQuotation');

const priceCoin = 52700; //precio del BTC
const priceNewCoin = 3900; //precio del ETH

test('Comprobar precio cotización', async () => {
    let valueQuote = await priceQuote(priceCoin,priceNewCoin);
    expect(valueQuote).toEqual(13.512820512820513);
})