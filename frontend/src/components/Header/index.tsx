import { memo } from 'react'
import * as Styled from './style'
import Nav from '../Nav'
import Container from '../Container'
import Button from '../Button'
import Logo from '../Logo'
import { i18n, withNamespaces } from '../../utils/i18n'
import ThemeSwitcher from './ThemeSwitcher'
import Wallet from './Wallet'
import { HeaderProps } from './types'

function Header({ withThemeSwitcher, withWallet, withProfile }: HeaderProps) {
  return (
    <Styled.Header>
      <Container nav row>
        <Logo src="/static/img/logo.svg" />
        {withProfile || (
          <Nav collapse>
            <Button
              text={`${i18n.language === 'en' ? 'Arabic' : 'English'}`}
              onClick={() =>
                i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
              }
              size="sm"
              theme="default"
            />
            {withThemeSwitcher && <ThemeSwitcher />}
            {withWallet && <Wallet />}
          </Nav>
        )}
      </Container>
    </Styled.Header>
  )
}

export default withNamespaces('common')(memo(Header))
