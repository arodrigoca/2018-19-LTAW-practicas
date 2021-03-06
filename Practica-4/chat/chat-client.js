function main() {
  //console.log("Hola!!!!");
  var socket = io(); //create websocket
  var send = document.getElementById('send');
  var display = document.getElementById('display');
  var msg = document.getElementById('msg');
  var msgs_on_screen = 0;

  msg.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("send").click();
  }
});

  send.onclick = ()=> {
      if(msg.value != "" && msg.value != " "){
        socket.emit('new_message', msg.value);
        //document.getElementById('msg').innerHTML.value = "";
        document.getElementById('msg').value = "";
        console.log('message emitted');
      }
  }

  socket.on('new_message', msg => { //when a new message is received, print it in display element
    if(msgs_on_screen <= 15){ //clean message window if there is too much messages
     display.innerHTML = display.innerHTML + '<li>' + msg + '</li>';
     msgs_on_screen = msgs_on_screen + 1;
     //console.log(msgs_on_screen);
   }else{
     display.innerHTML = '<li>' + msg + '<li>';
     msgs_on_screen = 0;
   }

   });

   socket.on('server_message', msg =>{                      //on server message
     display.innerHTML = display.innerHTML + '<li style="color: #0900C4">' + msg + '</li>';
     msgs_on_screen = msgs_on_screen + 1;
   });

}
