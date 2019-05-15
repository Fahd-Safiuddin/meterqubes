import Page from '../components/Page'
import { withNamespaces } from '../utils/i18n'
import Grid from '../components/Grid'
import MainInfo from '../components/Admin/MainInfo'
import AddToken from '../components/Admin/AddToken'
import Wallets from '../components/Admin/Wallets'
import Transactions from '../components/Admin/Transactions'
import Profile from '../components/Profile'

const Admin = ({ lng }) => {
  return (
    <Page rtl={lng === 'ar'} layout="admin" withProfile={<Profile />}>
      <Grid layout="admin">
        <MainInfo />
        <AddToken />
        <Wallets />
        <Transactions />
      </Grid>
    </Page>
  )
}

Admin.getInitialProps = async () => {
  return {
    namespacesRequired: ['admin']
  }
}

export default withNamespaces('admin')(Admin)
