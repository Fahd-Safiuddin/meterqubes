import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { CardProps } from './types'
import { TabLinkRow } from '../Tabs/style'
import { flex } from '../../styles/base'

export const Title = styled('h3')`
  font-size: 1.125em;
  font-weight: 600;
`

export const Header = styled('div')`
  ${flex.between_center};
  margin-bottom: 0.5rem;

  ${Title} {
    margin-bottom: 0;
  }
`

export const Body = styled('div')<CardProps>`
  height: ${({ header }) => (header ? 'calc(100% - 20px)' : '100%')};
  display: flex;
  flex-direction: column;

  ${({ justify }) =>
    justify &&
    css`
      justify-content: ${justify};
    `}
`

export const Card = styled('div')<CardProps>`
  padding: 1rem;
  background: ${colors.dark};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0;
  overflow: hidden;

  ${TabLinkRow} {
    position: absolute;
    top: 0;

    ${({ rtl }) =>
      rtl
        ? css`
            left: 1rem;
          `
        : css`
            right: 1rem;
          `};
  }
`
