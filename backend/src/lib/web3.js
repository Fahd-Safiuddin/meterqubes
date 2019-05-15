const { INFURA_URL, EXCHANGE_ADDRESS, RELAYER, INFURA_URL_HTTP } = require('../config/web3')
const Web3 = require('web3')
const { exchangeABI } = require('../constants/abi')

const web3 = new Web3(new Web3.providers.WebsocketProvider(INFURA_URL))
const web3Http = new Web3(new Web3.providers.HttpProvider(INFURA_URL_HTTP))
const exchangeContract = web3.eth.Contract(exchangeABI, EXCHANGE_ADDRESS)

const isReconnectionAllowed = true
const timeoutInterval = 5000
const reconnectAttempts = 50
const address = RELAYER

let isConnected = false
let attempt = 0
let timeout = null;

(function connect () {
  web3
    .eth.getBalance(address)
    .then(async () => {
      web3Http
        .eth.getBalance(address)
        .then(async () => {
          isConnected = true
          timeout && clearTimeout(timeout)
          attempt = 0
          console.log('⊙ Successfully connected to blockchain ✅')
        })
    })
    .catch(error => {
      switch (true) {
        case isConnected:
          console.error('⊙ Blockchain error: %O ❌', error)
          break
        case !isReconnectionAllowed || attempt === reconnectAttempts:
          console.error('⊙ Failed to connect to Blockchain %O ❌', error)
          break
        case attempt === 0:
          console.warn('⊙ Blockchain web3Connection failure, trying to reconnect... ⚠️')
        // falls through
        default:
          timeout = setTimeout(function () {
            console.log('⊙ Reconnecting to Blockchain... (attempt: %d) 🌀', ++attempt)
            connect()
          }, timeoutInterval)
      }
    })
})()

module.exports = {
  web3,
  web3Http,
  exchangeContract,
}
