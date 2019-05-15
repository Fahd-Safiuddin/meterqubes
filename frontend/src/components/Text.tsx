import styled, { css } from 'styled-components'
import { colors } from '../styles/colors'

type TextProps = {
  size?: string
  color?: string
  weight?: string
  inline?: boolean
}

const Text = styled('p')<TextProps>`
  font-size: ${({ size }) => {
    if (size === 'sm') return '0.875rem'
    else if (size === 'xs') return '0.75rem'
  }};
  color: ${({ color }) => colors[color] || 'inherit'};
  font-weight: ${({ weight }) => {
    if (weight === 'medium') return '500'
    else if (weight === 'semibold') return '600'
    else if (weight === 'bold') return '700'
  }};

  ${({ inline }) =>
    inline &&
    css`
      display: inline-block;
      margin-bottom: 0;
    `}
`

export default Text
