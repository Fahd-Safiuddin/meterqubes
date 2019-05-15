export type ButtonProps = {
  theme?: string
  size?: string
  className?: string
  fluid?: boolean
  round?: boolean
  outlined?: boolean
  transparent?: boolean
  disabled?: boolean
  onClick: (args: React.SyntheticEvent) => void
}

export interface ButtonWithTextProps extends ButtonProps {
  text: string
  icon?: string
}

export interface ButtonWithIconProps extends ButtonProps {
  text?: string
  icon: string
}
