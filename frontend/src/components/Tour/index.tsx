import { useState, useEffect, memo } from 'react'
import Router from 'next/router'
import { withNamespaces, I18nTProps } from '../../utils/i18n'
import Grid from '../Grid'
import TradeSellBuy from '../Trade/TradeSellBuy'
import OrderBook from '../Trade/OrderBook'
import Balance from '../Trade/Balance'
import TradeHeader from '../Trade/TradeHeader'
import Orders from '../Trade/Orders'
import Markets from '../Trade/Markets'
import History from '../Trade/History'
import Modal from '../Modal'
import Text from '../Text'
import Button from '../Button'
import * as Styled from './style'
import Flex from '../Flex'
import Media from '../Media'
import { ROUTES } from '../../config/routes'
import Chart from '../Trade/Chart'

export default withNamespaces('tour')(
  memo(
    ({
      t,
      lng,
      query
    }: {
      t: I18nTProps
      lng: string
      query: { market: number | string }
    }) => {
      const modalsNames = [
        'welcome',
        'wrapEth',
        'orderBook',
        'markets',
        'trade',
        'chart',
        'orders',
        'history'
      ]
      const url = query.market
        ? `${ROUTES.trade}?market=${query.market}`
        : ROUTES.trade
      const [modal, setModal] = useState('welcome')
      let [count, setCount] = useState(0)

      useEffect(() => {
        setModal(modalsNames[count])
      })

      const WelcomeModal = () => {
        return (
          <Modal
            title={t('welcome.title')}
            open={modal === 'welcome'}
            onClose={() => Router.push(url)}
            align="center"
            textAlign="center"
            size="sm"
          >
            <Text>{t('welcome.text')}</Text>

            <Button
              text={t('welcome.button')}
              onClick={() => {
                document.querySelector('body').removeAttribute('class')
                setCount((count += 1))
              }}
              theme="primary"
            />
          </Modal>
        )
      }

      const renderModal = (name: string, portal: string) => {
        return (
          <Modal open={true} portal={portal}>
            <Media
              object={
                <Styled.ModalCountObject>{count}</Styled.ModalCountObject>
              }
              title={t(`${name}.title`)}
              text={
                <>
                  {t(`${name}.text`, { returnObjects: true }).map(
                    (text: string, i: number) => (
                      <Text key={i}>{text}</Text>
                    )
                  )}
                </>
              }
            />
            <Flex justify="flex-end" align="center">
              <Styled.ModalCount>
                {count} / {modalsNames.length - 1}
              </Styled.ModalCount>
              <Button
                text={t(`${name}.buttonBack`)}
                onClick={() => setCount((count -= 1))}
                theme="primary"
                transparent
              />
              <Button
                text={
                  modalsNames.length - 1 === count
                    ? t(`buttonFinish`)
                    : t(`${name}.buttonNext`)
                }
                onClick={() =>
                  modalsNames.length - 1 === count
                    ? Router.push(url)
                    : setCount((count += 1))
                }
                theme="primary"
              />
            </Flex>
          </Modal>
        )
      }

      return (
        <>
          <Grid layout="trade">
            <Styled.TradeModalBox active={modalsNames[count] === 'trade'}>
              {modalsNames[count] === 'trade' &&
                renderModal('trade', `${Styled.TradeModalBox}`)}
              <TradeSellBuy />
            </Styled.TradeModalBox>

            <Styled.OrderBookModalBox
              active={modalsNames[count] === 'orderBook'}
            >
              {modalsNames[count] === 'orderBook' &&
                renderModal('orderBook', `${Styled.OrderBookModalBox}`)}
              <OrderBook query={query} />
            </Styled.OrderBookModalBox>

            <Styled.WrapEthModalBox active={modalsNames[count] === 'wrapEth'}>
              {modalsNames[count] === 'wrapEth' &&
                renderModal('wrapEth', `${Styled.WrapEthModalBox}`)}
              <Balance />
            </Styled.WrapEthModalBox>

            <TradeHeader query={query} />

            <Styled.TradeChartModalBox active={modalsNames[count] === 'chart'}>
              {modalsNames[count] === 'chart' &&
                renderModal('chart', `${Styled.TradeChartModalBox}`)}
              <Chart rtl={lng === 'ar'} query={query} />
            </Styled.TradeChartModalBox>

            <Styled.OrdersModalBox active={modalsNames[count] === 'orders'}>
              {modalsNames[count] === 'orders' &&
                renderModal('orders', `${Styled.OrdersModalBox}`)}
              <Orders query={query} />
            </Styled.OrdersModalBox>

            <Styled.MarketsModalBox active={modalsNames[count] === 'markets'}>
              {modalsNames[count] === 'markets' &&
                renderModal('markets', `${Styled.MarketsModalBox}`)}
              <Markets />
            </Styled.MarketsModalBox>

            <Styled.HistoryModalBox active={modalsNames[count] === 'history'}>
              {modalsNames[count] === 'history' &&
                renderModal('history', `${Styled.HistoryModalBox}`)}
              <History query={query} />
            </Styled.HistoryModalBox>
          </Grid>
          {modalsNames[count] === 'welcome' && <WelcomeModal />}
        </>
      )
    }
  )
)
