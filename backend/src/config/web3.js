const { DEV_ENV } = process.env
const web3parameters = DEV_ENV === 'production'
  ? {
    INFURA_URL_HTTP: '',
    INFURA_URL: '',
    RELAYER: '',
    RELAYER_PRIVATE_KEY: '',
    EXCHANGE_ADDRESS: '',
    NUMBER_BLOCK_TO_WAIT: 12,
    CONTRACT_GAS_LIMIT: 190000,
  } : {
    INFURA_URL_HTTP: 'https://ropsten.infura.io/v3/f6bdecf6722f4a3faa2abec1562e01ed',
    INFURA_URL: 'wss://ropsten.infura.io/ws/v3/f6bdecf6722f4a3faa2abec1562e01ed',
    RELAYER: '0x37398a06d8bd553410d7404680ebed4638bb005b',
    RELAYER_PRIVATE_KEY: Buffer.from('2BB7104B5733DF81C0053071C8726A80CECBD51C54792EE5190706C504F9DDFD',
      'hex'), // relayer
    EXCHANGE_ADDRESS: '0x112863ff5087c5542542b5ab47c46af3dd97b153',
    NUMBER_BLOCK_TO_WAIT: 12,
    CONTRACT_GAS_LIMIT: 190000,
  }

module.exports = web3parameters
