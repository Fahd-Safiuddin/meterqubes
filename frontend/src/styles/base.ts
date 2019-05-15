import { keyframes } from 'styled-components'

export const time: {
  fast?: string
  medium?: string
} = {
  fast: '0.175s',
  medium: '0.4s'
}

export const transition: { button: string } = {
  button: `transition: transform ${time.fast}, box-shadow ${
    time.fast
  }, background ${time.fast}, color ${time.fast}`
}

export const flex: {
  flexStart?: string
  center?: string
  between_center?: string
} = {
  flexStart: `
    display: flex;
    align-items: center;
  `,
  center: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  between_center: `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `
}

export const animation = {
  fadeIn: keyframes`
    to {
      opacity: 1;
    }
  `,

  fadeUp: keyframes`
    to {
      opacity: 1;
      transform: translate(0,0);
    }
  `,

  scaleIn: keyframes`
    to {
      opacity: 1;
      transform: scale(1);
    }
  `,

  scaleLeft: keyframes`
    to {
      opacity: 1;
      transform: scale(1);
    }
  `
}
