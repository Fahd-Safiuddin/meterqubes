import { useState } from 'react'
import { withRouter } from 'next/router'
import * as Styled from './style'
import Link from '../Link'
import Button from '../Button'
import { withNamespaces } from '../../utils/i18n'
import { NavProps, NavItemProps } from './types'
import { ROUTES } from '../../config/routes'

function Nav({
  t,
  collapse,
  children,
  open = false,
  router: { pathname, asPath, query }
}: {} & NavProps) {
  const [navOpen, handleOpenMenu] = useState(open)
  const navigation: NavItemProps[] = [
    {
      link: ROUTES.exchange
    },
    {
      link: query.market
        ? `${ROUTES.trade}?market=${query.market}`
        : ROUTES.trade
    },
    {
      link: query.market ? `${ROUTES.tour}?market=${query.market}` : ROUTES.tour
    },
    {
      link: ROUTES.faq
    }
  ]
    .map((item, i) => ({
      ...item,
      label: t('nav', { returnObjects: true })[i]
    }))
    .filter(item => {
      if (item.link !== ROUTES.tour && pathname === ROUTES.root) {
        return item
      } else if (pathname !== ROUTES.root) {
        return item
      }
    })
    .filter(item => {
      if (item.link !== ROUTES.tour && pathname === ROUTES.exchange) {
        return item
      } else if (pathname !== ROUTES.exchange) {
        return item
      }
    })

  return (
    <Styled.Nav>
      <Button
        className="nav-toggler"
        icon={open ? 'close' : 'menu'}
        onClick={() => handleOpenMenu(!navOpen)}
      />
      <Styled.NavList navOpen={navOpen} collapse={collapse}>
        {navigation.map(({ link, label }, i: number) => (
          <Styled.NavListItem key={i} active={link === asPath}>
            <Link href={link} prefetch>
              {label}
            </Link>
          </Styled.NavListItem>
        ))}
        {children}
      </Styled.NavList>
    </Styled.Nav>
  )
}
export default withNamespaces('common')(withRouter(Nav))
