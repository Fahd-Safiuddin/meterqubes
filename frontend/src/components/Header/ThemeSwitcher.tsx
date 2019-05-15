import { inject, observer } from 'mobx-react'
import * as Styled from './style'
import Text from '../Text'

export default inject('themeStore')(
  observer(({ themeStore: { theme, setTheme } }) => {
    const onChangeTheme = () => {
      if (theme === 'night') {
        setTheme('day')
      } else {
        setTheme('night')
      }
    }

    return (
      <Styled.ThemeSwitcher onClick={onChangeTheme}>
        <img src="/static/img/night_mode.svg" />
        <Text weight="medium">Nightmode</Text>
        <Styled.Switcher theme={theme} />
      </Styled.ThemeSwitcher>
    )
  })
)
