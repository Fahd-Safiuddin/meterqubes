export interface ChartStoreTypes {
  values: any
  dates: any
  volumes: any
  getData: (marketId: number, pariod: number) => void
}
