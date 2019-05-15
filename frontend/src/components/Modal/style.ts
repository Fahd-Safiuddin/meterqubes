import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { ButtonRound, Button as Btn } from '../Button/style'
import Button from '../Button'
import { ModalStyleProps } from './types'

export const Title = styled('h3')`
  margin-top: 1rem;
  font-size: 2rem;

  @media only screen and (min-width: 768px) {
    font-size: 2.25rem;
  }
`

export const Text = styled('p')`
  margin-bottom: 1.5rem;

  ${({ weight }: { weight?: string }) =>
    weight &&
    css`
      font-weight: ${weight || 'normal'};
    `};
`

export const Body = styled('div')``

export const Info = styled('div')`
  padding: 1.5rem 2rem;
  font-size: 1em;
  border: 1px solid ${colors.primary};
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
`

export const Backdrop = styled('div')`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #040508c4;
  opacity: 0;
  transition: opacity 0.5s;
`

export const Content = styled('div')`
  width: 100%;
  max-width: 640px;
  padding: 1.5rem 2rem;
  margin: 200px auto;
  background-color: ${colors.dark};
  color: ${colors.white};
  border-radius: 9px;
  position: relative;
  z-index: 1000;
  transition: opacity 0.1s, transform 0.2s;
  transform: translateY(-100%);
`

export const ModalClose = styled(Button)`
  position: absolute;
  top: 0.5rem;
  right: 0.25rem;
`

export const Modal = styled('div')<ModalStyleProps & { state: string }>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
  padding: 0.5rem;

  ${({ state }) => {
    if (state === 'entered') {
      return css`
        ${Content} {
          transform: translateY(0);
        }

        ${Backdrop} {
          opacity: 1;
        }

        + ${Backdrop} {
          opacity: 1;
          z-index: 1;
        }
      `
    }
    if (state === 'exiting' || state === 'exited') {
      return css`
        ${Content} {
          opacity: 0;
          transform: translateY(-100%);
          transition: opacity 0.2s, transform 0.3s;
          transition-delay: 0.1s;
        }

        ${Backdrop} {
          opacity: 0;
        }
      `
    }
  }}

  ${({ align }) =>
    align &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: ${align || 'flex-start'};
      align-items: center;
    `};

  ${({ textAlign }) =>
    textAlign &&
    css`
      text-align: ${textAlign || 'left'};
    `};

  ${({ size }) => {
    if (size === 'sm') {
      return css`
        ${Content} {
          max-width: 550px;
          border-radius: 6px;
        }
      `
    }
  }};

  ${Btn} {
    min-width: 100px;
  }

  ${ModalClose} {
    min-width: 0;
  }

  ${ButtonRound} {
    min-width: 0;
  }
`
