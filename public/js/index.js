var socket = io();
socket.on('connect',function (){
    console.log('connected to the server')

   
})
socket.on('disconnect',function (){
    console.log('disconnected from the server')
})

socket.on('newMessage', function (message) {
    console.log('new Message',message)
})


socket.emit('createMessage',{
    from :'julie',
    text : 'some text'
}, function (data){
console.log('Got it ',data)
})
