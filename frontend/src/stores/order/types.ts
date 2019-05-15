type OrderTypes = {
  pair: string
  type: string
  price: string
  amount: string
  avaliableAmount: string
  confirmedAmount: string
  createdAt: string
}

export interface IOrderBookItem {
  amount: string
  myAmount?: string
  price: string
  total?: string
}

export interface OrdersStoreTypes {
  ordersList: OrderTypes[]
  orderStatus: string
  error: string
  relayer: string
  orderBook: {
    marketId: number
    BUY?: IOrderBookItem[]
    SELL?: IOrderBookItem[]
  }
  setOrderStatus: (status: string) => void
  createOrder: (
    price: string,
    amount: string,
    tokens: string,
    baseToken: string,
    quoteToken: string,
    isSell: boolean
  ) => void
  getOrders: (marketId: number | string) => void
  setOrders: (orders: OrdersStoreTypes['ordersList'] | []) => void
  getOrderBook: (marketId: number | string) => void
  addOrderBook: (order: OrdersStoreTypes['orderBook']) => void
}

export interface SignOrderTypes {
  version: number
  trader: string
  relayer: string
  baseToken: string
  quoteToken: string
  baseTokenAmount: number
  quoteTokenAmount: number
  gasTokenAmount: number | string
  isSell: boolean
  isMarket: boolean
  expiredAtSeconds: string | number
  asMakerFeeRate: number
  asTakerFeeRate: number
  makerRebateRate: number
  salt: number
  data: string
}
