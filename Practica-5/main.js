const electron = require('electron')
var ipcMain = electron.ipcMain;

const io = require('socket.io-client');

var ip_server_address = "";

//console.log("Arrancando electron...")

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función

electron.app.on('ready', ()=>{
  //console.log("Evento Ready!")

  // Crear la ventana principal de nuestra Interfaz Gráfica
  ip_window = new electron.BrowserWindow({
      width: 800,
      height: 400
  });

  ip_window.setResizable(false);

  //-------------------------------------------execute only when ip is known


ip_window.loadFile('connect_page.html');

ipcMain.on('ip_add_msg', (event,payload) =>{
  ip_server_address = payload;
  ip_window.close();
});


ip_window.on('close', function(){

//--------------------------------------------chat window
  win = new electron.BrowserWindow({
    width: 800,
    height: 600
  });

  win.setResizable(false);

  win.loadFile('index.html');

  win.webContents.once('dom-ready', () => {

    var socket = io(ip_server_address, {transports: ['websocket']});

    socket.on('server_message', msg =>{                      //on server message

      //ipcMain.send('new_message', msg);
      console.log(msg)
      win.webContents.send('server_message', msg);

    });

    socket.on('new_message', msg => { //when a new message is received, print it in display element

      //ipcMain.send('new_message', msg);
      win.webContents.send('new_message', msg);

     });

     ipcMain.on('send_chat_msg', (event,payload) =>{
       socket.emit('new_message', payload);
     });

  });

});

});
