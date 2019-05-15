export interface MarketTypes {
  id: number
  tokens: string
  price: string
  dayVol: string
  dayPrice: string
  favourite?: boolean
  baseToken: string
  baseTokenAddress: string
  quoteToken: string
  quoteTokenAddress: string
}

export interface MarketsStoreTypes {
  gasPrice: number | null
  markets: MarketTypes[]
  selectedMarket: MarketTypes
  marketDetails: {
    changeRate: string
    firstPrice: string
    highPrice: string
    lastPrice: string
    lowPrice: string
    priceChange: string
    lastPriceUSD: string
  }
  getMarkets: (term?: string) => MarketTypes
  selectMarket: (object: MarketTypes) => void
  getMarketDetails: (marketId: number) => void
}
