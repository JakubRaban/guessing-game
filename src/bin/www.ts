#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app'
import d from 'debug'
import http from 'http'
import { Server } from 'socket.io'
import onConnection from '../controllers'

const debug = d('server:server')

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: number | string): string | boolean | number => {
  if (typeof val === 'string') {
    // named pipe
    return val
  }

  if (val >= 0) {
    // port number
    return val
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = httpServer.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '9000')
app.set('port', port)

/**
 * Create HTTP server and socket.io server
 */

const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: 'http://localhost:3000' } })

/**
 * Listen on provided port, on all network interfaces.
 */

httpServer.listen(port)
httpServer.on('error', onError)
httpServer.on('listening', onListening)

io.on('connection', onConnection(io))
