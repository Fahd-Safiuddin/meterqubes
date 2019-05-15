import { HeaderProps } from '../Header/types'
import { ThemeStoreTypes } from '../../stores/theme/types'

// Page component types
export interface PageProps extends HeaderProps {
  layout?: string
  rtl?: boolean
  withoutHeader?: boolean
  withFooter?: boolean
  disabled?: boolean
  pathname?: string
  children: React.ReactNode
  themeStore?: ThemeStoreTypes
}
