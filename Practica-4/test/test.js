const express = require('express')
const app = express()
const http = require('http').Server(app);
var io = require('socket.io')(http);

//-- Puerto donde lanzar el servidor
const PORT = 8080

//-- Punto de entrada pricipal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  console.log('User requested index.html');
})

app.get('/chat-client.js', function(req, res){
  res.sendFile(__dirname + '/chat-client.js');
  console.log("js requested")
});


app.get('/wololo', (req, res) => {
  res.send('You have been converted to another religion!')
  console.log("Access to /wololo")
})

//-- Lanzar servidor
http.listen(PORT, function(){
  console.log('Launched server on port ' + PORT);
});

io.on('connection', function(socket){
  console.log('--> User connected on your channel!');

  socket.on('disconnect', function(){                      //on disconnect event
    console.log('--> User disconnected from your channel');
  });

  socket.on('new_message', msg => {                        //on new message event
   console.log("Message received: " + msg);
   io.emit('new_message', msg);
})

});
