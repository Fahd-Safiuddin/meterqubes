import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Card from '../Card'
import { withNamespaces, I18nTProps } from '../../utils/i18n'
import { Table } from '../Table'
import Tabs from '../Tabs'
import { bind } from '../../utils/bind'
import { TradeHistoryStoreTypes } from '../../stores/tradeHistory/types'
import { MetamaskStoreTypes } from '../../stores/metamask/types'

interface ITradeHistory {
  t?: I18nTProps
  lng?: string
  query?: {
    market: number | string
  }
  getHistory?: TradeHistoryStoreTypes['getHistory']
  setHistory?: TradeHistoryStoreTypes['setHistory']
  history?: TradeHistoryStoreTypes['history']
  metamaskStatus?: MetamaskStoreTypes['metamaskStatus']
}

@withNamespaces('trade')
@inject(
  ({
    tradeHistoryStore: { getHistory, setHistory, history },
    metamaskStore: { metamaskStatus }
  }) => ({
    getHistory,
    setHistory,
    history,
    metamaskStatus
  })
)
@observer
export default class TradeHistory extends Component<
  ITradeHistory,
  { accountChanged: boolean }
> {
  private width = ['34%', '16%', '32%', '18%']

  state = {
    accountChanged: false
  }

  public componentDidMount() {
    const {
      getHistory,
      query: { market }
    } = this.props

    getHistory(market)
  }

  public componentDidUpdate(np: ITradeHistory) {
    const {
      getHistory,
      query: { market }
    } = this.props

    if (np.query.market !== market) getHistory(market)
  }

  @bind private renderTableContent(data: TradeHistoryStoreTypes['history']) {
    const { t } = this.props
    return (
      <Table
        head={t('history.table.rows', { returnObjects: true })}
        width={this.width}
        body={data}
      />
    )
  }

  public render() {
    const { lng, t, history } = this.props
    const tabs = t('history.tabs', { returnObjects: true })
    return (
      <Card title={t('history.title')} rtl={lng === 'ar'}>
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
              name: 'all',
              content: this.renderTableContent(history)
            }
          ]}
        />
      </Card>
    )
  }
}
