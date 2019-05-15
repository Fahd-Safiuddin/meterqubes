import Router from 'next/router'
import * as Styled from './style'
import Card from '../../Card'
import Button from '../../Button'
import { withNamespaces, I18nTProps } from '../../../utils/i18n'
import { inject, observer } from 'mobx-react'
import Flex from '../../Flex'
import { Component } from 'react'
import { bind } from '../../../utils/bind'
import { ThemeStoreTypes } from '../../../stores/theme/types'
import { MarketsStoreTypes } from '../../../stores/markets/types'
import { OrdersStoreTypes } from '../../../stores/order/types'

interface ITradeHeader {
  query?: { market: number | string }
  t?: I18nTProps
  theme?: ThemeStoreTypes['theme']
  markets?: MarketsStoreTypes['markets']
  marketDetails?: MarketsStoreTypes['marketDetails']
  selectMarket?: MarketsStoreTypes['selectMarket']
  selectedMarket?: MarketsStoreTypes['selectedMarket']
  getMarketDetails?: MarketsStoreTypes['getMarketDetails']
  getOrders?: OrdersStoreTypes['getOrders']
}

@withNamespaces('trade')
@inject(
  ({
    themeStore: { theme },
    marketsStore: {
      markets,
      marketDetails,
      selectMarket,
      selectedMarket,
      getMarketDetails
    },
    ordersStore: { getOrders }
  }) => ({
    theme,
    markets,
    marketDetails,
    selectMarket,
    selectedMarket,
    getMarketDetails,
    getOrders
  })
)
@observer
export default class TradeHeader extends Component<ITradeHeader> {
  interval = null
  public componentDidMount() {
    const {
      query: { market }
    } = this.props
    this.onGetMarketDetails(market)
    this.interval = setInterval(() => this.onGetMarketDetails(market), 60000)
  }

  public componentWillUnmount() {
    clearInterval(this.interval)
  }

  public componentDidUpdate(np: ITradeHeader) {
    const {
      query: { market }
    } = this.props

    if (np.query.market !== market) this.onGetMarketDetails(market)
  }

  @bind private onGetMarketDetails(marketId) {
    const { getMarketDetails } = this.props
    getMarketDetails(marketId)
  }

  @bind private onIncrementMarket() {
    const { markets, selectMarket, selectedMarket, getOrders } = this.props
    const market = markets.find(
      (m: { id: number }) => m.id === selectedMarket.id + 1
    )
    if (market) {
      Router.push(`/trade?market=${market.id}`)
      selectMarket(market)
      getOrders(market.id)
    }
  }

  @bind private onDecrementMarket() {
    const { markets, selectMarket, selectedMarket, getOrders } = this.props
    const market = markets.find(
      (m: { id: number }) => m.id === selectedMarket.id - 1
    )
    if (market) {
      Router.push(`/trade?market=${market.id}`)
      selectMarket(market)
      getOrders(market.id)
    }
  }

  render() {
    const { selectedMarket, marketDetails, t, theme } = this.props
    const favorite = false
    const headerColsNames = t('header.cols', { returnObjects: true })
    const headerInfo = {
      last_price: {
        point: marketDetails && marketDetails.lastPrice,
        sum: marketDetails && marketDetails.lastPriceUSD
      },
      day_change: {
        point: marketDetails && marketDetails.priceChange,
        percent: marketDetails
          ? !marketDetails.changeRate.match(/^\+/g) &&
            +marketDetails.changeRate !== 0
            ? `+${marketDetails.changeRate}`
            : marketDetails.changeRate
          : null
      },
      day_low: {
        point: marketDetails && marketDetails.lowPrice
      },
      day_high: {
        point: marketDetails && marketDetails.highPrice
      }
    }

    const token = selectedMarket ? selectedMarket.tokens : ''

    return (
      <Card>
        <Styled.Header>
          <Styled.Controls>
            <Button
              icon="keyboard_arrow_up"
              onClick={this.onDecrementMarket}
              size="sm"
            />
            <Button
              icon="keyboard_arrow_down"
              onClick={this.onIncrementMarket}
              size="sm"
            />
          </Styled.Controls>
          <Styled.Title align="center">
            {selectedMarket && (
              <Flex align="center">
                <span>{token}</span>
                &nbsp;
                <i className="material-icons">
                  {favorite ? 'star' : 'star_border'}
                </i>
              </Flex>
            )}
          </Styled.Title>
          <Styled.Row>
            {Object.keys(headerInfo).map((key: string, i: number) => (
              <Styled.Article
                key={i}
                title={headerColsNames[i]}
                text={headerInfo[key].point}
                sum={headerInfo[key].sum}
                percent={headerInfo[key].percent}
                theme={theme}
              />
            ))}
          </Styled.Row>
        </Styled.Header>
      </Card>
    )
  }
}
