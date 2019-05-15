import styled, { keyframes, css } from 'styled-components'
import { colors } from '../styles/colors'
import { flex } from '../styles/base'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export default styled(props => (
  <span {...props}>
    <span />
  </span>
))`
  margin: 0 auto;
  height: 0;
  display: inline-block;
  vertical-align: top;

  span {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
    border: 3px solid ${colors.white};
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${rotate} 0.5s linear infinite;
  }

  ${({ theme }) =>
    theme &&
    css`
      span {
        border-color: ${colors[theme] || 'inherit'};
        border-right-color: transparent;
      }
    `}

  ${({ fullpage }) =>
    fullpage &&
    css`
      ${flex.center};
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 500;
      background: ${colors.bg}70;
      height: auto;

      span {
        border-width: 4px;
        width: 2.25rem;
        height: 2.25rem;
      }
    `}
`
