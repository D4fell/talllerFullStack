let axios = require("axios").default;
let brave = require('../../config/braveCoin.config')
const _ = require('lodash')

let optionsGetDataCoin = {
    method: 'GET',
    url: `${brave.URL}asset`,
    params: {status: 'ACTIVE'},
    headers: {
        'x-rapidapi-host': brave.XRHOST,
        'x-rapidapi-key': brave.XRKEY
    }
};

let braveCoinList = async () => {
    return await axios.request(optionsGetDataCoin).then( async (responseGetDataCoin) => {
        return responseGetDataCoin.data.content
    }).catch(function (error) {
        return { status: 500, message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas'}
    });
}


let getPriceCoin = async (coinID) => {
    let optionsGetToken = {
        method: 'POST',
        url: `${brave.URL}oauth/token`,
        headers: {
          'content-type': brave.CONTENT,
          'x-rapidapi-host': brave.XRHOST,
          'x-rapidapi-key': brave.XRKEY
        },
        data: {
          audience: brave.AUDIENCE,
          client_id: brave.CLIENTID,
          grant_type: brave.GRANTYPE
        }
    };
    return axios.request(optionsGetToken).then( async (responseGetToken) => {
        let optionsPrice = {
            method: 'GET',
            url: `${brave.URL}market-cap`,
            params: {assetId: `${coinID}`},
            headers: {
              authorization: `Bearer ${responseGetToken.data.access_token}`,
              'x-rapidapi-host': brave.XRHOST,
              'x-rapidapi-key': brave.XRKEY
            }
        };
        return await axios.request(optionsPrice).then( (responsePrice) => {
            return responsePrice.data.content[0].price
        }).catch(function (error) {
            return { status: 500, message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas'}
        });        

    }).catch(function (error) {
        return {status: 500, message: error.message || 'Ha ocurrido un error intentando Autenticarse en https://api.bravenewcoin.com'}
    });
}


module.exports = {
    braveCoinList:braveCoinList,
    getPriceCoin:getPriceCoin
}