import Router from 'next/router'
import { NextContext } from 'next'

export const redirect = (
  context: NextContext,
  target: string,
  asUrl?: string
) => {
  if (context && context.res) {
    context.res.writeHead(302, { Location: target })
    context.res.end()
  } else {
    Router.replace(target, asUrl)
  }
}
