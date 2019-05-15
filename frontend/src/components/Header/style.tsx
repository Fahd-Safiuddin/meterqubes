import styled, { css } from 'styled-components'
import { colors } from '../../styles/colors'
import { flex, time } from '../../styles/base'
import Container from '../Container'
import { Button } from '../Button/style'
import Text from '../Text'
import { NavList } from '../Nav/style'
import { Logo } from '../Logo/style';


export const ThemeSwitcher = styled('div')`
  ${flex.center};
  margin: 0 1rem;
  padding: 0.25rem 1rem;
  height: 34px;
  background: ${colors.white}20;
  border-radius: 5px;

  ${Text} {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }

  img {
    margin-right: 0.5rem;
  }
`
export const Switcher = styled(props => (
  <div {...props}>
    <span />
  </div>
))`
  width: 30px;
  height: 11px;
  border-radius: 20px;
  background: ${colors.text};
  position: relative;
  cursor: pointer;
  transition: background ${time.fast};

  span {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${colors.white};
    display: block;
    position: absolute;
    top: -4px;
    left: 0;
    transition: transform ${time.fast}, box-shadow ${time.fast};
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }

  &:hover {
    span {
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    }
  }

  &:active {
    span {
      transform: scale(0.9);
    }
  }

  ${({ theme }) =>
    theme === 'night' &&
    css`
      background: ${colors.primary};

      span {
        transform: translateX(13px);
      }

      &:active {
        span {
          transform: scale(0.9) translateX(14px);
        }
      }
    `}
`

export const WalletTitle = styled('p')`
  color: ${colors.white}80;
  font-weight: 500;
  margin-bottom: 0;
  margin-right: 1rem;
`

export const WalletType = styled('p')`
  color: ${colors.white};
  font-weight: 600;
  margin-bottom: 0;
  margin-right: 0.5rem;
`

export const Wallet = styled('div')`
  ${flex.center};
  margin-left: 1rem;

  a {
    text-decoration: none;
    p {
      transition: color ${time.fast};
    }

    &:hover {
      p {
        color: ${colors.primary} !important;
      }
    }
  }
`

export const Header = styled('header')`
  min-height: 80px;
  display: flex;
  align-items: center;
  padding: 1rem 0;

  ${Button} {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media only screen and (max-width: 992px) {
    ${NavList} {
      ${ThemeSwitcher},
      ${Button} {
        margin-bottom: 1rem;
      }
    }
    ${Container} {
      flex-direction: column;
    }

    ${Logo} {
      position: absolute;
      left: 4rem;
      top: 23px;
    }
  }
`
