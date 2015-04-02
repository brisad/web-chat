var username = "Guest" + parseInt(Math.random() * 10);
var registered = false;

console.log("You are " + username);

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function () {
  // Add handler for performing clean up at exit
  $(window).bind('beforeunload', function() {
    if (registered) {
      socket.emit('unregister', username);
    }
    socket.disconnect();
  });

  socket.emit('register', username);
});

socket.on('registered', function (success) {
  console.log('Registered: ' + success);
  registered = success;
});

socket.on('user enter', function (data) {
  var username = data.username;
  var userlist = data.userlist;
  console.log('Entered: ' + username + ' Userlist: ' + userlist);
});

socket.on('user leave', function (data) {
  var username = data.username;
  var userlist = data.userlist;
  console.log('Left: ' + username + ' Userlist: ' + userlist);
});
