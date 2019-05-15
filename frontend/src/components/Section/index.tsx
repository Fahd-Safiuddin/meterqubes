import { memo } from 'react'
import * as Styled from './style'
import Container from '../Container'

// Section component types
export type SectionProps = {
  withHeader?: boolean
  theme?: string
  layout?: string
  rtl?: boolean
  children: React.ReactNode
}

/**
 * Render styled Section component
 *
 * @param {ReactChild} children
 * @param {Boolean} withHeader (optional)
 * @param {String} theme (optional)
 * @param {String} layout (optional)
 * @return {Component} React.ReactNode
 */

const Section = memo(
  ({ children, theme, layout, withHeader, rtl }: SectionProps) => (
    <Styled.Section
      theme={theme}
      withHeader={withHeader}
      layout={layout}
      rtl={rtl}
    >
      <Container>{children}</Container>
    </Styled.Section>
  )
)

export default Section
