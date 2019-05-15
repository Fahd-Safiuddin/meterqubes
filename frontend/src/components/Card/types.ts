import { ReactNode } from 'react'

export type CardProps = {
  title?: string
  justify?: string
  rtl?: boolean
  header?: ReactNode
  height?: boolean
  children: ReactNode | string
}
