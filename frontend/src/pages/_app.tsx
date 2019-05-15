import App, { Container, NextAppContext } from 'next/app'
import Router from 'next/router'
import Head from 'next/head'
import { Provider } from 'mobx-react'
import NProgress from 'nprogress'
import DevTools from 'mobx-react-devtools'
import { appWithTranslation } from '../utils/i18n'
import { isServer } from '../utils/isServer'
import { initMetamaskStore } from '../stores/metamask'
import { MetamaskStoreTypes } from '../stores/metamask/types'
import { initThemeStore } from '../stores/theme'
import { ThemeStoreTypes } from '../stores/theme/types'
import { initMarketsStore } from '../stores/markets'
import { MarketsStoreTypes } from '../stores/markets/types'
import { initChartStore } from '../stores/chart'
import { ChartStoreTypes } from '../stores/chart/types'
import { initOrdersStore } from '../stores/order'
import { OrdersStoreTypes } from '../stores/order/types'
import { initAuthStore } from '../stores/auth'
import { AuthStoreTypes } from '../stores/auth/types'
import { initBalanceStore } from '../stores/balance'
import { BalanceStoreTypes } from '../stores/balance/types'
import { cookieParse } from '../utils/cookieParse'
import { TradeHistoryStoreTypes } from '../stores/tradeHistory/types'
import { initTradeHistoryStore } from '../stores/tradeHistory'

Router.onRouteChangeStart = () => {
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

NProgress.configure({ speed: 300, minimum: 0.3 })

interface MobxStoresTypes {
  metamaskStore: MetamaskStoreTypes | object
  themeStore: ThemeStoreTypes | object
  marketsStore: MarketsStoreTypes | object
  chartStore: ChartStoreTypes | object
  ordersStore: OrdersStoreTypes | object
  authStore: AuthStoreTypes | object
  balanceStore: BalanceStoreTypes | object
  tradeHistoryStore: TradeHistoryStoreTypes | object
}

@appWithTranslation
export default class MainPage extends App {
  public stores: MobxStoresTypes
  public static async getInitialProps(
    appContext: NextAppContext & {
      ctx: { mobxStores: MobxStoresTypes }
    }
  ) {
    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState

    const cookie: any =
      isServer && appContext.ctx
        ? cookieParse(appContext.ctx.req.headers.cookie)
        : cookieParse(document.cookie)

    const stores = {
      metamaskStore: initMetamaskStore(),
      themeStore: initThemeStore({
        theme: (cookie && cookie.theme) || 'night'
      }),
      marketsStore: initMarketsStore(isServer),
      chartStore: initChartStore(isServer),
      ordersStore: initOrdersStore(isServer),
      authStore: initAuthStore(),
      balanceStore: initBalanceStore(isServer),
      tradeHistoryStore: initTradeHistoryStore(isServer)
    }

    appContext.ctx.mobxStores = stores

    const appProps = await App.getInitialProps(appContext)

    return {
      ...appProps,
      ...stores
    }
  }

  public constructor(props) {
    super(props)
    this.stores = {
      metamaskStore: initMetamaskStore(),
      themeStore: isServer
        ? props.themeStore
        : initThemeStore(props.themeStore),
      marketsStore: isServer
        ? props.marketsStore
        : initMarketsStore(props.marketsStore),
      chartStore: isServer
        ? props.chartStore
        : initChartStore(props.chartStore),
      ordersStore: isServer
        ? props.ordersStore
        : initOrdersStore(props.ordersStore),
      authStore: isServer ? props.authStore : initAuthStore(),
      balanceStore: isServer
        ? props.balanceStore
        : initBalanceStore(props.balanceStore),
      tradeHistoryStore: isServer
        ? props.tradeHistoryStore
        : initTradeHistoryStore(props.tradeHistoryStore)
    }
  }

  render() {
    const { Component, pageProps } = this.props
    pageProps.pathname = this.props.router.pathname
    pageProps.asPath = this.props.router.asPath
    pageProps.query = this.props.router.query
    return (
      <Container>
        <Head>
          <title>MeterQubes</title>
        </Head>
        <Provider {...this.stores}>
          <Component {...pageProps} />
        </Provider>
        {process.env.NODE_ENV !== 'production' && <DevTools />}
      </Container>
    )
  }
}
