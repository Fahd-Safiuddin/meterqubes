import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withNamespaces, I18nTProps } from '../../../utils/i18n'
import Card, { CardTitle } from '../../Card'
import Input from '../../Input'
import Button from '../../Button'
import Flex from '../../Flex'
import { MetamaskStoreTypes } from '../../../stores/metamask/types'
import { BalanceStoreTypes } from '../../../stores/balance/types'
import * as Modal from './Modals'
import * as Styled from './style'
import Loader from '../../Loader'
import { bind } from '../../../utils/bind'

interface BalanceProps
  extends Partial<MetamaskStoreTypes>,
    Partial<BalanceStoreTypes> {
  t?: I18nTProps
  lng?: string
  disabled?: boolean
}

interface BalanceState {
  eth: string
  weth: string
  modal: string
  verefyingConfirm: string
}

@withNamespaces('trade')
@inject(
  ({
    metamaskStore: { metamaskStatus, publicAddress },
    balanceStore: {
      getBalance,
      clearData,
      wrapEth,
      unwrapWeth,
      transactionStatus,
      setTransactionStatus,
      ethBalance,
      wethBalance,
      ethPrice,
      wethPrice,
      ethWrapStatus,
      wethUnwrapStatus
    }
  }) => ({
    metamaskStatus,
    publicAddress,
    getBalance,
    clearData,
    wrapEth,
    unwrapWeth,
    transactionStatus,
    setTransactionStatus,
    ethBalance,
    wethBalance,
    ethPrice,
    wethPrice,
    ethWrapStatus,
    wethUnwrapStatus
  })
)
@observer
export default class Balance extends Component<BalanceProps, BalanceState> {
  state = {
    eth: '',
    weth: '',
    modal: null,
    verefyingConfirm: ''
  }

  public static getDerivedStateFromProps(
    { metamaskStatus, publicAddress, getBalance, clearData, transactionStatus },
    { verefyingConfirm }
  ) {
    if (metamaskStatus === 'logged in') {
      getBalance(publicAddress)
    } else if (metamaskStatus === 'logged out') {
      clearData()
    }

    if (transactionStatus !== verefyingConfirm) {
      return {
        modal: transactionStatus
      }
    }

    return null
  }

  @bind
  private onChange(value: string, name: string) {
    this.setState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  @bind
  private onWrapEth() {
    const { publicAddress, wrapEth, getBalance } = this.props
    const { eth } = this.state
    wrapEth(eth)
    getBalance(publicAddress)
  }

  @bind
  private onUnwrapWeth() {
    const { publicAddress, unwrapWeth, getBalance } = this.props
    const { weth } = this.state
    unwrapWeth(weth)
    getBalance(publicAddress)
  }

  @bind
  private renderModals() {
    const { modal, eth, weth } = this.state
    const { t, setTransactionStatus } = this.props
    return (
      <>
        <Modal.Wrap
          open={modal === 'wrapRequested'}
          eth={eth}
          onClose={() => {
            this.handleToggleModal(null)
          }}
        />
        <Modal.WrapPending
          open={modal === 'wrapPending'}
          eth={eth}
          onClose={() => {
            this.handleToggleModal(null)
            this.setState({ verefyingConfirm: 'wrapPending' })
          }}
        />
        <Modal.WrapSuccess
          open={modal === 'wrapSuccess'}
          eth={eth}
          onClose={() => {
            setTransactionStatus('')
            this.handleToggleModal(null)
            this.setState({ verefyingConfirm: '' })
          }}
        />

        <Modal.Unwrap
          open={modal === 'unwrapRequested'}
          weth={weth}
          onClose={() => {
            this.handleToggleModal(null)
          }}
        />

        <Modal.UnwrapPending
          open={modal === 'unwrapPending'}
          weth={weth}
          onClose={() => {
            this.handleToggleModal(null)
            this.setState({ verefyingConfirm: 'unwrapPending' })
          }}
        />

        <Modal.UnwrapSuccess
          open={modal === 'unwrapSuccess'}
          weth={weth}
          onClose={() => {
            setTransactionStatus('')
            this.handleToggleModal(null)
            this.setState({ verefyingConfirm: '' })
          }}
        />

        <Modal.Error
          open={modal === 'ethBalanceError'}
          title={t('balance.modalBalanceError.title')}
          text={t('balance.modalBalanceError.text', { currency: 'ETH' })}
          onClose={() => {
            setTransactionStatus('')
            this.handleToggleModal(null)
          }}
        />
        <Modal.Error
          open={modal === 'wethBalanceError'}
          title={t('balance.modalBalanceError.title')}
          text={t('balance.modalBalanceError.text', { currency: 'WETH' })}
          onClose={() => {
            setTransactionStatus('')
            this.handleToggleModal(null)
          }}
        />
        <Modal.Error
          open={modal === 'transactionError'}
          onClose={() => {
            setTransactionStatus('')
            this.handleToggleModal(null)
          }}
        />

        <Modal.TransactionCanceled
          open={modal === 'wrapCanceled' || modal === 'unwrapCanceled'}
          onClose={() => {
            setTransactionStatus('')
            this.handleToggleModal(null)
          }}
        />
      </>
    )
  }

  @bind
  private handleToggleModal(modal: string) {
    this.setState({ modal })
  }

  @bind
  private checkBalance(
    value: string,
    balance: string,
    onSuccess: () => void,
    onError: () => void
  ) {
    if (Number(value) > Number(balance)) {
      return onError()
    }
    return onSuccess()
  }

  public render() {
    const {
      t,
      lng,
      ethBalance,
      wethBalance,
      ethPrice,
      wethPrice,
      transactionStatus,
      disabled
    } = this.props

    const { eth, weth } = this.state

    return (
      <Styled.Wrapp>
        <Card justify="space-between" rtl={lng === 'ar'}>
          <Flex justify="space-between">
            <CardTitle>{t('balance.eth.title')}</CardTitle>
            <Styled.Article
              title={ethBalance ? `${ethBalance}` : ''}
              text={`${ethPrice ? `$${ethPrice}` : ''}`}
            />
          </Flex>
          <Input
            type="number"
            onChange={this.onChange}
            name="eth"
            placeholder="0.00"
            disabled={disabled}
            addon={
              <Button
                text={
                  transactionStatus === 'wrapPending' ? (
                    <Loader />
                  ) : (
                    t('balance.eth.button')
                  )
                }
                onClick={() => {
                  this.checkBalance(
                    eth,
                    ethBalance,
                    () => {
                      this.onWrapEth()
                    },
                    () => {
                      this.handleToggleModal('ethBalanceError')
                    }
                  )
                }}
                theme="success"
                disabled={!eth || transactionStatus === 'wrapPending'}
              />
            }
            fluid
            rtl={lng === 'ar'}
          />
          <Flex justify="space-between">
            <CardTitle>{t('balance.weth.title')}</CardTitle>
            <Styled.Article
              title={wethBalance ? `${wethBalance}` : ''}
              text={`${wethPrice ? `$${wethPrice}` : ''}`}
            />
          </Flex>
          <Input
            type="number"
            onChange={this.onChange}
            name="weth"
            placeholder="0.00"
            disabled={disabled}
            addon={
              <Button
                text={
                  transactionStatus === 'unwrapPending' ? (
                    <Loader />
                  ) : (
                    t('balance.weth.button')
                  )
                }
                onClick={() => {
                  this.checkBalance(
                    weth,
                    wethBalance,
                    () => {
                      this.onUnwrapWeth()
                    },
                    () => {
                      this.handleToggleModal('wethBalanceError')
                    }
                  )
                }}
                theme="primary"
                disabled={!weth}
              />
            }
            fluid
            rtl={lng === 'ar'}
          />
        </Card>
        {this.renderModals()}
      </Styled.Wrapp>
    )
  }
}
