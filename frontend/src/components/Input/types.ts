import { ReactElement } from 'react'

export type StyledInputProps = {
  fluid?: boolean
  size?: string | any
  theme?: string
  icon?: string | SVGAElement | boolean
}

export interface InputProps extends StyledInputProps {
  label?: string
  type?: string
  placeholder?: string
  addon?: string | ReactElement
  error?: string
  rtl?: boolean
  disabled?: boolean
  value?: string | number
  name: string
  onBlur?: (e: Event | object) => void
  onFocus?: (e: Event | object) => void
  onChange: (val: string | boolean, name: string) => void
}
