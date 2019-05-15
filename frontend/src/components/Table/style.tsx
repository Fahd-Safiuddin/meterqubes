import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { TableRowProps } from './types'

export const Row = styled('div')`
  display: flex;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.white}a6;
  padding: 0.125rem 0;

  ${({ align }: TableRowProps) =>
    align &&
    css`
      align-items: center;
    `};

  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        cursor: pointer;
        color: ${colors.primary} !important;
      }
    `}

  ${({ active }) => {
    if (active) {
      return css`
        position: relative;

        &::before {
          content: '';
          background: ${colors.primary}20;
          position: absolute;
          left: -1rem;
          top: -1px;
          right: -1rem;
          bottom: 0;
          pointer-events: none;
          border-left: 2px solid ${colors.primary};
        }
      `
    }
  }};

  ${({ layout }) => {
    if (layout === 'admin') {
      return css`
        @media (min-width: 1440px) {
          font-size: 14px;
          margin-bottom: 0.25rem;
        }
      `
    }
  }};

  ${({ headFilled }) =>
    headFilled &&
    css`
      background: ${colors.text}20;
      border: 0 !important;
      color: ${colors.white};
      border-radius: 3px;
      padding: 0.375rem 0;
      transform: translateY(2px);

      > *:first-child {
        padding-left: 0.5rem;
      }
    `};
`

export const Col = styled('div')`
  width: ${({ width }: { width?: string }) => width || 'auto'};
  color: ${({ color }: { color?: string }) => color || 'inherit'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:not(:last-child) {
    padding-right: 0.25rem;
  }
`

export const Head = styled('div')`
  ${Row} {
    border-bottom: 1px solid ${colors.placeholder};
    padding-bottom: 0.25rem;
    margin-bottom: 0.5rem;
    color: ${colors.text};
  }
`

export const Body = styled('div')`
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  ${Row} {
    position: relative;
  }
`

export const Table = styled('div')`
  color: ${colors.text};
  height: 100%;
  display: flex;
  flex-direction: column;

  ${({ theme }) =>
    theme &&
    css`
      ${Row} {
        &::before {
          background: ${theme === 'day'
            ? `${colors.dark}10`
            : `${colors.white}10`};
        }
      }
    `}
`
