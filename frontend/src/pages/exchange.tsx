import Page from '../components/Page'
import { withNamespaces } from '../utils/i18n'
import { metamaskChecker } from '../utils/metamaskChecker'
import Exchange from '../components/Exchange'
import Container from '../components/Container'
import TokensHeader from '../components/TokensHeader'
import { apiCaller } from '../utils/apiCaller'
import { API_URL } from '../config/api'
import { getUserToken } from '../utils/cookieService'

const ExchangePage = ({ lng, publicAddress, markets }) => {
  const token = getUserToken()
  const disabled = publicAddress && token ? false : true

  return (
    <>
      <TokensHeader data={markets} />
      <Page rtl={lng === 'ar'} layout="exchange" withFooter>
        <Container>
          <Exchange
            disabled={disabled}
            t={null}
            tokens={[
              {
                id: 1,
                image: '/static/img/decred.svg',
                label: 'VeChain'
              },
              {
                id: 2,
                image: '/static/img/ethereum.svg',
                label: 'Tether'
              },
              {
                id: 3,
                image: '/static/img/decred.svg',
                label: 'VeChain'
              },
              {
                id: 4,
                image: '/static/img/ethereum.svg',
                label: 'Neo'
              },
              {
                id: 5,
                image: '/static/img/decred.svg',
                label: 'VeChain'
              },
              {
                id: 6,
                image: '/static/img/ethereum.svg',
                label: 'Neo'
              }
            ]}
          />
        </Container>
      </Page>
    </>
  )
}

ExchangePage.getInitialProps = async () => {
  try {
    const markets = await apiCaller(`${API_URL}/dashboard/landing`)
    if (markets) {
      return {
        markets,
        namespacesRequired: ['exchange', 'banner']
      }
    }
  } catch (err) {
    console.error(err)
  }

  return {
    namespacesRequired: ['exchange']
  }
}

export default withNamespaces('exchange')(metamaskChecker(ExchangePage))
