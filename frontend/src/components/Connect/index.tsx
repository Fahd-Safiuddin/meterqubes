import Router from 'next/router'
import { inject, observer } from 'mobx-react'
import Heading from '../Heading'
import * as Styled from './style'
import { withNamespaces, I18nTProps } from '../../utils/i18n'
import Button from '../Button'
import Loader from '../Loader'
import { MetamaskStoreTypes } from '../../stores/metamask/types'
import { BalanceStoreTypes } from '../../stores/balance/types'
import { colors } from '../../styles/colors'
import { ROUTES } from '../../config/routes'

export type ConnectStyleProps = {
  disabled: boolean
}

interface ConnectProps extends MetamaskStoreTypes, BalanceStoreTypes {
  t: I18nTProps
}

/**
 * Render styled Connect component
 * @param {Boolean} loading
 * @param {String} publicAddress
 * @param {String} ethBalance
 * @param {String} error
 * @returns {ReactNode}
 */

function Connect({
  t,
  loading,
  publicAddress,
  getBalance,
  ethBalance,
  error
}: ConnectProps) {
  getBalance(publicAddress)

  return (
    <Styled.Connect disabled={!publicAddress}>
      <Heading.One>{t('title')}</Heading.One>
      <img src="/static/img/metamask-logo.svg" alt="" />
      {loading ? (
        <div>
          <p>Connecting to metamask...</p>
        </div>
      ) : publicAddress ? (
        <p>{publicAddress}</p>
      ) : (
        <p>{t('info')}</p>
      )}
      {publicAddress && ethBalance && (
        <Styled.Balance text="ETH Balance" balance={ethBalance} />
      )}
      <Button
        text={loading ? <Loader /> : t('button')}
        size="md"
        theme="primary"
        onClick={() => Router.push(ROUTES.trade)}
        disabled={!publicAddress}
      />
      {error && <span style={{ color: colors.primary }}>{error}</span>}
    </Styled.Connect>
  )
}

export default withNamespaces('connect')(
  inject(
    ({
      metamaskStore: { publicAddress, loading },
      balanceStore: { getBalance, ethBalance, error }
    }) => ({ publicAddress, getBalance, ethBalance, loading, error })
  )(observer(Connect))
)
