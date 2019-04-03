const express = require('express')
const app = express()
const http = require('http').Server(app);
var io = require('socket.io')(http);

var user_number = 0;

//-- Puerto donde lanzar el servidor
const PORT = 8080

var user_db = {}

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
  var random = Math.floor(Math.random() * 9999) + 1;
  random = random.toString()
  var user_name = 'User' + random;
  var user_id = socket.id;
  //console.log(user_cookie);
  user_db[user_id] = user_name;
  socket.emit('server_message', 'SERVER MESSAGE: ' + 'Welcome to the chat, ' + user_name);
  console.log("Sent user welcome message");
  io.emit('server_message', 'SERVER MESSAGE: ' + user_name + ' connected to the chat'); //io.emit means broadcast. socket.emit is unicast

  socket.on('disconnect', function(){
    var user_id = socket.id
    var user_name = user_db[user_id]                 //on disconnect event
    console.log('--> User disconnected from your channel');
    io.emit('server_message', 'SERVER MESSAGE: ' + user_name + ' left the chat');
    delete user_db[user_id];
    user_number = user_number - 1;
  });

  socket.on('new_message', msg => {                        //on new message event
   console.log("Message received: " + msg);
   if(msg[0] == '/'){
       switch(msg){

           case '/help':
            socket.emit('server_message', 'SERVER MESSAGE: Commands: /help, /list, /hello, /date');
            break;

           case '/list':
            let html_data = "SERVER MESSAGE: User list: " + user_number + ". ";
            let user_list = [];
            for(user in user_db){
              user_list.push(user_db[user]);
            }
            html_data += user_list
            socket.emit('server_message', html_data);
            break;

           case '/hello':
            socket.emit('server_message', 'SERVER MESSAGE: Hello! Ping to server was successful.');
            break;

           case '/date':
            console.log('/date');
            var date = new Date();
            socket.emit('server_message', 'SERVER MESSAGE: ' + date);
            break;

           default:
            socket.emit('server_message', 'SERVER MESSAGE: I don´t know that command...yet!');
       }
   }else{
       var user_id = socket.id
       var user_name = user_db[user_id]
       io.emit('new_message', user_name + ': ' + msg);
   }

});

});
