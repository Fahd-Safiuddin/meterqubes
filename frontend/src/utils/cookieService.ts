import Cookies from 'js-cookie'

export const setMarketToken = (id: string) => Cookies.set('marketToken', id)

export const getMarketToken = () => Cookies.get('marketToken')

export const setUserToken = (token: string) => Cookies.set('MQ_token', token)
export const getUserToken = () => Cookies.get('MQ_token')
export const removeUserToken = () => Cookies.remove('MQ_token')
