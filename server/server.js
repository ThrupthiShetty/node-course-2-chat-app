
const path = require("path");// to specify folders  path
const express = require('express')
const app = express();
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const http = require('http')
const socketIo = require('socket.io')
var server = http.createServer(app)
var io = socketIo(server)

console.log(__dirname)
console.log(publicPath)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New user connected')

   

    socket.on('join', function (params, callback) {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback("Name and room are required")
        }

        socket.join(params.room);
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'New user joined'))
        callback()
    })



    socket.on('createMessage', function (message, callback) {
        console.log('create message', message)
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
        // socket.broadcast.emit('newMessage',{
        //          from : message.from,
        //          text : message.text,
        //          createdAt : new Date().getTime()
        //      })
    })

    socket.on('createLocationMessage', (coords) => {
        console.log('location is ', coords)
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))

    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    });

})

server.listen(port, (req, res) => {
    console.log('Server is up and running on ', port)
})
