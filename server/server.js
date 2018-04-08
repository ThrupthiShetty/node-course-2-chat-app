
const path = require("path");// to specify folders  path
const express = require('express')
const app = express();
const publicPath = path.join(__dirname,'../public')
const port = process.env.PORT || 3000;

const http = require('http')
const socketIo = require('socket.io')
var server = http.createServer(app)
var io = socketIo(server)

console.log(__dirname)
console.log(publicPath)

app.use(express.static(publicPath))

io.on('connection',(socket) =>{
    console.log('New user connected')

    socket.on('disconnect',()=>{
        console.log('User disconnected')
    });
})

server.listen(port,(req,res) =>{
    console.log('Server is up and running on ',port)
})
