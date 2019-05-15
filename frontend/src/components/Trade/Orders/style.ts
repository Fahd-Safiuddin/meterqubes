import styled from 'styled-components'
import { flex } from '../../../styles/base'
import { colors } from '../../../styles/colors'
import * as StyledText from '../../Text'

export const Placeholder = styled('div')`
  ${flex.center};
  flex-direction: column;

  a {
    color: ${colors.primary};
  }
`
export const Image = styled('img')`
  margin-top: 50px;
  margin-bottom: 30px;
`
export const Text = styled(StyledText.default)`
  max-width: 400px;
  text-align: center;
  font-weight: 500;
  font-size: 0.875rem;
`
