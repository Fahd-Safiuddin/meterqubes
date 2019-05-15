interface ITradeHistoryItem {
  amount: string
  createdAt: string
  id?: number
  price: string
  side: string
}

export interface TradeHistoryStoreTypes {
  history: ITradeHistoryItem[]
  getHistory: (market: number | string) => void
  setHistory: (history: ITradeHistoryItem | []) => void
}
