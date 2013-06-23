var express = require('express');
var app = express();
var server = require('http').createServer(app);

server.listen(process.env.PORT || 8000);

app.configure(function() {
  app.use(express.static(__dirname));
});

app.get('/', function(request, response) {
  response.sendfile(__dirname + 'index.html');
});
