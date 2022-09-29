const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const echoProto = protoLoader.loadSync('echo.proto', {})
const echoDefinition = grpc.loadPackageDefinition(echoProto)

const { echoPackage } = echoDefinition
const serverURL = 'localhost:5500'

//* Function/Methods
function EchoUnary (call, callback) {
  console.log('data', call.request)
  callback(null, call)
}
function EchoClientStream (call, callback) {
  call.on('data', data => {
    console.log('Server : ', data)
  })
  callback.on('end', err => {
    console.log('Stream finished')
    console.log(err)
  })
}

function EchoServerStream (call, callback) {
  for (let index = 0; index < 10; index++) {
    call.write({ value: index })
  }
  call.on('end', err => {
    console.log(err)
  })
}
function dateTime (call, callback) {}

//* Lunch Server
const server = new grpc.Server()
server.addService(echoPackage.EchoService.service, {
  EchoUnary,
  EchoClientStream,
  EchoServerStream,
  dateTime
})
server.bind(serverURL, grpc.ServerCredentials.createInsecure())
console.log('Running over localhost:5500')
server.start()
