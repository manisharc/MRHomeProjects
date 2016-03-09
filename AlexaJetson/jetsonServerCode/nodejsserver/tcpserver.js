var net = require('net');
var fs = require('fs');
fs.writeFile('/sys/class/gpio/export', '57', function(err) {
   if(err) {
      console.log(err);
   }
});

fs.writeFile('/sys/class/gpio/gpio57/direction', 'out', function(err) {
   if(err) {
      console.log(err);
   }
});

var HOST = '0.0.0.0';
var PORT = fs.readFileSync('port.txt').toString("utf-8",0,4);

   //  Create a server instance, and chain the listen function to it
   // The function passed to net.createServer() becomes the event handler for the 'connection' event
   // The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
     
  // We have a connection - a socket object is assigned to the connection automatically
  console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
  // Add a 'data' event handler to this instance of socket
  sock.on('data', function(data) {

  fs.writeFile('/sys/class/gpio/gpio57/value', data, function(err) {
     if(err) {
        return console.log(err);
     }
  });

    console.log('DATA ' + sock.remoteAddress + ': ' + data);
    // Write the data back to the socket, the client will receive it as data from the server
    sock.write('You said "' + data + '"');
         
  });
     
  // Add a 'close' event handler to this instance of socket
  sock.on('close', function(data) {
    console.log('CLOSED');
  });
     
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
