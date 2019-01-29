var http = require('http');
var fs = require('fs');

console.log("Arrancando servidor...")

function switchRes(req, res){
    if(req.url == '/document1'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("you have requested document 1");
        res.end();
    }else if (req.url == "/document2") {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("you have requested document 2");
        res.end();

    }else{

        fs.readFile(req.url.substr(1), function(err, data) {

            if(err == null){
                //found
                console.log('Resource found!');
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }else{
                //not found
                console.log('Resource not found');
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.write("Error 404. Recurso no encontrado");
                res.end();
            }
        });

    }


}


http.createServer(function (req, res) {  //req returns the client request as an object. URL returns the requested URL
  //res.write(req.url); //writes the requested resource
  switchRes(req, res);
  console.log("Petition attended")
}).listen(8080);
