var http = require('http');
var fs = require('fs');
var url = require('url');

console.log('Starting server...');
server = http.createServer(request_handler);
server.listen(8080);

function  send_response(req, res){

    var q = url.parse(req.url, true); //retrieve url
    var filename = "." + q.pathname;  //retrieve filename

    fs.readFile(filename, 'utf8', (err, data) => {
        if(err == null){
            console.log('client requested resource:', filename, ' and it was found');
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();

        }else{
            console.log('client requested resource:', filename, ' but cannot be found');
            res.writeHead(404, {'Content-Type': 'text/html'});
        }
    });
}

function request_handler(req, res){
    console.log('Petition received');
    send_response(req, res);
}
