import { ChartStoreTypes } from '../../../stores/chart/types'
import { ThemeStoreTypes } from '../../../stores/theme/types'

export interface ChartTypes {
  option: any
  series: {
    candle: boolean
    volumes: boolean
    ma3: boolean
    ma5: boolean
    ma10: boolean
    ma20: boolean
  }
  period: number
}

export interface ChartProps
  extends Partial<ThemeStoreTypes>,
    Partial<ChartStoreTypes> {
  rtl?: boolean
  query: { market: number | string; period?: number | string }
}
