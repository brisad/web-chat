var userName = "Guest" + parseInt(Math.random() * 10);

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function () {
  // Add handler for performing clean up at exit
  $(window).bind("beforeunload", function() {
    socket.emit('unregister', userName);
    socket.disconnect();
  });

  socket.emit('register', userName);
});

socket.on('registered', function (success) {
  console.log("Registered: " + success);
});
