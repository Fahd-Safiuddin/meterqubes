import { ReactNode } from 'react'
import { SingletonRouter } from 'next/router'
import { I18nTProps } from '../../utils/i18n'

export type NavItemProps = {
  link: string
  label: string
  active?: boolean
}

export type NavProps = {
  navOpen?: boolean
  open?: boolean
  collapse?: boolean
  children?: ReactNode
  router?: SingletonRouter
  t?: I18nTProps
}
