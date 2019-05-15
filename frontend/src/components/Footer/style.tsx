import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import Container from '../Container'
import Heading from '../Heading'
import { Nav, NavListItem } from '../Nav/style'
import { FooterProps } from '.'

export const Copyright = styled('p')`
  font-size: 0.75rem;
  opacity: 0.5;
  text-align: center;
  margin: 2rem auto 1rem;
`

export const Footer = styled('footer') <FooterProps>`
  min-height: 80px;
  padding: 1rem 0;
  background: ${colors.bg};
  display: block;
  color: ${colors.white};
  position: relative;

  ${Container} {
    margin-top: 3rem;
    padding: 2rem 1rem;
    border-top: 1px solid ${colors.lightGrey}50;
  }

  ${Heading.One} {
    margin-top: 2rem;
    margin-bottom: 6rem;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    background: url('/static/img/footer_bg_grid.svg') center bottom / cover
      no-repeat;
    min-height: 320px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    opacity: 0.75;
    pointer-events: none;
    overflow: hidden;
  }

  ${({ layout }) => {
    if (layout === 'mainPage') {
      return css`
        &::after {
          content: '';
          display: block;
          position: absolute;
          background: url('/static/img/footer_bg.png') center top / cover
            no-repeat;
          min-height: 550px;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          pointer-events: none;
        }
      `
    }
  }}

  ${NavListItem} {
    &::before {
      display: none;
    }
  }

  > * {
    z-index: 2;
    position: relative;
  }

  @media only screen and (max-width: 767px) {
    ${Nav} {
      display: none;
    }
  }
`
