var http = require('http');
var fs = require('fs');
var url = require('url');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

console.log('Starting server...');
server = http.createServer(request_handler);
server.listen(8080);

function  send_response(req, res){

    var q = url.parse(req.url, true); //retrieve url
    var filename = "static" + q.pathname;  //retrieve filename
    var qdata = q.query; //for future use

    var cookie = req.headers.cookie;
    if(!cookie){
        console.log("User doesn´t have cookies");
        var user_logged = false;
    }else{
        console.log("User has cookies");
        var user_logged = true;
    }

    var is_buy = filename.includes("buy");
    var is_cart = filename.includes("shopping_cart.html");
    var is_remove = filename.includes("empty_cart.html");

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
