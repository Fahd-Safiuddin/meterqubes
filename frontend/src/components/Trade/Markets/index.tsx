import { Component } from 'react'
import Router from 'next/router'
import { inject, observer } from 'mobx-react'
import Card from '../../Card'
import { withNamespaces, I18nTProps } from '../../../utils/i18n'
import { Table, TableBody, TableRow, TableCol } from '../../Table'
import { getColor } from '../../../utils/colorByValue'
import { bind } from '../../../utils/bind'
import Search from './Search'
import Button from '../../Button'
import Flex from '../../Flex'
import { MarketsStoreTypes } from '../../../stores/markets/types'
import { OrdersStoreTypes } from '../../../stores/order/types'

interface TradeMarketsProps {
  t?: I18nTProps
  lng?: string
  query?: {
    market: string
  }
  getOrders?: OrdersStoreTypes['getOrders']
  marketsStore?: MarketsStoreTypes
}

@withNamespaces('trade')
@inject(({ marketsStore, ordersStore: { getOrders } }) => ({
  marketsStore,
  getOrders
}))
@observer
export default class Markets extends Component<TradeMarketsProps> {
  public componentDidMount() {
    const {
      query,
      marketsStore: { selectMarket, markets }
    } = this.props
    this.onGetMarkets()
    if (markets) {
      selectMarket(markets.find(m => m.id === (query ? +query.market : 1)))
    }
  }

  public componentDidUpdate(np: TradeMarketsProps) {
    const {
      query,
      getOrders,
      marketsStore: { selectMarket, markets }
    } = this.props

    if (query && np.query.market !== query.market) {
      selectMarket(markets.find(m => m.id === (query ? +query.market : 1)))
      getOrders(+query.market)
    }
  }

  @bind
  private onGetMarkets(term?: string) {
    const {
      marketsStore: { getMarkets }
    } = this.props
    getMarkets(term)
  }

  public render() {
    const {
      t,
      lng,
      marketsStore: { markets, selectedMarket }
    } = this.props
    const width = ['38%', '22%', '23%', '17%']
    return (
      <Card
        title={t('markets.title')}
        header={
          <Search
            onSearch={(term: string) => {
              this.onGetMarkets(term)
            }}
          />
        }
        rtl={lng === 'ar'}
      >
        <Table
          head={t('markets.table.rows', { returnObjects: true })}
          width={width}
        >
          <TableBody>
            {Array.isArray(markets) &&
              markets.map(
                ({ id, tokens, price, dayVol, dayPrice, favourite }) => {
                  const StarButtonProps = {
                    icon: favourite ? 'star' : 'star_border',
                    onClick: () => {},
                    size: 'xsm',
                    ...(favourite && { theme: 'star-active' })
                  }
                  return (
                    <TableRow
                      key={id}
                      align="center"
                      onClick={() => {
                        Router.replace(`/trade?market=${id}`)
                      }}
                      active={selectedMarket && selectedMarket.id === id}
                    >
                      <TableCol width={width && width[0]}>
                        <Flex align="center">
                          <Button {...StarButtonProps} />
                          {tokens}
                        </Flex>
                      </TableCol>
                      <TableCol width={width && width[1]}>{price}</TableCol>
                      <TableCol width={width && width[2]}>{dayVol}</TableCol>
                      <TableCol
                        width={width && width[3]}
                        color={getColor(dayPrice)}
                      >
                        {dayPrice}
                      </TableCol>
                    </TableRow>
                  )
                }
              )}
          </TableBody>
        </Table>
      </Card>
    )
  }
}
