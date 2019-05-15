import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { Wrapper, Input, Background } from '../Input/style'

export const Toggler = styled('button')`
  padding: 1rem;
  border: 0;
  width: 100%;
  color: ${colors.white};
  background: ${colors.darkLight};
  border-radius: 4px;
  position: relative;
  text-align: left;
  font-weight: 500;

  &:focus {
    outline: none;
  }

  ${({ open }: { open: boolean }) =>
    open &&
    css`
      background: ${colors.hover.darkLight};
    `}
`

export const Caret = styled('span')`
  position: absolute;
  right: 1rem;
`

export const AddonDivider = styled('span')`
  border-right: 1px solid ${colors.text};
  display: inline-block;
  height: 30px;
`

export const Addon = styled('div')``

export const ListItem = styled('li')`
  list-style-type: none;
  padding: 0.5rem 0;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: ${colors.primary};
  }

  ${({ active }: { active: boolean }) =>
    active &&
    css`
      font-weight: 600;
      color: ${colors.primary};
    `}
`

export const List = styled('ul')`
  padding: 0.5rem 0;
  margin: 0;
  height: 100%;
  max-height: 215px;
  overflow-y: auto;
`

export const Dropdown = styled('div')`
  position: absolute;
  left: 0;
  top: calc(100% - 2px);
  right: 0;
  background: ${colors.hover.darkLight};
  border-radius: 0 0 4px 4px;
  border-top: 1px solid ${colors.text};
  padding: 0 1rem;
  z-index: 2;

  ${Wrapper} {
    margin: 0;
    width: 100%;
    padding: 1rem 0;

    ${Input} {
      width: 100%;
      padding: 0.35rem 1rem 0.35rem 2rem;
      background-color: ${colors.white}10;
    }
  }
`

export const Select = styled('div')`
  position: relative;
  background: ${colors.darkLight};
  border-radius: 4px;
  display: flex;
  align-items: center;

  ${({ open }: { open: boolean }) =>
    open &&
    css`
      background: ${colors.hover.darkLight};
    `}

  ${Wrapper} {
    margin-bottom: 0;
  }

  ${Input} {
    background: transparent;
  }

  ${Background} {
    background: transparent;
  }

  ${({ size }: any) => {
    if (size === 'sm') {
      return css`
        ${Toggler} {
          padding: 0.125rem 0.5rem;
        }

        ${ListItem} {
          padding: 0.125rem 0;
        }
      `
    }
  }}
`
