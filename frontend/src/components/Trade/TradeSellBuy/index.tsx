import { Component } from 'react'
import Card from '../../Card'
import Input from '../../Input'
import Flex from '../../Flex'
import { colors } from '../../../styles/colors'
import Button from '../../Button'
import Tabs from '../../Tabs'
import { withNamespaces, I18nTProps } from '../../../utils/i18n'
import { inject, observer } from 'mobx-react'
import Modal, { ModalStyled } from '../../Modal'
import * as Styled from './style'
import Text from '../../Text'
import { MarketsStoreTypes } from '../../../stores/markets/types'
import { OrdersStoreTypes } from '../../../stores/order/types'
import { bind } from '../../../utils/bind'
import { BalanceStoreTypes } from '../../../stores/balance/types'

interface TradeOrdersProps {
  t?: I18nTProps
  lng?: string
  wethBalance?: BalanceStoreTypes['wethBalance']
  marketsStore?: MarketsStoreTypes
  createOrder?: OrdersStoreTypes['createOrder']
  getOrders?: OrdersStoreTypes['getOrders']
  orderStatus?: OrdersStoreTypes['orderStatus']
  setOrderStatus?: OrdersStoreTypes['setOrderStatus']
  error?: OrdersStoreTypes['error']
}

interface TradeOrdersState {
  modal: string
  price: string
  amount: string
}

@withNamespaces(['trade'])
@inject(
  ({
    marketsStore,
    balanceStore: { wethBalance },
    ordersStore: { orderStatus, setOrderStatus, createOrder, getOrders, error }
  }) => ({
    wethBalance,
    marketsStore,
    orderStatus,
    setOrderStatus,
    createOrder,
    getOrders,
    error
  })
)
@observer
export default class TradeOrder extends Component<
  TradeOrdersProps,
  TradeOrdersState
> {
  state = {
    modal: null,
    price: '',
    amount: ''
  }

  public static getDerivedStateFromProps({
    orderStatus,
    getOrders,
    marketsStore: { selectedMarket }
  }) {
    if (orderStatus === 'success') {
      getOrders(selectedMarket.id)
      return {
        price: '',
        amount: '',
        modal: orderStatus
      }
    }
    if (orderStatus) {
      return {
        modal: orderStatus
      }
    }
    return null
  }

  @bind
  private handleToggleModal(modal: string) {
    this.setState({ modal })
  }

  @bind
  private handleChange(value: string, name: string) {
    this.setState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  @bind
  private async onCreateOrder(
    price: string,
    amount: string,
    selectedMarket: MarketsStoreTypes['selectedMarket'],
    isSell: boolean
  ) {
    const { createOrder } = this.props
    if ((!price && !amount) || Number(price) <= 0 || Number(amount) <= 0) {
      this.handleToggleModal('valueError')
    } else {
      this.handleToggleModal('sell')
      createOrder(
        price,
        amount,
        selectedMarket.tokens,
        selectedMarket.baseTokenAddress,
        selectedMarket.quoteTokenAddress,
        isSell
      )
    }
  }

  @bind
  private renderForm(isSell: boolean, button: boolean = true) {
    const {
      t,
      lng,
      wethBalance,
      marketsStore: { selectedMarket }
    } = this.props

    const { price, amount } = this.state
    return (
      <>
        <Input
          label={t('trade.order.limit.label')}
          onChange={(value: string, name: string) =>
            this.handleChange(value, name)
          }
          name="price"
          value={price}
          placeholder="0.00"
          addon={selectedMarket && selectedMarket.baseToken}
          type="number"
          fluid
          disabled={!Number(wethBalance)}
          rtl={lng === 'ar'}
        />
        <Input
          label={t('trade.order.amount.label')}
          onChange={(value: string, name: string) =>
            this.handleChange(value, name)
          }
          name="amount"
          value={amount}
          placeholder="0.00"
          addon={selectedMarket && selectedMarket.quoteToken}
          type="number"
          fluid
          disabled={!Number(wethBalance)}
          rtl={lng === 'ar'}
        />
        <Flex
          justify="space-between"
          style={{
            color: `${colors.text}`,
            fontSize: '0.875em',
            marginTop: '1.25rem',
            marginBottom: '1.25rem',
            fontWeight: 500
          }}
        >
          <span>{t('trade.order.total')}</span>
          <span>
            ≈{Number(price) * Number(amount)} {t('trade.order.weth')}
          </span>
        </Flex>
        {button && (
          <Button
            text={t(`trade.order.${isSell ? 'buttonSell' : 'buttonBuy'}`, {
              quoteToken: selectedMarket && selectedMarket.quoteToken
            })}
            onClick={() => {
              this.onCreateOrder(price, amount, selectedMarket, isSell)
            }}
            theme="primary"
            fluid
            disabled={!Number(wethBalance)}
          />
        )}
      </>
    )
  }

  @bind
  private renderModals() {
    const {
      t,
      setOrderStatus,
      marketsStore: { selectedMarket },
      error
    } = this.props
    const { modal, price, amount } = this.state

    return (
      <>
        <Modal
          open={modal === 'pending'}
          title={t('trade.modal.title')}
          onClose={() => {
            setOrderStatus(null)
            this.handleToggleModal(null)
          }}
        >
          <Styled.Wrapp>{this.renderForm(false, false)}</Styled.Wrapp>
          <ModalStyled.Info>{t('trade.modal.info')}</ModalStyled.Info>
        </Modal>

        <Modal
          open={modal === 'valueError'}
          title={t('trade.modalValueError.title')}
          closeButton={t('trade.modalValueError.button')}
          onClose={() => {
            setOrderStatus(null)
            this.handleToggleModal(null)
          }}
        >
          <Text>{t('trade.modalValueError.text')}</Text>
        </Modal>

        <Modal
          open={modal === 'submitError'}
          title={t('trade.modalSubmitError.title')}
          closeButton={t('trade.modalSubmitError.button')}
          onClose={() => {
            setOrderStatus(null)
            this.handleToggleModal(null)
          }}
        >
          <Text>{t('trade.modalSubmitError.text', { error })}</Text>
        </Modal>

        <Modal
          open={modal === 'canceled'}
          title={t('trade.modalCanceled.title')}
          closeButton={t('trade.modalCanceled.button')}
          onClose={() => {
            setOrderStatus(null)
            this.handleToggleModal(null)
          }}
        />

        <Modal
          open={modal === 'success'}
          title={
            <>
              <i
                className="material-icons"
                style={{
                  fontSize: '2.5rem',
                  color: colors.success,
                  verticalAlign: 'text-top',
                  marginRight: '0.5rem'
                }}
              >
                check
              </i>
              {t('trade.modalSuccess.title')}
            </>
          }
          closeButton={t('trade.modalSuccess.button')}
          onClose={() => {
            setOrderStatus(null)
            this.handleToggleModal(null)
          }}
        >
          {t('trade.modalSuccess.text', {
            returnObjects: true,
            priceValue: price,
            amountValue: amount,
            priceMarket: selectedMarket && selectedMarket.baseToken,
            amountMarket: selectedMarket && selectedMarket.quoteToken
          }).map((text: string, i: number) => (
            <Text key={i}>{text}</Text>
          ))}
        </Modal>
      </>
    )
  }

  public render() {
    const { t, lng } = this.props
    const tabs = t('trade.tabs', { returnObjects: true })
    return (
      <Card title={t('trade.title')} justify="space-between" rtl={lng === 'ar'}>
        <Tabs
          tabLink={
            Array.isArray(tabs) &&
            tabs.map((label: string) => ({
              name: label.toLowerCase().replace(' ', '_'),
              label
            }))
          }
          tabContent={[
            {
              name: 'sell',
              content: this.renderForm(true)
            },
            {
              name: 'buy',
              content: this.renderForm(false)
            }
          ]}
        />
        {this.renderModals()}
      </Card>
    )
  }
}
