import { memo } from 'react'
import * as Styled from './style'

export type BarProps = {
  color?: string
  amount: number
  data: number[]
}

/**
 * Render styled Bard component with React.memo()
 *
 * @param {String} color (optional)
 * @param {Number} amount
 * @param {Number} total
 * @returns {ReactNode}
 */

const Bar = memo(({ color, amount, data }: BarProps) => {
  const width: number =
    (+amount / data.sort((a: number, b: number) => b - a)[0]) * 100

  return <Styled.Bar color={color} width={String(width)} />
})

export default Bar
