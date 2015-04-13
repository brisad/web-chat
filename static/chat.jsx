var Login = React.createClass({
  login: function () {
    var username = React.findDOMNode(this.refs.username).value.trim();
    if (username) {
      this.props.onLogin(username);
    }
  },

  handleButtonClick: function () {
    this.login();
  },

  handleKeyPress: function (e) {
    // Login if return key pressed
    if (e.which == 13) {
      this.login();
    }
  },

  render: function () {
    return (
      <div>
        <h1>What is your name?</h1>
        <input type="text" ref="username" onKeyPress={this.handleKeyPress} autoFocus={true} />
        <button onClick={this.handleButtonClick}>Log in</button>
      </div>
    )
  }
});

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
  },

  componentWillUpdate: function () {
    // After update we should scroll to bottom only if it already is
    // at the bottom now
    var el = this.getDOMNode();
    this.shouldScroll = el.scrollTop + el.clientHeight == el.scrollHeight;
  },

  componentDidUpdate: function () {
    var el = this.getDOMNode();
    if (this.shouldScroll) {
      el.scrollTop = el.scrollHeight;
    }
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

    this.props.onSend(message);
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
          <input type="text" ref="text" onKeyPress={this.handleKeyPress} autoFocus={true} />
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
  var renderChatUI = function () {
    React.render(
      <div>
        <h1>Chat</h1>
        <UserList>
          {users}
        </UserList>
        <ChatMessages>
          {messages}
        </ChatMessages>
        <InputForm onSend={sendMessage} />
        </div>,
      document.body
    );
  }

  var renderLoginForm = function () {
    React.render(<Login onLogin={attemptRegister} />, document.body);
  }

  // Placeholder functions.  The real functions are defined after a
  // connection has been established and when we've registered with
  // the server.
  var attemptRegister = function (username) {
    alert("Not ready");
  }

  var sendMessage = function (message) {
    alert("Not ready");
  }

  var setUsers = function (newUsers) {
    users = newUsers;
    renderChatUI();
  }

  var addMessage = function (newMessage) {
    messages.push(newMessage);
    renderChatUI();
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

    socket.on('message', function (data) {
      var from = data.from;
      var message = data.message;
      addMessage(from + ': ' + message);
    });
  }

  return {
    init: function () {

      connectToServer().then(function (socket) {
        console.log("Connected to server");

        attemptRegister = function (username) {
          register(socket, username).then(
            function () {
              listenForMessages(socket);

              sendMessage = function (message) {
                socket.emit('message', {'from': username, 'message': message});
              }
            },
            function () {
              alert("Username already in use.");
            }
          );
        };

        renderLoginForm();

      });
    }
  };
})();

Chat.init();
