import styled from 'styled-components'
import { Input, Wrapper } from '../../Input/style'
import { flex } from '../../../styles/base'

export const Search = styled('div')`
  ${flex.center};
  ${Wrapper} {
    margin-bottom: 0;
  }

  ${Input} {
    width: 100px;
  }
`
