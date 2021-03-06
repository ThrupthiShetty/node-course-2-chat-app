
const path = require("path");// to specify folders  path
const express = require('express')
const app = express();
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

const {Users} = require('./utils/users')
const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const http = require('http')
const socketIo = require('socket.io')
var server = http.createServer(app)
var io = socketIo(server)
var users = new Users();

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
        users.removeUser(socket.id)
        users.addUser(socket.id,params.name,params.room)
        io.to(params.room).emit('updateUserList',users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`))
        callback()
    })



    socket.on('createMessage', function (message, callback) {
        console.log('create message', message)

        var user = users.getUser(socket.id)

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback('This is from the server');
        // socket.broadcast.emit('newMessage',{
        //          from : message.from,
        //          text : message.text,
        //          createdAt : new Date().getTime()
        //      })
    })

    socket.on('createLocationMessage', (coords) => {
        console.log('location is ', coords)
        var user = users.getUser(socket.id)
       if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))

        }

    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
        var user = users.removeUser(socket.id)
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room))
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`))

        }
    });

})

server.listen(port, (req, res) => {
    console.log('Server is up and running on ', port)
})
