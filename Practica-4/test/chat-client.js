function main() {
  //console.log("Hola!!!!");
  var socket = io(); //create websocket
  var send = document.getElementById('send');
  var display = document.getElementById('display');
  var msg = document.getElementById('msg');

  msg.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("send").click();
  }
});

  send.onclick = ()=> {
      socket.emit('new_message', msg.value);
      document.getElementById('msg').innerHTML.value = "";
      console.log('message emitted');
  }

  socket.on('new_message', msg => { //when a new message is received, print it in display element
     display.innerHTML = display.innerHTML + msg + '<br>';
   });

}
