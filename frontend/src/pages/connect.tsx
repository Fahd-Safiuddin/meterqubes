import React from 'react'
import Page from '../components/Page'
import { withNamespaces } from '../utils/i18n'
import Connect from '../components/Connect'
import { metamaskChecker } from '../utils/metamaskChecker'
import { MetamaskStoreTypes } from '../stores/metamask/types'

interface ConnectPageProps {
  lng: string
  metamaskStore: MetamaskStoreTypes
}

const ConnectPage = ({ lng }: ConnectPageProps) => (
  <Page rtl={lng === 'ar'} layout="connect" withoutHeader>
    <Connect />
  </Page>
)

ConnectPage.getInitialProps = async () => {
  return {
    namespacesRequired: ['connect', 'common']
  }
}

export default withNamespaces('connect')(metamaskChecker(ConnectPage))
