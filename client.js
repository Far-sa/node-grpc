const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const echoProto = protoLoader.loadSync('echo.proto', {})
const echoDefinition = grpc.loadPackageDefinition(echoProto)

const { echoPackage } = echoDefinition
const serverURL = 'localhost:5500'

const client = new echoPackage.EchoService(
  serverURL,
  grpc.credentials.createInsecure()
)

const echoData = { value: 'this is for test' }

client.EchoUnary(echoData, (err, response) => {
  if (err) console.log('Error:', err.message)
  console.log('Response :', response)
})

const serverStream = client.EchoServerStream()

serverStream.on('data', data => {
  console.log(data)
})
serverStream.on('end', err => {
  console.log(err)
})

const echos = [
  { value: 'value1' },
  { value: 'value2' },
  { value: 'value3' },
  { value: 'value4' }
]

const clientStream = client.EchoStream(null, (err, res) => {})

let index = 0
setInterval(() => {
  clientStream.write(echos[index])
  index++
  if (index === echos.length) {
    clearInterval(this)
    clientStream.end()
  }
}, 500)
