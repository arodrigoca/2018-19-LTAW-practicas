var http = require('http');
var fs = require('fs');
var url = require('url');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4',
   'js'   : 'text/javascript'
};

var products_database = {  //poor man´s database
    '0' : ['arduinouno', 'arduino_uno.html'],
    '1' : ['arduinomega', 'arduino_mega.html'],
    '2' : ['arduinopromini', 'arduino_pro_mini.html'],
    '3' : ['raspberrypizerow', 'rpizw.html'],
    '4' : ['raspberrypi3b', 'rpi3.html']
};

console.log('Starting server...');
server = http.createServer(request_handler);
server.listen(8080);

function  send_response(req, res){

    var q = url.parse(req.url, true); //retrieve url
    var filename = "static" + q.pathname;  //retrieve filename
    //console.log(filename)
    var qdata = q.query; //for future use

    var cookie = req.headers.cookie;
    if(!cookie){
        //console.log("User doesn´t have cookies");
        var user_logged = false;
    }else{
        if(cookie.includes('cart_item') == true && cookie.includes('user') == true){
            //console.log("User has cookies");
            var user_logged = true;
        }else{
            var user_logged = false;
        }
    }
    console.log(user_logged);

    var is_buy = filename.includes("buy");
    var is_cart = filename.includes("shopping_cart.html");
    var is_remove = filename.includes("empty_cart.html");
    var is_search = filename.includes("search_item");
    var is_search_bar = filename.includes("items_query");
    //console.log(is_search_bar);

    if(is_buy && user_logged){
      product_list = cookie.split(";");
      product_list = product_list[1].substr(1);
      indx = product_list.indexOf("&");
      product_list = product_list.substr(indx);
      product_name = filename.split("static/");
      product_name = product_name[1].split(".html");
      product_name = product_name[0].split("_");
      product_name = product_name[1];

      res.setHeader('Set-Cookie', 'cart_item=' + product_list + '&' + product_name);
      res.setHeader('Content-Type', 'text/html');
      res.write(`You bought this item. <a href="index.html">Back to main page</a>`);
      res.end();

    }else if(is_cart && user_logged){

      product_list = cookie.split(";");
      if(product_list[1] != undefined){
        product_list = product_list[1].substr(1);
        product_list = product_list.split("&");
        product_list.splice(0, 1);
        var activate = true;
      }

      res.setHeader('Content-Type', 'text/html');

      content = `<html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="styleA.css">
      </head>
      <body>
      <h1 id="title">Shopping Cart</h1>
      <p style="color:white;">Item list:</p>`;
      if(activate == true){
        for (i = 0; i < product_list.length; i++) {
          content = content + `<li style="color:white;">` + product_list[i] + `</li>`;
        }
      }

      content = content +

      `
      <div>
          <a id="empty" href="empty_cart.html">Empty shopping cart</a>
      </div>
      <div>
          <a href="index.html">Go to main page</a>
      </div>

      </body>
      </html>`;
      console.log(content);

      res.write(content);
      res.end();

    }else if(is_remove && user_logged){
      var content = `Shopping cart is now empty. <a href="index.html">Back to main page</a>`
      res.setHeader('Set-Cookie', 'cart_item=');
      res.setHeader('Content-Type', 'text/html');
      res.write(content);
      res.end();

    }else if(is_search){ //search by string
        let query = filename.split("=");
        let found_items = {};
        query = query[1];
        //console.log("user wants to search by: " + query);
        for(var i = 0; i < Object.keys(products_database).length; i++){
          if(products_database[i][0].includes(query)){
            found_items[i] = products_database[i][0];
          }
        }
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(found_items));
        res.end();

    }else if(is_search_bar){

      if (req.method === 'POST') {

        req.on('data', chunk => {
            //-- Leer los datos (convertir el buffer a cadena)
            data = chunk.toString('utf-8');
            data = data.split("=")[1];
         });

         req.on('end', ()=> {
           //-- Generar el mensaje de respuesta
           html_data = "<h3>Here are the items that match your search query:</h3>";
           let found_items = {};
           for(var i = 0; i < Object.keys(products_database).length; i++){
             if(products_database[i][0].includes(data)){
               found_items[i] = products_database[i];
             }
           }
           let item_link = ""
           for(item in found_items){
             item_link = "<a href='" + found_items[item][1] + "'>"
             html_data += '<li style="color:black">' + item_link + found_items[item][0] + '</a>' + '</li>';
           }
           html_data += "<br><a href='index.html'>Go back to main page</a>"
           res.setHeader('Content-Type', 'text/html');
           res.write(html_data);
           res.end();
         });
       }

    }else{


      fs.readFile(filename, (err, data) => {
          if(err == null){
              if(filename == "static/login.html"){
                  if(!cookie){
                      res.setHeader('Set-Cookie', ['user=user1', 'cart_item=']);
                      //res.setHeader('Set-Cookie', 'cart_item=');
                      res.setHeader('Content-Type', 'text/html');
                      res.write(data);
                      res.end();
                  }else{
                      var content = `You are already signed in. <a href="index.html">Back to main page</a>`;
                      res.setHeader('Content-Type', 'text/html');
                      res.write(content);
                      res.end();
                  }

              }else{
                  console.log('client requested resource:', filename, 'and it was found');
                  let mimeType =  mime[filename.split(".")[1]];
                  console.log(mimeType);
                  res.writeHead(200, {'Content-Type': mimeType});
                  res.write(data);
                  res.end();
              }

          }else{

              if(filename == "static/" || filename == ""){

                console.log("Client didn't request anything. Sending index");
                fs.readFile("static/index.html", 'utf8', (err,data)=>{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                });

              }else if(filename == "static/order_form" && user_logged){

                if (req.method === 'POST') {

                  req.on('data', chunk => {
                      //-- Leer los datos (convertir el buffer a cadena)
                      data = chunk.toString('utf-8');
                      data = data.split("&")
                      console.log("Datos recibidos: " + data)
                   });

                   req.on('end', ()=> {
                     //-- Generar el mensaje de respuesta
                     let product_list = cookie.split(";");
                     if(product_list[1] != undefined){
                       product_list = product_list[1].substr(1);
                       product_list = product_list.split("&");
                       product_list.splice(0, 1);
                     }
                     var html_data = ""
                     for(let i=0;i<data.length;i++){
                       html_data += "<li>" + data[i] + "</li>"
                     }
                     html_data += "<br><h3>This are the items you ordered:</h3>"
                     for(let i=0;i<product_list.length;i++){
                       html_data += "<li>" + product_list[i] + "</li>"
                     }
                     res.setHeader('Content-Type', 'text/html')
                     res.write("Your order has been received: " + "<br><br>" + html_data + "<br><a href='index.html'>Back to main page</a>");
                     res.end();
                     product_list = cookie.split(";");
                     if(product_list[1] != undefined){
                       product_list = product_list[1].substr(1);
                       product_list = product_list.split("&");
                       product_list.splice(0, 1);
                     }
                   });
                }

              }else{
                console.log('client requested resource:', filename, ' but cannot be found');
                res.writeHead(404, {'Content-Type': 'text/html'});
                content = `404 Error. Resource not found or you are not logged in. Please log-in on the main page. <a href="index.html">Back to main page</a>`;
                res.write(content);
                res.end(); // data, encoding, function to call when this is finished
              }
          }
          console.log('\n');
      });
    }
}

function request_handler(req, res){
    console.log('Petition received from:', req.connection.remoteAddress.substring(7));
    send_response(req, res);
}
