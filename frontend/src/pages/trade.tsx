import { withNamespaces } from '../utils/i18n'
import Page from '../components/Page'
import Grid from '../components/Grid'
import TradeHeader from '../components/Trade/TradeHeader'
import TradeSellBuy from '../components/Trade/TradeSellBuy'
import OrderBook from '../components/Trade/OrderBook'
import Balance from '../components/Trade/Balance'
import History from '../components/Trade/History'
import Markets from '../components/Trade/Markets'
import Orders from '../components/Trade/Orders'
import { metamaskChecker } from '../utils/metamaskChecker'
import { withAuth } from '../utils/withAuth'
import { useWindowWidth } from '../utils/useWindowWidth'
import Tabs from '../components/Tabs'
import Chart from '../components/Trade/Chart'
import { getUserToken } from '../utils/cookieService'
import { withSocket } from '../utils/withSocket'
import { redirect } from '../utils/redirect'

const Trade = ({ t, lng, publicAddress, pathname, query }) => {
  const token = getUserToken()
  const disabled = publicAddress && token ? false : true
  const width = useWindowWidth()
  const tabs = t('mobileTabs', { returnObjects: true })

  return (
    <Page
      rtl={lng === 'ar'}
      disabled={disabled}
      pathname={pathname}
      withWallet
      withThemeSwitcher
      layout="trade"
    >
      {width && width <= 993 ? (
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
              name: 'trade',
              content: (
                <>
                  <Chart rtl={lng === 'ar'} query={query} />
                </>
              )
            },
            {
              name: 'markets',
              content: (
                <>
                  <Markets query={query} />
                </>
              )
            },
            {
              name: 'orders',
              content: (
                <>
                  <OrderBook query={query} />
                  <History query={query} />
                  <Orders disabled={disabled} query={query} />
                </>
              )
            }
          ]}
          layout="trade"
        />
      ) : (
        <Grid layout="trade">
          <TradeSellBuy />
          <OrderBook query={query} />
          <Balance disabled={disabled} />
          <TradeHeader query={query} />
          <Chart rtl={lng === 'ar'} query={query} />
          <Orders disabled={disabled} query={query} />
          <Markets query={query} />
          <History query={query} />
        </Grid>
      )}
    </Page>
  )
}

Trade.getInitialProps = async ({ query, req }) => {
  if (query && !query.market) {
    redirect(req, '/trade?market=1')
  }
  return {
    namespacesRequired: ['trade', 'common', 'modals']
  }
}

export default withNamespaces('trade')(
  metamaskChecker(withAuth(withSocket(Trade)))
)
