import axios from 'axios'
import { getUserToken } from './cookieService'
import { API_URL } from '../config/api'

export const apiCaller = async (
  url: string,
  method: string = 'GET',
  data?: object,
  headers?: object
) => {
  try {
    const token = getUserToken()
    const reg = new RegExp(API_URL, 'g')
    const thirdPartyUrl = !url.match(reg)

    const res = await axios({
      url,
      method,
      data,
      ...(!thirdPartyUrl
        ? {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Headers': '*',
              ...(token && { Authorization: `Bearer ${token}` })
            }
          }
        : {
            headers: {
              ...headers
            }
          })
    })

    if (res) {
      return res.data
    }
  } catch (err) {
    throw err
  }
}
