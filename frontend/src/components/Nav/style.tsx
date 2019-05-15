import styled, { css, keyframes } from 'styled-components'
import { transition, time } from '../../styles/base'
import { colors } from '../../styles/colors'
import { NavProps } from './types'

const AnimateNavItem = keyframes`
  to {
    transform: scale(1, 1);
  }
`

export const NavListItem = styled('li')`
  list-style-type: none;

  a {
    padding: 0.5rem 1rem;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    display: inline-block;
    border: 1px solid transparent;
    ${transition.button};
    color: ${colors.white}80;

    &:hover {
      color: ${colors.white};
    }

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  ${({ active }: { active: boolean }) =>
    active &&
    css`
      position: relative;

      &::before {
        content: '';
        position: absolute;
        display: block;
        width: 100%;
        height: 2px;
        top: calc(-1rem - 3px);
        transform: scale(0, 0);
        background: ${colors.primary};
        animation: ${AnimateNavItem} ${time.medium} 0.2s forwards;
      }

      a {
        color: ${colors.white};
      }

      @media only screen and (max-width: 992px) {
        &::before {
          height: 100%;
          width: 2px;
          left: 0;
          top: -4px;
        }
      }
    `}

  @media (max-width: 992px) {
    a {
      margin-bottom: 0.5rem;
    }
  }
`

export const NavList = styled('ul')<NavProps>`
  display: flex;
  align-items: center;
  padding: 0;
  margin-bottom: 0;

  @media only screen and (max-width: 992px) {
    flex-direction: column;
    transition: height ${time.medium}, opacity ${time.medium};
    max-height: 320px;
    align-items: flex-start;

    ${({ collapse }) =>
      collapse &&
      css`
        height: ${({ navOpen }: NavProps) => (navOpen ? '500px' : '0px')};
        opacity: ${({ navOpen }: NavProps) => (navOpen ? '1' : '0')};
        pointer-events: ${({ navOpen }: NavProps) =>
          navOpen ? 'auto' : 'none'};

        button {
          margin-left: 1rem;
        }
      `};
  }
`

export const Nav = styled('nav')`
  position: relative;

  .nav-toggler {
    @media only screen and (min-width: 993px) {
      display: none;
    }
  }

  @media only screen and (max-width: 992px) {
    width: calc(100% + 2rem);
    margin-left: 0;
  }
`
