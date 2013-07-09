var fs = require ('fs');
var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.write('Debug: reached 0');
	fs.readFile('./index.html', 'utf8', function (err,data) {
  response.write('Debug: reached 1');
	  if (err) {
            response.write("Error occured...");
	    return console.log(err);
	  }
	  response.write(data);
	});
  response.write('Debug: reached 2');
response.close();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
