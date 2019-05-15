import styled, { css } from 'styled-components'
import { MediaProps } from '.'
import { Button } from '../Button/style'

export const MediaHeading = styled('h3')`
  font-size: 1.5em;
  font-weight: 600;
  line-height: 1.3em;

  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`
export const MediaText = styled('p')`
  opacity: 0.75;
  font-weight: 500;
`

export const MediaBody = styled('div')`
  flex: 1;
`

export const MediaObject = styled(
  ({ className, image, object, alt = '', ...rest }) => (
    <div {...rest} className={className}>
      {image && <img src={image} alt={alt} />}
      {object && <span>{object}</span>}
    </div>
  )
)`
  img,
  span {
    max-width: 60px;
  }

  @media screen and (max-width: 767px) {
    margin-right: 1rem;

    img,
    span {
      max-width: 40px;
    }
  }
`

export const Media = styled('div')<MediaProps>`
  display: flex;
  margin-bottom: 3rem;

  ${Button} {
    margin-top: 1.25rem;
    min-width: 250px;
  }

  ${({ align }) =>
    align &&
    css`
      align-items: ${align};

      ${MediaText} {
        margin-bottom: 0;
      }
    `}

  ${({ size }) => {
    if (size === 'sm') {
      return css`
        margin-bottom: 1.5rem;
      `
    }

    if (size === 'lg') {
      return css`
        margin-bottom: 1.5rem;

        ${MediaObject} {
          width: 140px;
          height: 140px;

          img {
            max-width: 100%;
          }

          @media screen and (min-width: 768px) {
            width: 170px;
            height: 170px;
          }
        }
      `
    }
  }}

  ${({ rtl }) =>
    rtl
      ? css`
          ${MediaObject} {
            margin-left: 1.5rem;
          }
        `
      : css`
          ${MediaObject} {
            margin-right: 1.5rem;
          }
        `}

  ${({ vertical }) =>
    vertical &&
    css`
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;

      ${MediaObject} {
        margin-right: 0;
        margin-bottom: 2rem;
      }
    `}
`
