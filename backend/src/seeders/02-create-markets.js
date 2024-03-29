const { ORDER_TYPE } = require('../constants/market')

module.exports = {
  up: async (queryInterface) => {
    const quoteTokenAddress = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
      ? '0x251bbfa0abf2dc356a44f7af5e4d7a224a4ec01f' // WETH contract Ropsten address
      : '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH contract Mainnet address

    const markets = [
      {
        tokens: 'BNB-WETH',
        baseToken: 'BNB',
        baseTokenProjectUrl: 'https://www.binance.com/',
        baseTokenName: 'Binance Coin',
        baseTokenDecimals: 18,
        baseTokenAddress: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '1.000000000000000000',
        pricePrecision: 5,
        priceDecimals: 8,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT} }`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'MKR-WETH',
        baseToken: 'MKR',
        baseTokenProjectUrl: 'https://makerdao.com/',
        baseTokenName: 'Maker',
        baseTokenDecimals: 18,
        baseTokenAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '0.005000000000000000',
        pricePrecision: 5,
        priceDecimals: 8,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT} }`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'OMG-WETH',
        baseToken: 'OMG',
        baseTokenProjectUrl: 'https://omisego.network/',
        baseTokenName: 'OmiseGo',
        baseTokenDecimals: 18,
        baseTokenAddress: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '0.300000000000000000',
        pricePrecision: 5,
        priceDecimals: 8,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT} }`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'ZRX-WETH',
        baseToken: 'ZRX',
        baseTokenProjectUrl: 'https://0x.org/',
        baseTokenName: '0x Protocol Token',
        baseTokenDecimals: 18,
        baseTokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '20.000000000000000000',
        pricePrecision: 5,
        priceDecimals: 8,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT}, ${ORDER_TYPE.MARKET} }`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'BAT-WETH',
        baseToken: 'BAT',
        baseTokenProjectUrl: 'https://basicattentiontoken.org/',
        baseTokenName: 'Basic Attention Token',
        baseTokenDecimals: 18,
        baseTokenAddress: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '20.000000000000000000',
        pricePrecision: 5,
        priceDecimals: 8,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT}, ${ORDER_TYPE.MARKET} }`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'WTC-WETH',
        baseToken: 'WTC',
        baseTokenProjectUrl: 'http://www.waltonchain.org/',
        baseTokenName: 'Walton',
        baseTokenDecimals: 18,
        baseTokenAddress: '0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '1.000000000000000000',
        pricePrecision: 5,
        priceDecimals: 6,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT}}`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'KCS-WETH',
        baseToken: 'KCS',
        baseTokenProjectUrl: 'https://www.kucoin.com/',
        baseTokenName: 'KuCoin Shares',
        baseTokenDecimals: 18,
        baseTokenAddress: '0x039b5649a59967e3e936d7471f9c3700100ee1ab',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '1.000000000000000000',
        pricePrecision: 5,
        priceDecimals: 8,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT}}`,
        marketOrderMaxSlippage: '0.20000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'LINK-WETH',
        baseToken: 'LINK',
        baseTokenProjectUrl: 'https://link.smartcontract.com/',
        baseTokenName: 'ChainLink Token',
        baseTokenDecimals: 18,
        baseTokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '50.000000000000000000',
        pricePrecision: 4,
        priceDecimals: 7,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT}}`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'HOT-WETH',
        baseToken: 'HOT',
        baseTokenProjectUrl: 'https://thehydrofoundation.com/',
        baseTokenName: 'Hydro Protocol',
        baseTokenDecimals: 18,
        baseTokenAddress: '0x9af839687f6c94542ac5ece2e317daae355493a1',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '1000.000000000000000000',
        pricePrecision: 5,
        priceDecimals: 8,
        amountDecimals: 0,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT}, ${ORDER_TYPE.MARKET} }`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tokens: 'ENJ-WETH',
        baseToken: 'ENJ',
        baseTokenProjectUrl: 'https://enjincoin.io/',
        baseTokenName: 'Enjin Coin',
        baseTokenDecimals: 18,
        baseTokenAddress: '0x7e534b4192daeaa6559c08c7147364b00a7ce697',
        quoteToken: 'WETH',
        quoteTokenDecimals: 18,
        quoteTokenAddress,
        minOrderSize: '1.000000000000000000',
        pricePrecision: 5,
        priceDecimals: 8,
        amountDecimals: 2,
        asMakerFeeRate: '0.00100',
        asTakerFeeRate: '0.00300',
        supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT}, ${ORDER_TYPE.MARKET} }`,
        marketOrderMaxSlippage: '0.10000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    markets.push({
      tokens: 'EMPR-WETH',
      baseToken: 'EMPR',
      baseTokenProjectUrl: 'http://empowr.com/',
      baseTokenName: 'empowr orange',
      baseTokenDecimals: 18,
      baseTokenAddress: '0xdaf16fad57bc1d43a57695d1e724013ebe8e154a', // Ropsten
      // baseTokenAddress: '0x029606e5ec44cad1346d6a1273a53b971fa93ad6', // Mainnet
      quoteToken: 'WETH',
      quoteTokenDecimals: 18,
      quoteTokenAddress: '0x251bbfa0abf2dc356a44f7af5e4d7a224a4ec01f', // Ropsten
      // quoteTokenAddress: '0xe7D7b37e72510309Db27C460378f957B1B04Bd5d', // Mainnet
      minOrderSize: '0.000100000000000000',
      pricePrecision: 5,
      priceDecimals: 11,
      amountDecimals: 2,
      asMakerFeeRate: '0.00100',
      asTakerFeeRate: '0.00300',
      supportedOrderTypes: `{ ${ORDER_TYPE.LIMIT}, ${ORDER_TYPE.MARKET} }`,
      marketOrderMaxSlippage: '0.20000',
      createdAt: new Date(),
      updatedAt: new Date(),
    },)

    await queryInterface.bulkInsert('market', markets, {})
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('market', null, {})
  },

}
