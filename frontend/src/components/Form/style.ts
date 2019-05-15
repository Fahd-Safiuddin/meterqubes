import styled from 'styled-components'
import { Input } from '../Input/style'
import { Button } from '../Button/style'

export const Group = styled('div')`
  width: 100%;
  margin-bottom: 1rem;
`

export const Form = styled('form')`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;

  ${Input} {
    width: 100%;
  }

  ${Button} {
    width: 100%;
    max-width: 270px;
    margin: 2rem auto;
    display: block;
  }
`
