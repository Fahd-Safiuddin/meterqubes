import { colors } from '../styles/colors'

export const getColor = (value: string | null) => {
  if (typeof value === 'string') {
    if (value.match(/^\+/g) || value.match(/sell/gi)) {
      return colors.successLight
    } else if (value.match(/^-/g) || value.match(/buy/gi)) {
      return colors.primaryLight
    } else {
      return `inherit`
    }
  }
}
