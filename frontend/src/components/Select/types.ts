import { ReactNode } from 'react'

export interface ItemTypes {
  label: string
  image?: string
  id: number
}

export interface SelectProps {
  items: ItemTypes[]
  addon?: ReactNode
  selected?: number
  children?: ReactNode
  search?: boolean
  caret?: boolean
  size?: string
  onSelect: (id: number) => void
  onSearch?: (searchTerm: string) => void
}

export interface SelectState {
  searchTerm: string
  open: boolean
}
