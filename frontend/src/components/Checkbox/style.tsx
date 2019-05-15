import styled from 'styled-components'
import { colors } from '../../styles/colors'

export const Error = styled('p')`
  color: ${colors.primary};
`

export const Input = styled('input')`
  display: none;
`

export const Checkbox = styled('div')`
  display: flex;

  i {
    font-size: 20px;
    color: ${({ checked }: { checked: boolean }) =>
      checked ? colors.success : colors.primary};
  }
`
export const Label = styled('span')``
