import styled, { css } from 'styled-components'
import { Button } from './Button/style'

type FlexProps = {
  justify?: string
  align?: string
}

const Flex = styled('div')<FlexProps>`
  display: flex;

  ${({ justify }) =>
    justify &&
    css`
      justify-content: ${justify};
    `};

  ${({ align }) =>
    align &&
    css`
      align-items: ${align};
    `};

  > ${Button} + ${Button} {
    margin-left: 1rem;
  }
`

export default Flex
