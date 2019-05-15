import { ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from '../utils/i18n'
import { colors } from '../styles/colors'

// Link component types
export type LinkTypes = {
  href: string
  as?: string
  active?: boolean
  prefetch?: boolean
  children: ReactNode
}

/**
 * Render Link component
 * @param {String} href
 * @param {ReactChild} children
 * @return {Component} React.ReactNode
 */

export default styled(({ href, prefetch, children, ...rest }: LinkTypes) => {
  return (
    <Link href={href} as={href} prefetch={prefetch}>
      <a {...rest}>{children}</a>
    </Link>
  )
})`
  a {
    color: ${colors.primary};

    &:hover {
      color: ${colors.primary};
    }
  }
`
