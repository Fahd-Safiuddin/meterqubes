import { observable, action } from 'mobx'
import { useStaticRendering } from 'mobx-react'
import Cookies from 'js-cookie'
import { isServer } from '../../utils/isServer'
import { ThemeStoreTypes } from './types'

useStaticRendering(isServer)

class ThemeStore {
  @observable theme
  constructor({}, initialState: ThemeStoreTypes) {
    this.theme = initialState ? initialState.theme : 'night'
  }

  @action setTheme = (theme: ThemeStoreTypes['theme']) => {
    this.theme = theme
    Cookies.set('theme', theme)
  }
}

export const initThemeStore = initialState => {
  return new ThemeStore(isServer, initialState)
}
