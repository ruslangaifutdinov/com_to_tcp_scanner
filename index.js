    const fs = require('fs')
    const net = require('net')
    const colors = require("colors")
    const EventEmitter = require('events')
    const SerialPort = require('serialport')
    const port = new SerialPort('COM3', {baudRate: 9600,autoOpen: true})

    class CodeEmitter extends EventEmitter { }
    const myEmitter = new CodeEmitter()

    var DATAMATRIX = ''
    const server = net
     .createServer((socket) => {
      socket.on('data', (data) => {
      console.log(data.toString())
    })
    myEmitter.on('codeReceived', () => {
      socket.write(DATAMATRIX)
    })
  })
    .on('error', (err) => {
    console.error(err)
  })

  port.on('data', function (data) {
  DATAMATRIX = data
  console.log(colors.bgBlue.white(`Datamatrix Code = ${String(DATAMATRIX)}`))
  fs.appendFileSync('datamatrix-results.txt', DATAMATRIX + '\n')
  console.log(colors.bgMagenta.white(`DataMatrix Code append to file`))
  myEmitter.emit('codeReceived')
  })

  server.listen(2112, () => {
    console.log('opened server on', server.address().port)
  })
