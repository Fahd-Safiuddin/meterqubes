import styled, { css } from 'styled-components'
import { Button } from '../../Button/style'
import Flex from '../../Flex'
import { Card } from '../../Card/style'
import { Select, Toggler, Dropdown } from '../../Select/style'
import { colors } from '../../../styles/colors'

export const ToolbarButtons = styled('div')`
  margin-left: -0.25rem;
  margin-right: -0.25rem;

  ${Button} {
    color: #979aae !important;
    padding: 0 3px;
    position: relative;
    width: 28px;
    height: 28px;
    transition: none;
    margin: 0 0.25rem;

    img {
      width: 15px;
    }

    span {
      font-size: 8px;
      position: absolute;
      bottom: -12px;
      left: 0;
      display: block;
      text-align: center;
      width: 100%;
    }
  }
`

export const Toolbar = styled('div')`
  position: absolute;
  z-index: 100;
  top: 21px;

  ${({ rtl }: { rtl: boolean }) => {
    if (rtl) {
      return css`
        left: 56px;
        right: 0;
      `
    } else {
      return css`
        left: 0;
        right: 56px;
      `
    }
  }}

  ${Flex} {
    > div:not(${ToolbarButtons}) {
      margin: 0 0.5rem;
      > div {
        margin: 0 0.5rem;
      }
    }
  }
`

export const Chart = styled('div')`
  height: 100%;

  > div:not(${Toolbar}) {
    height: 100% !important;
  }
`

export const Wrapp = styled('div')`
  height: 100%;

  ${Card} {
    overflow: visible;
    height: 100%;
  }

  ${Select} {
    display: inline-flex;
    min-width: 100px;
    margin-right: 3rem;
    background: ${({ theme }) =>
      theme === 'day' ? colors.bgLight : '#2e345c'};
    color: ${({ theme }) => (theme === 'day' ? colors.dark : colors.white)};

    .material-icons {
      right: 0;
    }
  }

  ${Toggler} {
    background: ${({ theme }) =>
      theme === 'day' ? colors.bgLight : '#2e345c'};
    color: ${({ theme }) => (theme === 'day' ? colors.text : colors.white)};
  }

  ${Dropdown} {
    background: ${({ theme }) =>
      theme === 'day' ? colors.bgLight : '#2e345c'};
    color: ${({ theme }) => (theme === 'day' ? colors.text : colors.white)};
  }
`
