import { withNamespaces } from '../utils/i18n'
import Page from '../components/Page'
import Tour from '../components/Tour'
import { redirect } from '../utils/redirect'

const TourPage = ({ lng, pathname, query }) => {
  return (
    <Page
      rtl={lng === 'ar'}
      disabled
      pathname={pathname}
      withThemeSwitcher
      withWallet
      layout="tour"
    >
      <Tour query={query} />
    </Page>
  )
}

TourPage.getInitialProps = async ({ query, req }) => {
  if (query && !query.market) {
    redirect(req, '/tour?market=1')
  }
  return {
    namespacesRequired: ['tour', 'trade']
  }
}

export default withNamespaces('tour')(TourPage)
