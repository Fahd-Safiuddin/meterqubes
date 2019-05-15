import styled, { css } from 'styled-components'

// Columns types
type ColumnsProps = {
  justify?: string
  align?: string
  mobileReverse?: boolean
}

export default styled('div')`
  @media (min-width: 993px) {
    display: flex;

    ${({ justify }: ColumnsProps) => {
      if (justify) {
        return css`
          justify-content: ${justify};
        `
      }
    }}

    ${({ align }: ColumnsProps) => {
      if (align) {
        return css`
          align-items: ${align};
        `
      }
    }}
  }

  ${({ mobileReverse }: ColumnsProps) =>
    mobileReverse &&
    css`
      @media (max-width: 992px) {
        display: flex;
        flex-direction: column-reverse;
      }
    `}
`
