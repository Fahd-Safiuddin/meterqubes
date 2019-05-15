import styled from 'styled-components'
import { Input, Label, Wrapper } from '../../Input/style'

export const Wrapp = styled('div')`
  ${Input}, ${Label}, ${Wrapper} {
    pointer-events: none;
  }
`
