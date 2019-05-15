import styled, { css } from 'styled-components'
import { ModalStyled } from '../Modal'
import { Card } from '../Card/style'
import { flex } from '../../styles/base'
import { Button } from '../Button/style'
import { colors } from '../../styles/colors'
import { ModalBoxProps } from './types'
import { Media } from '../Media/style'

const Modal = ModalStyled.Modal
const Content = ModalStyled.Content

export const ModalCountObject = styled('div')`
  ${flex.center};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${colors.primary};
  position: relative;
  font-weight: 700;
  font-size: 1.5rem;
  top: -6px;

  &::before {
    content: '';
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    position: absolute;
    background: ${colors.primary}20;
  }
`

export const ModalCount = styled('div')`
  font-weight: 600;
  color: ${colors.text};
  margin-right: auto;
`

export const ModalBox = styled('div')<ModalBoxProps>`
  position: relative;

  ${Modal} {
    position: absolute;
    min-height: 430px;
    height: auto;
    height: 100%;
    z-index: 90;
    min-width: 600px;
  }

  ${Content} {
    margin: 0 auto;
    pointer-events: auto;
    background: #0f1835;
  }

  ${Media} {
    margin-bottom: 1rem;
  }

  ${Card} {
    position: relative;
    height: 100%;
    z-index: 0;
    pointer-events: none;

    ${Button} {
      pointer-events: none;
    }
  }

  ${Button} {
    pointer-events: auto;
  }

  ${({ active }) =>
    active &&
    css`
      ${Card} {
        z-index: 200;
      }
    `}
`

export const WrapEthModalBox = styled(ModalBox)`
  ${Modal} {
    left: calc(100% + 70px);
    bottom: 70px;
    top: auto;
  }
`
export const OrderBookModalBox = styled(ModalBox)`
  ${Modal} {
    left: calc(100% + 70px);
    bottom: -100px;
    top: auto;
  }
`

export const MarketsModalBox = styled(ModalBox)`
  ${Modal} {
    left: auto;
    right: calc(100% + 70px);
    bottom: -50px;
    top: auto;
  }
`

export const TradeModalBox = styled(ModalBox)`
  ${Modal} {
    left: calc(100% + 70px);
    bottom: -150px;
    top: auto;
  }
`

export const TradeChartModalBox = styled(ModalBox)`
  ${Modal} {
    min-width: 700px;
    left: 50%;
    bottom: calc(-100% - 50px);
    top: auto;
    min-height: 200px;
  }
`

export const OrdersModalBox = styled(ModalBox)`
  ${Modal} {
    min-width: 700px;
    left: auto;
    right: 0;
    bottom: calc(100% - 85px);
    top: auto;
  }
`

export const HistoryModalBox = styled(ModalBox)`
  ${Modal} {
    left: auto;
    right: calc(100% + 70px);
    bottom: 0px;
    top: auto;
  }
`
