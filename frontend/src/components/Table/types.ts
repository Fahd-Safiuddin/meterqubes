import { ReactNode } from 'react'
import { ThemeStoreTypes } from '../../stores/theme/types'

export type TableRowProps = {
  active?: boolean
  onClick?: () => void
  width?: string[]
  align?: string
  layout?: string
  headFilled?: boolean
  themeStore?: ThemeStoreTypes
}

export type TableProps = {
  head?: string[]
  body?: ReactNode
  children?: ReactNode
}
