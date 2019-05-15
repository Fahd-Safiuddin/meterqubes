import { verify } from 'jsonwebtoken'
const {
  JWT_SECRET,
} = process.env

export const executeAuth = accessToken => {
  try {
    return (verify(accessToken.replace('Bearer ', ''), JWT_SECRET)).payload
  } catch (err) {
    throw Error('Authorize failed: ' + err.message)
  }
}
