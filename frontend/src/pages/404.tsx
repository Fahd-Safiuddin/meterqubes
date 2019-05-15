import Router from 'next/router'
import { withNamespaces } from '../utils/i18n'
import Page from '../components/Page'
import Heading from '../components/Heading'
import Button from '../components/Button'

const NotFound = ({ t }) => (
  <Page layout="404">
    <div style={{ padding: '100px 0' }}>
      <Heading.One align="center">{t('h1')}</Heading.One>
      <br />
      <br />
      <Button
        text="Go to home"
        theme="primary"
        onClick={() => Router.push('/')}
      />
    </div>
  </Page>
)

NotFound.getInitialProps = async () => {
  return {
    namespacesRequired: ['404']
  }
}
export default withNamespaces('404')(NotFound)
