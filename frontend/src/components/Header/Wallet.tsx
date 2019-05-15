import { inject, observer } from 'mobx-react'
import * as Styled from './style'
import Link from '../Link'
import Checkbox from '../Checkbox'
import Flex from '../Flex'

export default inject(({ metamaskStore: { publicAddress } }) => ({
  publicAddress
}))(
  observer(({ publicAddress }) => {
    return (
      <Styled.Wallet>
        <Styled.WalletTitle>Digital wallet</Styled.WalletTitle>
        <Link href="/connect">
          <Flex>
            <Styled.WalletType>Metamask</Styled.WalletType>
            <Checkbox checked={!!publicAddress} />
          </Flex>
        </Link>
      </Styled.Wallet>
    )
  })
)
