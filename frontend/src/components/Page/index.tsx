import Header from '../Header'
import * as Styled from './style'
import Logo from '../Logo'
import { withNamespaces } from '../../utils/i18n'
import Footer from '../Footer'
import { inject, observer } from 'mobx-react'
import { ReactElement } from 'react'
import { PageProps } from './types'

function Page({
  children,
  withoutHeader,
  withThemeSwitcher,
  withWallet,
  withFooter,
  withProfile,
  t,
  themeStore: { theme },
  ...rest
}): ReactElement<PageProps> {
  return (
    <Styled.Page withoutHeader={withoutHeader} theme={theme} {...rest}>
      {withoutHeader ? (
        <Logo src="/static/img/logo.svg" />
      ) : (
        <Header
          withThemeSwitcher={withThemeSwitcher}
          withWallet={withWallet}
          withProfile={withProfile}
          layout={rest.layout}
        />
      )}
      <Styled.Layout>{children}</Styled.Layout>
      {withFooter && (
        <Footer
          title={t('footer.title')}
          copyright={t('footer.copyright')}
          layout={rest.layout}
        />
      )}
    </Styled.Page>
  )
}

export default withNamespaces('common')(inject('themeStore')(observer(Page)))
