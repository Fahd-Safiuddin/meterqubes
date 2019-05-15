import { memo } from 'react'
import * as Styled from './style'
import Nav from '../Nav'
import Logo from '../Logo'
import Container from '../Container'
import Heading from '../Heading'

export type FooterProps = {
  layout?: string
  title?: string
  copyright?: string
}

/**
 * Render Footer component with React.memo()
 * @param {String} layout (optional)
 * @param {String} title (optional)
 * @param {String} copyright (optional)
 * @return {Component} React.ReactNode
 */

const Footer = memo(({ layout, title, copyright }: FooterProps) => (
  <Styled.Footer layout={layout}>
    {layout === 'mainPage' && <Heading.One align="center">{title}</Heading.One>}

    <Container nav row>
      <Logo src="/static/img/logo.svg" />
      <Nav />
    </Container>
    <Styled.Copyright>{copyright}</Styled.Copyright>
  </Styled.Footer>
))

export default Footer
