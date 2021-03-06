var socket = io();

function scrolltoBottom (){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')

    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight  = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=scrollHeight){
        console.log("scroll down")
        messages.scrollTop(scrollHeight)

    }

}


socket.on('connect', function () {
    console.log('connected to the server')
    var params = jQuery.deparam(window.location.search)

    socket.emit('join',params,function(err){
        if(err){
            alert(err)
            window.location.href ='/'
        }
        else{
            console.log('No error')
        }
    })


})
socket.on('disconnect', function () {
    console.log('disconnected from the server')
    
})

socket.on('updateUserList',function(users){
    console.log('users list',users)
    var ol = jQuery('<ol></ol>')
    users.forEach(function (user){
        ol.append(jQuery('<li></li>').text(user))
    })
    jQuery('#users').html(ol)

})

socket.on('newMessage', function (message) {
     var formattedTime = moment(message.createdAt).format('h:mm a')
    // console.log('new Message', message)
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}:${message.text}`)
    // jQuery('#messages').append(li)

    var template = jQuery('#message-template').html() //retrieve the contents inside this id
    var html = Mustache.render(template,{
        text : message.text,
        from : message.from,
        createdAt : formattedTime
    })
    //console.log(template)
    jQuery('#messages').append(html)
    scrolltoBottom();

})

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')

    // var li = jQuery('<li></li>')
    // var a = jQuery('<a target="_blank">My current location</a>')
    // li.text(`${message.from} ${formattedTime} :`)
    // a.attr('href', message.url)
    // li.append(a)

    var template = jQuery('#location-message-template').html()
    var html = Mustache.render(template,{
        from : message.from,
        url:message.url,
        createdAt : formattedTime
    })
    jQuery('#messages').append(html)
    scrolltoBottom();
})

// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi'
// }, function (data) {
//     console.log('Got it ', data)
// })

jQuery('#message-form').on('submit', function (e) {

    var messageTextBox = jQuery('[name=message]');
    e.preventDefault();
    socket.emit('createMessage', {
        
        text: messageTextBox.val()
    }, function (data) {
        console.log('I got the messafe', data)
        messageTextBox.val('')

    })

})

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }
    locationButton.attr('disabled', 'disabled').text('Sending location')
    navigator.geolocation.getCurrentPosition(
        function (position) {
            console.log(position)
            locationButton.removeAttr('disabled', 'disabled').text('Send location')
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        },
        function () {
            locationButton.removeAttr('disabled', 'disabled').text('Send location')
            alert('unable to fetch location')
        })
})