const http = require('http');
const url = require('url');
const generate = require('./modules/index.js');

http
  .createServer(function(request, response) {
    try {
      const pathName = url.parse(request.url).pathname;
      if (pathName === '/createFile') {
        let data = '';
        request.on('data', chunk => {
          data += chunk;
          generate.generateCodeHandle(JSON.parse(data));
          response.writeHead(200, { 'Content-Type': 'text/plain' });
          response.write('successful');
          response.end();
        });
      }
    } catch (e) {
      console.log(e);
    }
  })
  .listen(9229);

// chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/782cb769-a764-4329-9369-6ca52d60a82a
