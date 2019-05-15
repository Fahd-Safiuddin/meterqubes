import * as Styled from './style'
import { observer, inject } from 'mobx-react'
import { getColor } from '../../utils/colorByValue'
import { TableProps, TableRowProps } from './types'

export const Table = inject('themeStore')(
  observer(
    ({
      head,
      body,
      width,
      align,
      children,
      layout,
      headFilled,
      themeStore: { theme }
    }: TableProps & TableRowProps) => (
      <Styled.Table theme={theme}>
        {Array.isArray(head) && (
          <Styled.Head>
            <Styled.Row align={align} layout={layout} headFilled={headFilled}>
              {head.map((label: string, i: number) => (
                <Styled.Col width={width && width[i]} key={i}>
                  {label}
                </Styled.Col>
              ))}
            </Styled.Row>
          </Styled.Head>
        )}

        {children}
        {Array.isArray(body) && (
          <Styled.Body>
            {body.map((row, rowIdx) => (
              <Styled.Row key={rowIdx} align={align} layout={layout}>
                {Object.values(row).map((col, colIdx) => {
                  return (
                    <Styled.Col
                      key={colIdx}
                      width={width[colIdx]}
                      color={getColor(col)}
                    >
                      {typeof col === 'function' ? col() : col}
                    </Styled.Col>
                  )
                })}
              </Styled.Row>
            ))}
          </Styled.Body>
        )}
      </Styled.Table>
    )
  )
)

export const TableRow = Styled.Row
export const TableCol = Styled.Col
export const TableBody = Styled.Body
