import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { StyledInputProps } from './types'

export const Label = styled('span')`
  color: ${colors.text};
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 0.25rem;
  pointer-events: none;
`

export const Error = styled('span')`
  color: ${colors.primary};
`

export const Background = styled('div')`
  position: absolute;
  display: block;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  background: ${colors.darkLight};
  pointer-events: none;
`

export const Input = styled('input')<StyledInputProps>`
  background: ${colors.darkLight};
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: ${colors.white};
  outline: none;
  font-weight: 500;
  -moz-appearance: textfield;
  position: relative;
  z-index: 4;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;

  }
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.75;
  }

  &:focus {
    background: ${colors.hover.darkLight};

    + ${Background} {
      background: ${colors.hover.darkLight};
    }
  }

  &:-internal-autofill-previewed,
  &:-internal-autofill-selected,
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    background: ${colors.darkLight};
    -webkit-text-fill-color: #fff;
    caret-color: #fff;
    box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0) inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  &[type="file"] {
    display: none;

    + span {
      display: block;
      height: 40px;
    }
  }

  &::placeholder {
    color: ${colors.text};
  }

  ${({ fluid }) =>
    fluid &&
    css`
      width: 100%;
    `}

  ${({ size }) => {
    if (size === 'sm') {
      return css`
        padding: 0.175rem 0.25rem;
        font-size: 0.875rem;
      `
    } else if (size === 'lg') {
      return css`
        padding: 0.875rem 1.5rem;
      `
    }
  }}

  ${({ theme }) => {
    if (theme === 'transparent') {
      return css`
        background: transparent;
      `
    } else {
      return css`
        background: ${colors[theme]};
      `
    }
  }}

  ${({ icon }) =>
    icon &&
    css`
      padding-left: 2rem;
    `}
`

export const FileButton = styled(Input.withComponent('span'))`
  cursor: pointer;
`

export const Addon = styled('span')<{ addonType?: string; rtl?: boolean }>`
  position: relative;
  height: 100%;
  color: ${colors.text};
  z-index: 5;
  white-space: nowrap;
  cursor: text;

  ${({ rtl }) =>
    rtl
      ? css`
          left: ${({ addonType }: { addonType?: string }) =>
            addonType === 'text' ? '1rem' : '0'};
        `
      : css`
          right: ${({ addonType }: { addonType?: string }) =>
            addonType === 'text' ? '1rem' : '0'};
        `}
`

export const AddonGroup = styled('div')`
  position: relative;
  display: flex;
  align-items: center;

  i.material-icons {
    transition: color 0.15s;
  }

  &:hover {
    i.material-icons {
      color: ${colors.white};
    }
  }
`

export const Wrapper = styled('label')<StyledInputProps>`
  i {
    position: absolute;
    left: 0.5rem;
    color: ${colors.text};
    top: 50%;
    transform: translateY(-50%);
  }

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  ${({ fluid }) =>
    fluid &&
    css`
      width: 100%;
    `}
`
