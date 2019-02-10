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
    var filename = "." + q.pathname;  //retrieve filename

    fs.readFile(filename, 'utf8', (err, data) => {
        if(err == null){
            console.log('client requested resource:', filename, 'and it was found');
            var extension = filename.split(".")[2];
            var mimeType = mime[extension];
            console.log(mimeType);
            res.writeHead(200, {'Content-Type': mimeType});
            res.write(data);
            res.end();

        }else{
            if(filename == "./" || filename == ""){
              console.log("Client didn't request anything. Sending index");
              fs.readFile("./index.html", 'utf8', (err,data)=>{
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
              });
            }else{
              console.log('client requested resource:', filename, ' but cannot be found');
              res.writeHead(404, {'Content-Type': 'text/html'});
              res.write('Error 404. Resource not found');
              res.end(); // data, encoding, function to call when this is finished
            }
        }
        console.log('\n');
    });
}

function request_handler(req, res){
    console.log('Petition received from:', req.connection.remoteAddress.substring(7));
    send_response(req, res);
}
