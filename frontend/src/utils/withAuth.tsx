import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { NextContext, NextComponentClass } from 'next'
import { AuthStoreTypes } from '../stores/auth/types'
import { MetamaskStoreTypes } from '../stores/metamask/types'
import { removeUserToken } from './cookieService'

export const withAuth = (Component: NextComponentClass | any) => {
  @inject(
    ({
      metamaskStore: { publicAddress, metamaskStatus },
      authStore: { authUser, authRequested }
    }) => ({
      publicAddress,
      metamaskStatus,
      authUser,
      authRequested
    })
  )
  @observer
  class AuthUserHOC extends React.Component<{
    publicAddress: MetamaskStoreTypes['publicAddress']
    metamaskStatus: MetamaskStoreTypes['metamaskStatus']
    authUser: AuthStoreTypes['authUser']
    authRequested: AuthStoreTypes['authRequested']
  }> {
    public static getInitialProps(ctx: NextContext) {
      if (Component.getInitialProps) return Component.getInitialProps(ctx)
    }

    public componentWillReact() {
      const {
        publicAddress,
        metamaskStatus,
        authUser,
        authRequested
      } = this.props

      if (publicAddress && metamaskStatus === 'logged in' && !authRequested) {
        authUser(publicAddress)
      }

      if (metamaskStatus === 'account changed') {
        removeUserToken()
        authUser(publicAddress)
      }
    }

    public render() {
      return <Component {...this.props} />
    }
  }

  return AuthUserHOC
}
