import * as ethUtil from 'ethereumjs-util'
import sigUtil from 'eth-sig-util'
import jwt from 'jsonwebtoken'
import { secret } from '../../../config/jwt'
import db from '../../../models'
import { Op } from 'sequelize'

export const create = async (ctx, next) => {
  await next()
  const { signature, publicAddress } = ctx.request.body
  try {
    const userObject = await db.user.findOne({ where: { publicAddress: { [Op.iLike]: publicAddress } } })
    ctx.assert(userObject, 500, `User with publicAddress ${publicAddress} is not found in database`)

    const msg = `MeterQubes authentication with one-time nonce: ${userObject.nonce}`
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'))
    const address = sigUtil.recoverPersonalSignature({ data: msgBufferHex, sig: signature })

    ctx.assert(address.toLowerCase() === publicAddress.toLowerCase(), 401, 'Signature verification failed')

    userObject.nonce = Math.floor(Math.random() * 10000)
    await userObject.save()

    const accessToken = await jwt.sign(
      {
        payload: {
          id: userObject.id,
          publicAddress,
        },
      },
      secret,
      null
    )
    ctx.status = 200
    ctx.body = accessToken
  } catch (e) {
    ctx.throw(500, `Can't create token: ${e}`)
  }
}
