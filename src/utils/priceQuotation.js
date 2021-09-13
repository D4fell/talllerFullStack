'use strict'

let amount = 1;

let priceQuote = async (value1, value2) =>{
    return amount*value1/value2
}

module.exports = { priceQuote }