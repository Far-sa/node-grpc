const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const echoProto = protoLoader.loadSync('echo.proto', {})
const echoDefinition = grpc.loadPackageDefinition(echoProto)

const { echoPackage } = echoDefinition
const serverURL = 'localhost:5500'

function EchoUnary (call, callback) {}
function EchoClientStream (call, callback) {}
function EchoServerStream (call, callback) {}
function EchoBidiStream (call, callback) {}

const server = new grpc.Server()
server.addService(echoPackage.EchoService.service, {
  EchoUnary,
  EchoClientStream,
  EchoServerStream,
  EchoBidiStream
})
server.bind(serverURL, grpc.ServerCredentials.createInsecure())
console.log('Running over localhost:5500')
server.start()
