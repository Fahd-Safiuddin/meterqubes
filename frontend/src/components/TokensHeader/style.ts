import styled, { keyframes } from 'styled-components'
import { colors } from '../../styles/colors'

const slide = keyframes`{
	0% {
		transform: translateX(0%);
	}

	100% {
		transform: translateX(calc(-270px * 11));
	}
}`

export const Token = styled('h3')`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.white};
  margin-bottom: 0;
`
export const Price = styled('p')`
  font-weight: 600;
  color: ${colors.white}80;
  margin-bottom: 0;
`
export const Percentage = styled('p')`
  font-weight: 600;
  color: ${({ color }) => color || colors.text};
  margin-bottom: 0;
`
export const Article = styled('article')`
  min-width: 200px;
  padding: 1rem;

  &:not(:last-child) {
    margin-right: 3rem;
  }
`

export const Content = styled('div')`
  display: flex;
  width: calc(200px * 11);
  animation: 20s linear 0s infinite normal none running ${slide};

  &::-webkit-scrollbar {
    height: 0;
    background: transparent;
  }
`

export const Header = styled('div')`
  background: ${colors.white}10;
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40%;
    background: linear-gradient(-90deg, transparent, ${colors.bg});
    z-index: 1;
  }
  &::before {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, ${colors.bg});
    z-index: 1;
  }
`
