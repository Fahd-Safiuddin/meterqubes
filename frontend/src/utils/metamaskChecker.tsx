import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { MetamaskStoreTypes } from '../stores/metamask/types'
import { NextContext, NextComponentClass } from 'next'

export const metamaskChecker = (Component: NextComponentClass | any) => {
  @inject(
    ({
      metamaskStore: { publicAddress, checkMetamask, metamaskStatus },
      balanceStore
    }) => ({
      publicAddress,
      checkMetamask,
      metamaskStatus,
      balanceStore
    })
  )
  @observer
  class MetamaskCheckerHOC extends React.Component<{
    checkMetamask: MetamaskStoreTypes['checkMetamask']
    metamaskStatus: MetamaskStoreTypes['metamaskStatus']
  }> {
    public static getInitialProps(ctx: NextContext) {
      if (Component.getInitialProps) return Component.getInitialProps(ctx)
    }

    public componentDidMount() {
      this.props.checkMetamask()
    }

    public render() {
      return <Component {...this.props} />
    }
  }

  return MetamaskCheckerHOC
}
