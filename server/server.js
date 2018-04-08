
const path = require("path");// to specify folders  path
const express = require('express')
const app = express();
const publicPath = path.join(__dirname,'../public')
const port = process.env.PORT || 3000;

const {generateMessage} = require('./utils/message')
const http = require('http')
const socketIo = require('socket.io')
var server = http.createServer(app)
var io = socketIo(server)

console.log(__dirname)
console.log(publicPath)

app.use(express.static(publicPath))

io.on('connection',(socket) =>{
    console.log('New user connected')

    socket.emit('newMessage',generateMessage('Admin','Welcome to chat app'))
    socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined')) 

   socket.on('createMessage', function (message) {
    console.log('create message',message)
    io.emit('newMessage',generateMessage(message.from,message.text));
    // socket.broadcast.emit('newMessage',{
    //          from : message.from,
    //          text : message.text,
    //          createdAt : new Date().getTime()
    //      })
})

    socket.on('disconnect',()=>{
        console.log('User disconnected')
    });

})

server.listen(port,(req,res) =>{
    console.log('Server is up and running on ',port)
})
