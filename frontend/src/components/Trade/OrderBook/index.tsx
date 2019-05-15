import { inject, observer } from 'mobx-react'
import Card from '../../Card'
import { withNamespaces, I18nTProps } from '../../../utils/i18n'
import { Table } from '../../Table'
import Text from '../../Text'
import Bar from '../../Bar'
import { colors } from '../../../styles/colors'
import { Component } from 'react'
import { bind } from '../../../utils/bind'
import { OrdersStoreTypes } from '../../../stores/order/types'

interface OrderBookProps {
  t?: I18nTProps
  lng?: string
  query?: {
    market: number | string
  }
  getOrderBook?: OrdersStoreTypes['getOrderBook']
  orderBook?: OrdersStoreTypes['orderBook']
}

@withNamespaces('trade')
@inject(({ ordersStore: { getOrderBook, orderBook } }) => ({
  getOrderBook,
  orderBook
}))
@observer
export default class OrderBook extends Component<OrderBookProps> {
  private width = ['20%', '32%', '25%', '23%']

  public componentDidMount() {
    const {
      getOrderBook,
      query: { market }
    } = this.props

    getOrderBook(market)
  }

  public componentDidUpdate(np: OrderBookProps) {
    const {
      getOrderBook,
      query: { market }
    } = this.props

    if (np.query.market !== market) {
      getOrderBook(market)
    }
  }

  @bind private renderBodyTop(data: OrdersStoreTypes['orderBook']['SELL']) {
    return data.map(({ price, myAmount, ...rest }) => {
      const sumArray = data.map(({ price }) => +price) || []
      return {
        size: () => (
          <div
            style={{ paddingRight: '0.5rem', width: '100%', height: '100%' }}
          >
            <Bar amount={+price} data={sumArray} color={colors.success} />
          </div>
        ),
        price: () => (
          <Text color="successLight" inline>
            {price}
          </Text>
        ),
        ...rest
      }
    })
  }

  @bind private renderBodyBottom(data: OrdersStoreTypes['orderBook']['BUY']) {
    return data.map(({ price, myAmount, ...rest }) => {
      const sumArray = data.map(({ price }) => +price) || []
      return {
        size: () => (
          <div
            style={{ paddingRight: '0.5rem', width: '100%', height: '100%' }}
          >
            <Bar amount={+price} data={sumArray} color={colors.primary} />
          </div>
        ),
        price: () => (
          <Text color="primaryLight" inline>
            {price}
          </Text>
        ),
        ...rest
      }
    })
  }

  render() {
    const { lng, t, orderBook } = this.props

    return (
      <Card title={t('orderBook.title')} rtl={lng === 'ar'}>
        <Table
          head={t('orderBook.table.rows', { returnObjects: true })}
          width={this.width}
          body={this.renderBodyTop(orderBook ? orderBook.SELL : [])}
        />
        <Table
          head={['Spread', '0.0000004700']}
          headFilled
          width={this.width}
          body={this.renderBodyBottom(orderBook ? orderBook.BUY : [])}
        />
      </Card>
    )
  }
}
