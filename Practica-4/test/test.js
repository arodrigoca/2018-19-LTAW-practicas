const express = require('express')
const app = express()
const http = require('http').Server(app);
var io = require('socket.io')(http);

var user_number = 0;

//-- Puerto donde lanzar el servidor
const PORT = 8080

//-- Punto de entrada pricipal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  //console.log('User requested index.html');
})

app.get('/chat-client.js', function(req, res){
  res.sendFile(__dirname + '/chat-client.js');
  //console.log("js requested")
});


app.get('/wololo', (req, res) => {
  res.send('You have been converted to another religion!')
  //console.log("Access to /wololo")
})

//-- Lanzar servidor
http.listen(PORT, function(){
  console.log('Launched server on port ' + PORT);
});

io.on('connection', function(socket){
  console.log('--> User connected on your channel!');
  user_number = user_number + 1;
  socket.emit('new_message', 'Welcome to the chat, user');
  io.emit('new_message', 'new user connected to the chat'); //io.emit means broadcast. socket.emit is unicast

  socket.on('disconnect', function(){                      //on disconnect event
    console.log('--> User disconnected from your channel');
    io.emit('new_message', 'an user left the chat');
    user_number = user_number - 1;
  });

  socket.on('new_message', msg => {                        //on new message event
   console.log("Message received: " + msg);
   if(msg[0] == '/'){
       switch(msg){

           case '/help':
            socket.emit('new_message', 'SERVER MESSAGE: Commands: /help, /list, /hello, /date');
            break;

           case '/list':
            socket.emit('new_message', 'SERVER MESSAGE: User list: ' + user_number);
            break;

           case '/hello':
            socket.emit('new_message', 'SERVER MESSAGE: Hello! Ping to server was successful.');
            break;

           case '/date':
            console.log('/date');
            var date = new Date();
            socket.emit('new_message', 'SERVER MESSAGE: ' + date);
            break;

           default:
            socket.emit('new_message', 'SERVER MESSAGE: I don´t know that command...yet!');
       }
   }else{
       io.emit('new_message', msg);
   }

});

});
