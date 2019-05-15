import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { SectionProps } from '.'
import { Media, MediaObject, MediaHeading, MediaText } from '../Media/style'
import Columns from '../Columns'
import Heading from '../Heading'
import { flex, animation } from '../../styles/base'

export const IMacWrapper = styled('div')`
  width: 55%;

  img {
    min-width: 800px;
    width: 100%;
    max-width: 100%;
    display: block;
    margin: -3rem -2rem 5rem -10%;
  }

  ${({ rtl }: { rtl?: boolean }) => {
    return rtl
      ? css`
          img {
            margin: -3rem -25% 5rem -2rem;
          }
        `
      : css`
          img {
            margin: -3rem -2rem 5rem -10%;
          }
        `
  }};

  @media (max-width: 1200px) {
    img {
      min-width: 700px;
      margin: -3rem -4rem 5rem 0;
    }
  }

  @media (max-width: 992px) {
    width: 100%;

    img {
      min-width: 0px;
      max-width: 700px;
      margin: -3rem auto 5rem auto;
      transform: translate(4.5rem, 0);
    }
  }

  @media (max-width: 767px) {
    img {
      min-width: 550px;
      margin-right: auto;
      margin-left: -180px;
    }
  }
`

export const Roadmap = styled('div')`
  height: 0;
  padding-bottom: 36.354%;
  background: ${colors.white} url('/static/img/roadmap.png') center / cover
    no-repeat;
`

export const Section = styled('section')<SectionProps>`
  padding: 90px 0;
  overflow-x: hidden;

  @media screen and (max-width: 768px) {
    padding: 50px 0;
  }

  ${({ withHeader }) =>
    withHeader &&
    css`
      margin-top: -82px;

      @media screen and (max-width: 768px) {
        margin-top: -100px;
      }
    `}

  ${({ theme }) => {
    if (theme === 'dark') {
      return css`
        color: ${colors.white};
      `
    } else if (theme === 'light') {
      return css`
        background: ${colors.white};
        color: ${colors.bg};
      `
    }
  }}

  /* styles for landing page */
  ${({ layout, rtl }) => {
    if (layout === 'mainPageSectionTop') {
      return css`
        min-height: 110vh;

        ${Heading.One} {
          margin-top: 10rem;
          font-size: 3.25em;
          opacity: 0;
          transform: translate(0, 15px);
          animation: ${animation.fadeUp} 1s forwards;
        }

        ${Heading.Two} {
          opacity: 0.75;
          margin-bottom: 100px;
          opacity: 0;
          transform: translate(0, 10px);
          animation: ${animation.fadeUp} 0.75s 0.35s forwards;
        }

        ${Media} {
          max-width: 480px;

          > * {
            &:nth-child(1) {
              opacity: 0;
              animation: ${animation.fadeIn} 0.5s 0.85s forwards;
            }
            &:nth-child(2) {
              > * {
                &:nth-child(1) {
                  opacity: 0;
                  animation: ${animation.fadeIn} 1s 1s forwards;
                }
                &:nth-child(2) {
                  opacity: 0;
                  animation: ${animation.fadeIn} 1s 1.1s forwards;
                }
                &:nth-child(3) {
                  opacity: 0;
                  animation: ${animation.fadeIn} 1s 1.2s forwards;
                }
              }
            }
          }
        }

        @media only screen and (max-width: 767px) {
          ${Heading.One} {
            margin-top: 3rem;
            font-size: 2.5em;
            line-height: 1.1em;
            text-align: left;
          }

          ${Heading.Two} {
            font-size: 1.25em;
            text-align: left;
            margin-bottom: 4rem;
          }
        }
      `
    }

    if (layout === 'getStarted') {
      return css`
        background: transparent;
      `
    }

    if (layout === 'anotherBlock') {
      return css`
        padding-top: 0;

        @media screen and (max-width: 767px) {
          padding-top: 0;
          margin-top: -50px;
        }

        ${Media} {
          padding-left: ${rtl ? '100px' : '0'};
          padding-right: ${rtl ? '0' : '100px'};
        }

        ${Columns} {
          > img {
            margin: 0 auto;
            display: block;
            max-width: 100%;
          }
        }
      `
    }

    if (layout === 'exchange') {
      return css`
        padding-top: 0;

        ${Heading.One} {
          text-align: center;
          font-size: 1.875em;
          font-weight: 600;
          margin-bottom: 5rem;
        }

        ${Media} {
          margin-bottom: 0;
        }

        ${MediaObject} {
          ${flex.center};
          background: ${colors.lightGrey};
          margin-left: auto;
          margin-right: auto;
          width: 90px;
          height: 90px;
          border-radius: 50%;
        }

        ${MediaHeading} {
          font-size: 1.375em;
        }

        ${MediaText} {
          font-size: 0.875em;
        }

        @media only screen and (max-width: 767px) {
          ${Heading.One} {
            font-weight: 600;
          }
        }
      `
    }
  }}
`
