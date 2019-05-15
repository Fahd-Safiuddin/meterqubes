import styled from 'styled-components'
import { Button } from '../../Button/style'
import { Label } from '../../Input/style'
import { Wrapper } from '../../Input/style'
import { flex } from '../../../styles/base'

export const InputGroup = styled('div')`
  ${flex.center};

  ${Wrapper} {
    margin-bottom: 1rem;

    &:first-child {
      margin-right: 1rem;
      width: 42px;
    }

    &:last-child {
      flex: 1;
    }
  }
`

export const Wrapp = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 0.5rem;

  ${Button} {
    width: 100%;
    max-width: 200px;
  }

  ${Label} {
    font-size: 0.875rem;
  }

  > div {
    margin-bottom: 2rem;
  }
`
