import styled from 'styled-components'
import { flex } from '../../styles/base'
import { MediaObject, MediaText } from '../Media/style'
import { colors } from '../../styles/colors'
import { Card } from '../Card/style'
import { HeadingOne } from '../Heading'

export const Wrapp = styled('div')`
  ${flex.center};
  flex-direction: column;
  min-height: calc(100vh - 340px);
  padding-top: 100px;
  padding-bottom: 160px;

  ${HeadingOne} {
    text-align: center;
    font-size: 2.75rem;
    margin-bottom: 3rem;
  }

  @media only screen and (min-width: 768px) {
    ${HeadingOne} {
      font-size: 3.25rem;
    }
  }

  ${MediaObject} {
    margin-bottom: 1.5rem;
  }

  ${MediaText} {
    color: ${colors.text};
    font-weight: 500;
  }

  ${Card} {
    width: 100%;
    max-width: 1000px;
    padding: 3rem;
    overflow: visible;
  }
`

export const ExchangeDivider = styled('div')`
  max-width: 70px;
  align-self: center;
  cursor: pointer;

  &:hover {
    svg path {
      fill: ${colors.white};
    }
  }
`

export const Exchange = styled('div')`
  display: flex;
  width: 100%;
  margin-bottom: 2rem;

  > * {
    flex: 1;
  }
`
