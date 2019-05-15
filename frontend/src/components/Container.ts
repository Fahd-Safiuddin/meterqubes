import styled, { css } from 'styled-components'

type ContainerProps = {
  row?: boolean
  nav?: boolean
}

const Container = styled('div')`
  width: 100%;
  max-width: 1170px;
  padding: 0 1rem;
  margin: 0 auto;

  ${({ nav }: ContainerProps) =>
    nav &&
    css`
      @media screen and (max-width: 767px) {
        flex-direction: column;
      }
    `}

  ${({ row }: ContainerProps) =>
    row &&
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `}
`

export default Container
