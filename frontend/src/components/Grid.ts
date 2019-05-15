import styled, { css } from 'styled-components'
import { colors } from '../styles/colors'
import { MediaText } from './Media/style'
import { time } from '../styles/base'

type GridProps = {
  layout?: string
}

/**
 * Render Grid component
 * @param {String} layout (optional)
 * @param {ReactChild} children
 * @return {Component} React.ReactNode
 */

export default styled('div')`
  display: grid;
  padding: 1rem;

  ${({ layout }: GridProps) => {
    if (layout === 'exchange') {
      return css`
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 1px;
        grid-auto-rows: minmax(100px, auto);
        border: 1px solid ${colors.white};
        position: relative;
        padding: 0;

        &::after {
          content: '';
          display: block;
          position: absolute;
          left: -1px;
          top: -1px;
          right: -1px;
          bottom: -1px;
          border: 1px solid ${colors.white};
          pointer-events: none;
        }

        > * {
          margin: -1px;
          width: calc(100% + 2px);
          height: calc(100% + 2px);
          padding: 1.5rem 0.5rem;
        }

        ${MediaText} {
          margin-bottom: 0;
        }

        @media only screen and (min-width: 768px) {
          grid-template-columns: repeat(2, 1fr);

          > * {
            border: 1px solid ${colors.lightGrey};
            padding: 3rem 1rem;
            position: relative;
            transition: color ${time.fast};

            &::before {
              content: '';
              display: block;
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              background: ${colors.primary};
              border-radius: 4px;
              z-index: -1;
              opacity: 0;
              transition: transform ${time.medium}, box-shadow ${time.fast};
              box-shadow: 0 0 25px ${colors.primary}70;
            }

            &:hover {
              color: ${colors.white};
              border-color: transparent;
              z-index: 100;
              cursor: pointer;

              &::before {
                opacity: 1;
                transform: scale(1.1);
              }
            }
          }
        }

        @media only screen and (min-width: 993px) {
          grid-template-columns: repeat(3, 1fr);
        }
      `
    }

    if (layout === 'trade') {
      return css`
        grid-gap: 1rem;
        min-height: calc(100vh - 96px);

        @media only screen and (min-width: 1200px) {
          grid-template-columns: calc(24% - 0.25rem) 50% calc(24% - 0.25rem);
          grid-template-rows:
            minmax(100px, 0.1fr) minmax(230px, 0.2fr) minmax(180px, 0.27fr)
            minmax(120px, 0.15fr) minmax(240px, 0.28fr);
          grid-template-areas:
            'trade header markets'
            'trade diagram markets'
            'book diagram markets'
            'book orders history'
            'balance orders history';

          > * {
            &:nth-child(1) {
              grid-area: trade;
            }

            &:nth-child(2) {
              grid-area: book;
            }

            &:nth-child(3) {
              grid-area: balance;
            }

            &:nth-child(4) {
              grid-area: header;
            }

            &:nth-child(5) {
              grid-area: diagram;
            }

            &:nth-child(6) {
              grid-area: orders;
            }

            &:nth-child(7) {
              grid-area: markets;
            }

            &:nth-child(8) {
              grid-area: history;
            }
          }
        }

        @media only screen and (min-width: 1430px) {
          grid-template-columns: calc(23% - 1rem) 54% calc(23% - 1rem);
        }
      `
    }

    if (layout === 'admin') {
      return css`
        height: 100%;
        grid-gap: 1rem;
        grid-template-columns: 37% 32% 29%;
        grid-template-rows: minmax(600px, 0.5fr) minmax(300px, 0.75fr);
        grid-template-areas:
          'main-info token wallets'
          'transactions transactions transactions';

        > * {
          &:nth-child(1) {
            grid-area: main-info;
          }

          &:nth-child(2) {
            grid-area: token;
          }

          &:nth-child(3) {
            grid-area: wallets;
          }

          &:nth-child(4) {
            grid-area: transactions;
          }
        }

        @media (max-width: 992px) {
          grid-template-columns: 100%;
          grid-template-rows: none;
          grid-template-areas:
            'main-info'
            'token'
            'wallets'
            'transactions';
        }
      `
    }

    if (layout === 'main-info') {
      return css`
        padding: 0;
        grid-gap: 1rem;
        grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr);
        grid-template-rows: minmax(100px, 0.25fr) minmax(100px, 0.25fr) minmax(
            350px,
            1fr
          );
        grid-template-areas:
          'transaction exchange'
          'voting voting-limit'
          'wallet wallet';

        > * {
          &:nth-child(1) {
            grid-area: transaction;
          }

          &:nth-child(2) {
            grid-area: exchange;
          }

          &:nth-child(3) {
            grid-area: voting;
          }

          &:nth-child(4) {
            grid-area: voting-limit;
          }

          &:nth-child(5) {
            grid-area: wallet;
          }
        }
      `
    }
  }}
`
