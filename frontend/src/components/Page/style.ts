import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { NavList } from '../Nav/style'
import { animation } from '../../styles/base'
import { Header } from '../Header/style'
import { Input, Background } from '../Input/style'
import { Button } from '../Button/style'
import { Card } from '../Card/style'
import * as StyledTable from '../Table/style'
import Container from '../Container'
import { PageProps } from './types'
import { ROUTES } from '../../config/routes'
import { Logo } from '../Logo/style'

export const Layout = styled('div')`
  flex: 1;
`

export const Page = styled('div')<PageProps>`
  color: ${colors.white};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ rtl }) =>
    rtl &&
    css`
      direction: rtl;
    `}

  ${({ layout }) => {
    if (layout === 'mainPage') {
      return css`
        background: ${colors.white} url('/static/img/landing_top_bg.jpg') center -2px /
          100% no-repeat;

        ${Header} {
          background: transparent;

          ${NavList} {
            > * {
              &:nth-child(1) {
                opacity: 0;
                animation: ${animation.fadeIn} 0.5s 0.5s forwards;
              }
              &:nth-child(2) {
                opacity: 0;
                animation: ${animation.fadeIn} 0.5s 0.6s forwards;
              }
              &:nth-child(3) {
                opacity: 0;
                animation: ${animation.fadeIn} 0.5s 0.7s forwards;
              }
              &:nth-child(4) {
                opacity: 0;
                animation: ${animation.fadeIn} 0.6s 0.8s forwards;
              }
              &:nth-child(5) {
                opacity: 0;
                animation: ${animation.fadeIn} 0.65s 1s forwards;
              }
            }
          }
        }

        @media (max-width: 1500px) {
          background-position-x: left;
          background-size: 1540px;
        }

        @media (max-width: 767px) {
          background-position-x: 15%;
          background-size: auto 140vh;
        }
      `
    }

    if (layout === '404') {
      return css`
        text-align: center;
      `
    }

    if (layout === '500') {
      return css`
        text-align: center;
      `
    }

    if (layout === 'connect' || layout === 'login') {
      return css`
        background: ${colors.bg} url('/static/img/main_bg.svg') center 185px /
          110% no-repeat;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &::before {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(0deg, ${colors.bg} 30%, transparent 80%);
          pointer-events: none;
        }

        ${Logo} {
          position: relative;
          margin-bottom: 2rem;
          z-index: 1;
        }

        ${Layout} {
          position: relative;
          z-index: 1;
          width: 100%;
          flex: none;
        }
      `
    }

    if (layout === 'admin') {
      return css`
        ${Header} {
          background: ${colors.bgHeader};

          ${Container} {
            max-width: 100%;
          }

          ${Logo} {
            flex: 1;
          }
        }
      `
    }

    if (layout === 'trade' || layout === 'tour') {
      return css`
        ${Header} {
          background: ${colors.bgHeader};

          ${Container} {
            max-width: 100%;
          }

          ${Logo} {
            flex: 1;
          }
        }
      `
    }

    if (layout === 'exchange') {
      return css`
        background: ${colors.bg} url('/static/img/main_bg.svg') center 185px /
          110% no-repeat;

        &::before {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(0deg, ${colors.bg} 30%, transparent 80%);
          pointer-events: none;
        }

        ${Layout} ${Container} {
          position: relative;
          z-index: 1;
        }
      `
    }
  }}

  ${({ disabled, layout }) =>
    disabled &&
    css`
      ${Input} {
        pointer-events: none;
        opacity: ${layout === 'trade' ? '0.75' : '1'};
      }

      ${Button} {
        pointer-events: none;
        opacity: ${layout === 'trade' ? '0.75' : '1'};
      }
    `};

  ${({ theme, pathname }) =>
    theme === 'day' &&
    (pathname === ROUTES.trade || pathname === ROUTES.tour) &&
    css`
      background: ${colors.bgLight};

      ${Card} {
        background: ${colors.white};
        color: ${colors.dark};
      }

      ${Background} {
        background: ${colors.bgLight};
      }

      ${Input} {
        background: ${colors.bgLight};
        color: ${colors.dark};

        &:focus {
          background: ${colors.bgLight};

          + ${Background} {
            background: ${colors.bgLight};
          }
        }
      }

      ${StyledTable.Body} {
        ${StyledTable.Row} {
          color: ${colors.dark};
        }
      }

      ${Button} {
        &:hover {
          color: ${colors.dark};
        }
      }
    `}

  ${Header} ${Button} {
    pointer-events: auto;
    opacity: 1;
  }

  *::-webkit-scrollbar {
    width: 7px;
  }


  *::-webkit-scrollbar-thumb {
    background-color: ${colors.text}70;
    border-radius: 5px;
  }
`
