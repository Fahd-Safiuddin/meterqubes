import styled, { css } from 'styled-components'

// Heading component types
type HeadingTypes = {
  align?: string
  weight?: string
}

export const HeadingOne = styled('h1')`
  ${({ weight }: HeadingTypes) => {
    if (weight === 'light') {
      return css`
        font-weight: 300;
      `
    } else if (weight === 'normal') {
      return css`
        font-weight: 400;
      `
    }
  }}

  ${({ align }: HeadingTypes) =>
    align &&
    css`
      text-align: ${align || 'left'};
    `}

  @media (max-width: 992px) {
    font-size: 1.5em;
  }
`
export const HeadingTwo = styled(HeadingOne.withComponent('h2'))``
export const HeadingThree = styled(HeadingOne.withComponent('h3'))``
export const HeadingFour = styled(HeadingOne.withComponent('h4'))``

export default {
  One: HeadingOne,
  Two: HeadingTwo,
  Three: HeadingThree,
  Four: HeadingFour
}
