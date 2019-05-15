import { ReactNode } from 'react'

export type ModalStyleProps = {
  align?: string
  textAlign?: string
  size?: string
}

export interface ModalProps {
  open: boolean
  title?: string | ReactNode
  children?: ReactNode
  portal?: string
  closeButton?: string
  onClose?: () => void
}
