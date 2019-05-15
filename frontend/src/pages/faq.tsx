import Page from '../components/Page'
import { withNamespaces } from '../utils/i18n'

const FAQ = ({ lng }) => {
  return <Page rtl={lng === 'ar'}>FAQ Page</Page>
}

FAQ.getInitialProps = async () => {
  return {
    namespacesRequired: ['faq']
  }
}

export default withNamespaces('faq')(FAQ)
