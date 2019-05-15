import Text from '../Text'
import * as Styled from './style'
import Dropdown from '../Dropdown'
import { ProfileProps } from './types'

function Profile() {
  const user: ProfileProps = {
    // Mock data
    photo: '',
    name: 'Johny English',
    publicAddress: '0xf67A2921FB126939B21BCbc47232d4B13f979DF1'
  }

  const { photo, name, publicAddress } = user

  const dropdown = [
    {
      image: '/static/img/metamask-logo.svg',
      label: publicAddress,
      onClick: () => {}
    },
    {
      icon: 'settings',
      label: 'Setting',
      onClick: () => {}
    },
    {
      icon: 'exit_to_app',
      label: 'Quit',
      onClick: () => {}
    }
  ]

  return (
    <Styled.Wrapper>
      <Styled.Profile>
        <Styled.Avatar image={photo} />
        <Text weight="medium">
          Welcome, <span>{name}</span>
        </Text>
      </Styled.Profile>

      <Dropdown list={dropdown} />
    </Styled.Wrapper>
  )
}

export default Profile
