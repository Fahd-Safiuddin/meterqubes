import React, { ReactChildren } from 'react'
import { redirect } from '../utils/redirect'

export default class Error extends React.Component<{
  statusCode: string
  t: (key: string, option?: object) => ReactChildren
}> {
  static getInitialProps({ req, res, err }) {
    let statusCode = null
    if (res) {
      ;({ statusCode } = res)
    } else if (err) {
      ;({ statusCode } = err)
    }

    if (statusCode) {
      redirect(req, `/${statusCode}`)
    }

    return {
      statusCode,
      err
    }
  }
}
