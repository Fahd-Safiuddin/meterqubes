import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { transition } from '../../styles/base'
import { ButtonProps } from './types'
import Loader from '../Loader'

export const Button = styled('button')<ButtonProps>`
  padding: 0.5rem 1rem;
  border-color: transparent;
  border-radius: 4px;
  font-weight: 600;
  background: transparent;
  color: ${colors.text};
  ${transition.button};

  ${({ size }) => {
    if (size === 'xlg') {
      return css`
        padding: 1rem 1.5rem;

        @media (min-width: 768px) {
          padding: 1.5rem 2rem;
          font-size: 1em;
        }

        ${Loader} {
          width: 1.75rem;
          height: 1.75rem;
        }
      `
    }
    if (size === 'lg') {
      return css`
        padding: 0.75rem 1.25rem;

        @media (min-width: 768px) {
          padding: 0.875rem 1.75rem;
        }

        ${Loader} {
          width: 1.75rem;
          height: 1.75rem;
        }
      `
    }
    if (size === 'md') {
      return css`
        padding: 0.5rem 1.5rem;

        @media (min-width: 768px) {
          padding: 0.75rem 1.75rem;
          font-size: 1.125em;
        }
      `
    }
    if (size === 'sm') {
      return css`
        font-weight: 500;
        height: 34px;
        font-size: 0.875rem;
        padding: 0.25rem 0.5rem;
      `
    }

    if (size === 'xsm') {
      return css`
        font-weight: 500;
        height: 20px;
        font-size: 0.75rem;
        padding: 0;

        > * {
          font-size: 1.75em;
        }

        i {
          position: relative;
          top: -3px;
        }
      `
    }
  }}

  ${({ theme, outlined, transparent }) => {
    if (theme === 'default') {
      return css`
        background: ${colors.white}20;
        color: ${colors.white} !important;
      `
    } else if (theme === 'star') {
      return css`
        background: transparent;
        color: ${colors.text};
      `
    } else if (theme === 'star-active') {
      return css`
        background: transparent;
        color: ${colors.warning};
      `
    } else if (theme === 'chart') {
      return css`
        background: #2e345c;
        border-radius: 2px;
      `
    } else if (theme === 'chart-day') {
      return css`
        background: ${colors.lightGrey};
        border-radius: 2px;
      `
    } else if (transparent) {
      return css`
        background: transparent;
        color: ${colors.primary};
      `
    } else if (typeof theme === 'string') {
      return css`
        background: ${outlined ? 'transparent' : colors[theme]};
        color: ${colors.white} !important;
        border-color: ${outlined ? colors[theme] : 'transparent'};
      `
    }
  }}

  ${({ fluid }) =>
    fluid &&
    css`
      width: 100%;
    `}

  &:hover {
    ${({ theme, outlined, transparent }) => {
      if (theme === 'default') {
        return css`
          color: ${colors.white};
        `
      } else if (transparent) {
        return css`
          background: ${colors.white}10;
          color: ${colors.white};
        `
      } else if (theme) {
        return css`
          border-color: ${outlined ? colors.hover[theme] : 'transparent'};
          background: ${colors.hover[theme]};
          color: ${colors.white};
        `
      } else {
        return css`
          background: ${colors.white}50;
        `
      }
    }}
  }

  ${({ disabled, theme }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.75;

      &:hover {
        background: ${colors[theme]};
      }
    `}

  > * {
    display: inline-block;
    vertical-align:middle;
  }

  &:focus {
    outline: none;
  }
`

export const ButtonRound = styled(Button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  ${({ size }) => {
    if (size) {
      return null
    }
  }}
`
