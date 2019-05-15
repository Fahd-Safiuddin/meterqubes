import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { Card } from '../Card/style'

export const TabLinkRow = styled('div')`
  display: flex;
`
export const TabLink = styled('a')`
  font-size: 0.75em;
  color: ${colors.text};
  cursor: pointer;
  padding: 0.5rem 0.25rem;
  font-weight: 500;

  &:not(:last-child) {
    margin-right: 1rem;
  }

  &:hover {
    color: ${colors.primary};
  }

  ${({ active }: { active?: boolean }) =>
    active &&
    css`
      color: ${colors.primary};
      position: relative;

      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background: ${colors.primary};
        top: 0;
        left: 0;
        position: absolute;
      }
    `}
`
export const TabContent = styled('div')`
  height: 100%;
`

export const Tabs = styled('div')`
  height: 100%;

  ${({ layout }: { layout: string }) => {
    if (layout === 'trade') {
      return css`
        > ${TabLinkRow} {
          border-bottom: 1px solid ${colors.text};
          margin-bottom: 1rem;
          padding: 0 1rem;

          > ${TabLink} {
            &::before {
              bottom: -1px;
              top: auto;
            }
          }
        }

        > ${TabContent} {
          padding: 0 1rem;

          ${Card} {
            margin-bottom: 1rem;
          }
        }
      `
    }
  }}
`
