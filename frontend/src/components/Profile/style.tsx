import styled from 'styled-components'
import Text from '../Text'
import { Dropdown } from '../Dropdown/style'
import { colors } from '../../styles/colors'
import { flex } from '../../styles/base'

export const Avatar = styled(({ image, ...rest }) => (
  <div {...rest}>
    {image ? <img src={image} /> : <i className="material-icons">person</i>}
  </div>
))`
  i {
    padding: 0.5rem;
    border-radius: 4px;
    background: ${colors.white}20;
    color: #2d4b99;
  }
`

export const Profile = styled('div')`
  ${flex.center};
  padding: 1rem;
  margin: -1rem -0.5rem -1rem -1rem;

  ${Avatar} {
    margin-right: 1rem;
  }

  ${Text} {
    margin: 0;
    color: ${colors.text};

    span {
      color: ${colors.white};
    }
  }
`

export const Wrapper = styled('div')`
  position: relative;

  ${Dropdown} {
    opacity: 0;
    pointer-events: none;
    margin-top: 0.75rem;
    transform: translateY(1rem);
    transition: transform 0.2s, opacity 0.2s;
  }

  &:hover {
    ${Dropdown} {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }
`
