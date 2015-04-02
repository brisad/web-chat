var username = "Guest" + parseInt(Math.random() * 10);
var registered = false;

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function () {
  // Add handler for performing clean up at exit
  $(window).bind("beforeunload", function() {
    if (registered) {
      socket.emit('unregister', username);
    }
    socket.disconnect();
  });

  socket.emit('register', username);
});

socket.on('registered', function (success) {
  console.log("Registered: " + success);
  registered = success;
});
