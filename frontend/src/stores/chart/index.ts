import { observable, action } from 'mobx'
import { useStaticRendering } from 'mobx-react'
import { isServer } from '../../utils/isServer'
import { ChartStoreTypes } from './types'
import { bind } from '../../utils/bind'
import { API_URL } from '../../config/api'
import { apiCaller } from '../../utils/apiCaller'

useStaticRendering(isServer)

class ChartStore {
  @observable dates: ChartStoreTypes['dates']
  @observable values: ChartStoreTypes['values']
  @observable volumes: ChartStoreTypes['volumes']

  constructor({}, initialState: ChartStoreTypes) {
    this.dates = initialState ? initialState.dates : []
    this.values = initialState ? initialState.values : []
    this.volumes = initialState ? initialState.volumes : []
  }

  @bind @action public async getData(marketId: number, period: number) {
    const res = await apiCaller(
      `${API_URL}/chart?marketId=${marketId || 1}&period=${period || 90}`
    )

    this.values = res.map(item => [+item[1], +item[2], +item[5], +item[6]])
    this.dates = res.map(item => item[0])
    this.volumes = res.map((item, i) => [
      i,
      +item[1],
      +item[1] > +item[2] ? 1 : -1
    ])
  }
}

export const initChartStore = initialState => {
  return new ChartStore(isServer, initialState)
}
