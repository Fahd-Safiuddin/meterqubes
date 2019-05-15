import styled, { css } from 'styled-components'
import { Button } from '../Button/style'
import { ConnectStyleProps } from '.'
import Flex from '../Flex'
import { colors } from '../../styles/colors'

export const Balance = styled(({ className, text, balance, ...rest }) => (
  <Flex {...rest} className={className} justify="space-between">
    <span>{text}</span>
    <span>{balance}</span>
  </Flex>
))`
  max-width: 370px;
  margin: 0 auto 2rem;

  span {
    font-weight: 700;

    &:first-child {
      color: ${colors.text};
    }
  }
`

export const Connect = styled('div')`
  text-align: center;

  ${({ disabled }: ConnectStyleProps) =>
    disabled &&
    css`
      filter: grayscale(1);
    `};

  ${Button} {
    min-width: 240px;
  }

  img {
    margin-top: 3rem;
    margin-bottom: 2.5rem;
  }
`
