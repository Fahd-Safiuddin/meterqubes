import * as Styled from './style'
import { CardProps } from './types'

export default function Card({
  title,
  header,
  justify,
  children,
  ...rest
}: CardProps) {
  return (
    <Styled.Card {...rest}>
      {header ? (
        <Styled.Header>
          {title && <Styled.Title>{title}</Styled.Title>}
          {header}
        </Styled.Header>
      ) : (
        title && <Styled.Title>{title}</Styled.Title>
      )}

      <Styled.Body justify={justify}>{children}</Styled.Body>
    </Styled.Card>
  )
}

export const CardTitle = Styled.Title
