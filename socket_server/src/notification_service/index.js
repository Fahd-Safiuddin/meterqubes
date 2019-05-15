import SocketIO from 'socket.io'
import { server } from '../index'

import { executeAuth } from '../utils/auth'

const { NODE_ENV } = process.env

class NotificationService {
  constructor () {
    this.client = {}
    this.connection = {}
    this.io = new SocketIO(server, { origins: '*:*' })
    this.io.sockets.on('connection', connection => {
      console.log('new connection established id=', connection.id)

      connection.on('auth', async ({ accessToken }) => {
        this.authorize(accessToken, connection.id)
      })
      connection.on('disconnect', () => {
        this.removeClient(connection.id)
      })
    })

    if (NODE_ENV !== 'production') {
      setInterval(() => {
        console.log(this.client)
      }, 2000)
    }
  }

  async authorize (token, connectionId) {
    try {
      const { id } = executeAuth(token)

      this.saveClient(id, connectionId)
    } catch (e) {
      console.error('Authorize failed: ', e.message)
    }
  }

  saveClient (userId, connectionId) {
    if (!this.client.hasOwnProperty(userId)) this.client[userId] = []

    this.client[userId].push(connectionId)
    this.connection[connectionId] = userId
  }

  removeClient (connectionId) {
    const clientId = this.connection[connectionId]

    if (clientId) {
      this.client[clientId] = this.client[clientId].filter(i => i !== connectionId)
      delete this.connection[connectionId]
    }
  }

  emitToAll (event, data) {
    console.log('Event to all users. Event "%s" with data "%o"', event, data)

    try {
      this.io.sockets.emit(event, data)
    } catch (e) {
      throw Error('[SOCKET /emit/] failed ', e.message)
    }
  }

  emitToUser (userId, event, data) {
    console.log('Event to user %s. Event "%s" with data "%o"', userId, event, data)

    try {
      const socketIds = this.client[userId]

      if (socketIds && socketIds.length) {
        socketIds.forEach(socketId => { this.io.sockets.in(socketId).emit(`${event}`, data) })
      }
    } catch (e) {
      throw Error('[SOCKET /emitToUser/] failed ', e.message)
    }
  }
}

export const notificationService = new NotificationService()
