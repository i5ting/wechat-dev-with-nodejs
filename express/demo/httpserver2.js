var http = require('http');

http.createServer(function(req, res){
    console.log(req);
    
    if(req.url =='/'){
      res.end('Hello world!');
    }else if(req.url =='/2'){
      res.end('Hello world!2');
    }else{
      res.end('Hello world! other');
    }
}).listen(8888);