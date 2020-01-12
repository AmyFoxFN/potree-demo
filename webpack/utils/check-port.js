/**
 * @file To check if the port of devServer is available, and auto find a nearest available port.
 * @author funanamy@didiglobal.com
 */
const net = require('net')

function checkPort(config) {
  return function asyncConfig() {
    return new Promise((resolve) => {
      const server = net.createServer().listen(config.devServer.port, config.devServer.host)
      let success = true

      server.on('listening', function() {
        server.close()
      })

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          success = false
          config.devServer.port++
          resolve(asyncConfig())
        }
      })

      // if havn't reported error after 100ms, we think it's success.
      setTimeout(() => {
        if (success) {
          resolve(config)
        }
      }, 100)
    })
  }
}

module.exports = checkPort
