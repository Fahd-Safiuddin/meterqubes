import { RELAYER } from '../../../config/web3'

export const getRelayer = async (ctx, next) => {
  await next()

  ctx.body = { relayer: RELAYER }
}
