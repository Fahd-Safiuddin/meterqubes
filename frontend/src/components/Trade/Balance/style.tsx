import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { animation, time } from '../../../styles/base'
import { Card } from '../../Card/style'
import { Button } from '../../Button/style'
import { Input } from '../../Input/style'

export const Article = styled(
  ({ title, text, ...rest }: { title: string; text: string }) => (
    <article {...rest}>
      {title && <h4>{title}</h4>}
      {text && <p>{text}</p>}
    </article>
  )
)`
  text-align: right;

  h4 {
    margin-bottom: -3px;
    transform: scale(0.1);
    transform-origin: bottom right;
    animation: ${animation.scaleIn} ${time.fast} forwards;
  }

  p {
    font-size: 0.75rem;
    color: ${colors.text};
    font-weight: 500;
    margin-bottom: 0;
    transform: scale(0.1);
    transform-origin: bottom right;
    animation: ${animation.scaleIn} ${time.fast} forwards;
  }
`

export const Wrapp = styled('div')`
  height: 100%;

  ${Card} {
    height: 100%;

    ${Button} {
      min-width: 155px;
    }
  }

  ${Input} {
    max-width: calc(100% - 150px);
  }
`
