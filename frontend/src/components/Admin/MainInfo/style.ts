import styled, { css } from 'styled-components'
import { Button } from '../../Button/style'
import Text from '../../Text'
import { Input, AddonGroup, Label } from '../../Input/style'
import { MainInfoPropsTypes } from './types'
import { colors } from '../../../styles/colors'
import Heading from '../../Heading'

export const InputGroup = styled('div')<MainInfoPropsTypes>`
  ${Label} {
    font-size: 0.875rem;
  }

  ${({ layout }) => {
    if (layout === 'mainInfo') {
      return css`
        ${Label} {
          position: relative;
          z-index: 3;
          top: -5px;
        }

        ${Input} {
          font-size: 1.875rem;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          padding-top: 2rem;
          font-weight: 700;
        }

        ${AddonGroup} {
          position: static;
        }

        > ${Button} {
          position: absolute;
          right: 0rem;
          bottom: 0rem;
          background: transparent;
        }
      `
    }

    if (layout === 'wallet') {
      return css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100% - 40px);
        padding-top: 60px;

        > ${Button} {
          position: absolute;
          bottom: auto;
          right: 1rem;
          top: 1rem;
          background: ${colors.white}20;
        }

        ${Text} {
          margin-bottom: 0;
        }

        ${Heading.One} {
          margin-bottom: 0.25rem;
          color: ${colors.primary};
        }

        ${Heading.Three} {
          font-weight: 500;
        }
      `
    }
  }}
`
