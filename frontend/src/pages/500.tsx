import Router from 'next/router'
import { withNamespaces } from '../utils/i18n'
import Page from '../components/Page'
import Heading from '../components/Heading'
import Button from '../components/Button'

const ServerErrorPage = ({ t, statusCode }) => {
  console.log('status code', statusCode)
  return (
    <Page layout="500">
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
}

ServerErrorPage.getInitialProps = async () => {
  return {
    namespacesRequired: ['500']
  }
}
export default withNamespaces('500')(ServerErrorPage)
