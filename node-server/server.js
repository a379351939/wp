var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

function parseBody(body){
  var obj = {}
  body.split('&').forEach(function(str){
    obj[str.split('=')[0]] = str.split('=')[1]
  })
  return obj
}

function sampleRoot(req, res){

  var pathObj = url.parse(req.url, true)

  if(pathObj.pathname === '/') {
    pathObj.pathname += 'index.html'
  }

  var filePath = path.join(__dirname, 'sample', pathObj.pathname)
  
  fs.readFile(filePath, function(err, fileContent){
    if(err){
      console.log('404')
      res.writeHead(404, 'not found')
      res.end('<h1>404 Not Found</h1>')
    }else{
      console.log('ok')
      res.writeHead(200, 'OK')
      res.write(fileContent, 'binary')
      res.end()      
    }
  })
}

var routes = {
  '/getWeather': function(req, res){
    var pathObj = url.parse(req.url, true)
    var ret 
    if(pathObj.query.city == 'beijing') {
      ret = {
        city: 'beijing',
        weather: 'sunny'
      }
    }else{
      ret = {
        city: pathObj.query.city,
        weather:'can not get'
      }
    }
    res.end(JSON.stringify(ret))
  },

  '/login': function(req, res) {
    res.end('username=' + req.body.username + ',password=' + req.body.password)
  },

  '/register': function(req, res) {
    res.end('username=' + req.body.username + ',password=' + req.body.password)
  }
}

function routePath(req, res) {
  var pathObj = url.parse(req.url, true)

  var handleFn = routes[pathObj.pathname]

  if(handleFn) {
    req.query = pathObj.query
    var body = ''
    req.on('data', function(chunk){
      body += chunk
    }).on('end', function(){
      req.body = parseBody(body)
      handleFn(req, res)
    })
  } else {
    sampleRoot(req, res)
  }

}


var server = http.createServer(function(req, res){
  routePath(req, res) 
})

server.listen(8080)
console.log('visit http://localhost:8080')