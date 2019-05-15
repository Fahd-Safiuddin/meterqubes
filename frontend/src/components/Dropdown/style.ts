import styled from 'styled-components'
import Text from '../Text'
import { flex } from '../../styles/base'
import { colors } from '../../styles/colors'

export const DropdownItem = styled('li')`
  ${flex.flexStart};
  padding: 1rem;
  width: 100%;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  position: relative;

  i {
    margin-right: 1rem;
    color: #2d4b99;
  }

  img {
    max-width: 24px;
    width: 100%;
    margin-right: 1rem;
  }

  ${Text} {
    margin: 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:not(:last-child) {
    margin-bottom: -1px;

    &::after {
      content: '';
      display: block;
      width: calc(100% - 2rem);
      position: absolute;
      bottom: 0;
      left: 1rem;
      border-bottom: 1px solid ${colors.text}30;
    }
  }

  &:first-child {
    border-radius: 4px 4px 0 0;

    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background: ${colors.dark};
      position: absolute;
      left: calc(50% - 5px);
      top: -6px;
      transform: rotate(45deg);
      border-left: 1px solid ${colors.text}50;
      border-top: 1px solid ${colors.text}50;
    }
  }

  &:last-child {
    border-radius: 0 0 4px 4px;
  }

  &:hover {
    background: ${colors.hover.darkLight};

    &:first-child::before {
      background: ${colors.hover.darkLight};
    }

    &::after {
      opacity: 0;
    }
  }
`

export const Dropdown = styled('ul')`
  position: absolute;
  padding: 0;
  z-index: 600;
  right: 0;
  top: 100%;
  max-width: 300px;
  background: ${colors.dark};
  border-radius: 4px;
  border: 1px solid ${colors.text}30;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`
