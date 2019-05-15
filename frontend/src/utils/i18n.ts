// const { localeSubpaths } = require('next/config').default().publicRuntimeConfig
import NextI18Next from 'next-i18next'

export type I18nTProps = (key: string, opt?: object) => any

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['ar'],
  localePath: '/src/static/locales'
})

export default NextI18NextInstance

/* Optionally, export class methods as named exports */
export const {
  appWithTranslation,
  withNamespaces,
  i18n,
  Link
} = NextI18NextInstance
