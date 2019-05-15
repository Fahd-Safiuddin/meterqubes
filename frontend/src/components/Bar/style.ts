import styled from 'styled-components'
import { colors } from '../../styles/colors'

export const Bar = styled('div')<{ color: string; width: string | number }>`
  height: 100%;
  background: ${({ color }) => `${color}50` || colors.darkLight};
  width: ${({ width }) => `${width}%` || '100%'};
`
