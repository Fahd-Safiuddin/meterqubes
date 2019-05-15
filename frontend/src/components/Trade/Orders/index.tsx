import { inject, observer } from 'mobx-react'
import Card from '../../Card'
import { withNamespaces, I18nTProps } from '../../../utils/i18n'
import { Table } from '../../Table'
import Tabs from '../../Tabs'
import Placeholder from './Placeholder'
import { Component } from 'react'
import { OrdersStoreTypes } from '../../../stores/order/types'
import { MarketsStoreTypes } from '../../../stores/markets/types'
import { MetamaskStoreTypes } from '../../../stores/metamask/types'
import { getUserToken } from '../../../utils/cookieService'

interface OrdersProps extends Partial<OrdersStoreTypes> {
  t?: I18nTProps
  lng?: string
  disabled?: boolean
  query?: {
    market: number | string
  }
  selectedMarket?: MarketsStoreTypes['selectedMarket']
  metamaskStatus?: MetamaskStoreTypes['metamaskStatus']
}

@withNamespaces('trade')
@inject(
  ({
    ordersStore: { getOrders, ordersList, setOrders },
    marketsStore: { selectedMarket },
    metamaskStore: { metamaskStatus }
  }) => ({
    getOrders,
    ordersList,
    setOrders,
    selectedMarket,
    metamaskStatus
  })
)
@observer
export default class Orders extends Component<OrdersProps> {
  width = ['12%', '10%', '22%', '10%', '16%', '17%', '16%']

  state = {
    accountChanged: false
  }

  public async componentWillReact() {
    const { accountChanged } = this.state
    const { metamaskStatus, getOrders, setOrders, query } = this.props

    if (metamaskStatus === 'account changed') {
      const { accountChanged } = this.state
      if (!accountChanged) {
        setOrders([])
      }
      this.setState({ accountChanged: true })
    }

    const token = await getUserToken()

    if (metamaskStatus === 'logged in' && accountChanged && token) {
      getOrders((query && query.market) || 1)
      this.setState({ accountChanged: false })
    }
  }

  public componentDidMount() {
    const { getOrders, query } = this.props

    getOrders((query && query.market) || 1)
  }

  private renderTabContent(data: OrdersStoreTypes['ordersList']) {
    const { disabled, t } = this.props
    return (
      <Table
        head={t('orders.table.rows', { returnObjects: true })}
        width={this.width}
        body={!disabled && data}
      >
        {disabled && <Placeholder />}
      </Table>
    )
  }

  public render() {
    const { t, lng, ordersList } = this.props
    const tabs = t('orders.tabs', { returnObjects: true })

    const orders = ordersList || []
    return (
      <Card title={t('orders.title')} rtl={lng === 'ar'}>
        <Tabs
          defaultTab="all"
          tabLink={
            Array.isArray(tabs) &&
            tabs.map((label: string) => ({
              name: label.toLowerCase().replace(' ', '_'),
              label
            }))
          }
          tabContent={[
            {
              name: 'selling_orders',
              content: this.renderTabContent(
                orders.filter(({ type }) => type === 'SELL')
              )
            },
            {
              name: 'buying_orders',
              content: this.renderTabContent(
                orders.filter(({ type }) => type === 'BUY')
              )
            },
            {
              name: 'all',
              content: this.renderTabContent(orders)
            }
          ]}
        />
      </Card>
    )
  }
}
