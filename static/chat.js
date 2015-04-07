var UserList = React.createClass({
  render: function () {
    // Users are passed as children in an array.  Map it to an array
    // of list items.
    var users = this.props.children.map(function (user) {
      return (<li>{user}</li>);
    });
    return (<div><ul>{users}</ul></div>);
  }
});

var ChatMessages = React.createClass({
  render: function () {
    // Messages are passed as children in an array.  Map it to an
    // array of list items.
    var messages = this.props.children.map(function (message) {
      return (<li>{message}</li>);
    });
    return (<ul id="messages">{messages}</ul>);
  }
});

var InputForm = React.createClass({

  sendMessage: function () {
    var input = React.findDOMNode(this.refs.text);
    var message = input.value.trim();
    if (!message) {
      return;
    }
    input.value = '';

    // Send it
  },

  handleKeyPress: function (e) {
    // Send message if return key pressed
    if (e.which == 13) {
      this.sendMessage();
    }
  },

  handleButtonClick: function () {
    this.sendMessage();
  },

  render: function () {
    return (
      <div id="inputForm">
        <div id="inputWrapper">
          <input type="text" ref="text" onKeyPress={this.handleKeyPress} />
        </div>
        <button onClick={this.handleButtonClick}>Send</button>
      </div>
    );
  }
});

var Chat = (function () {

  // All users and messages shown in UI
  var users = [];
  var messages = [];

  // Render chat UI with React.  This function needs to be called in
  // order for any update to be shown.
  var render = function () {
    React.render(
      <div>
        <h1>Chat</h1>
        <UserList>
          {users}
        </UserList>
        <ChatMessages>
          {messages}
        </ChatMessages>
        <InputForm />
        </div>,
      document.body
    );
  }

  var setUsers = function (newUsers) {
    users = newUsers;
    render();
  }

  var addMessage = function (newMessage) {
    messages.push(newMessage);
    render();
  }

  var connectToServer = function () {
    var connected = $.Deferred();
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', function () {
      // Make sure to disconnect before unloading
      $(window).bind('beforeunload', function () {
        socket.disconnect();
      });
      connected.resolve(socket);
    });

    return connected.promise();
  }

  var register = function (socket, username) {
    var registered = $.Deferred();

    socket.emit('register', username);
    socket.on('registered', function (success) {

      if (!success) {
        registered.reject();
        return;
      }

      // Replace the previous handler for disconnecting with a new one
      // that also unregisters us from the chat
      $(window).unbind('beforeunload');
      $(window).bind('beforeunload', function () {
        socket.emit('unregister', username);
        socket.disconnect();
      });
      registered.resolve();
    });

    return registered.promise();
  }

  var listenForMessages = function (socket) {

    socket.on('user enter', function (data) {
      var username = data.username;
      var userlist = data.userlist;
      setUsers(userlist);
      addMessage(username + ' entered');
    });

    socket.on('user leave', function (data) {
      var username = data.username;
      var userlist = data.userlist;
      setUsers(userlist);
      addMessage(username + ' left');
    });
  }

  return {
    init: function () {
      username = "Guest" + parseInt(Math.random() * 10);
      console.log("You are " + username);

      connectToServer().then(function (socket) {

        register(socket, username).then(
          function () {
            console.log("Register success!")
            listenForMessages(socket);
          },
          function () {
            console.log("Register fail!");
          }
        );
      });
    }
  };
})();

Chat.init();
