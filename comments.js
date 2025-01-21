// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var comments = [];
var server = http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true);
  if (urlObj.pathname === '/') {
    fs.readFile('./index.html', function (err, data) {
      if (err) {
        res.writeHead(404, 'Not Found');
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(200, 'OK');
        res.end(data);
      }
    });
  } else if (urlObj.pathname === '/comments') {
    if (req.method === 'GET') {
      var qsObj = urlObj.query;
      if (qsObj.start) {
        var start = parseInt(qsObj.start);
        var end = parseInt(qsObj.end);
        var returnComments = comments.slice(start, end);
        res.end(JSON.stringify(returnComments));
      } else {
        res.end(JSON.stringify(comments));
      }
    } else if (req.method === 'POST') {
      var str = '';
      req.on('data', function (data) {
        str += data;
      });
      req.on('end', function () {
        var comment = qs.parse(str);
        comment.time = new Date();
        comments.push(comment);
        res.end(JSON.stringify(comment));
      });
    }
  } else {
    fs.readFile('.' + urlObj.pathname, function (err, data) {
      if (err) {
        res.writeHead(404, 'Not Found');
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(200, 'OK');
        res.end(data);
      }
    });
  }
});
server.listen(8080);
console.log('server is listening on 8080'); 
 1.  Create a web server with the  http  module 
 2.  Read the file  index.html  in the root directory 
 3.  If the request URL is  /comments , the server will return the JSON data of the comments array 
 4.  If the request method is  GET , the server will return all comments if there is no query string. If there is a query string, the server will return comments from the start to the end