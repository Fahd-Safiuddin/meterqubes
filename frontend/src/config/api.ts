export const API_URL = process.env.API_URL
  ? `${process.env.API_URL}/api/v1`
  : 'http://localhost:3000/api/v1'
export const SOCKET_URL =
  process.env.SOCKET_URL || 'https://mq-socket-dev.scenario-projects.com' // 'http://localhost:4337' @TODO: Need to replace later
export const ETHPRICE_API_URL = 'https://api.etherscan.io/'
export const GASPRICE_API_URL = 'https://www.etherchain.org/api/gasPriceOracle'
export const ETHPRICE_KEY = 'XPUF1K13TW2WIY1U8MXA2V5I1UW95XQNAM'
