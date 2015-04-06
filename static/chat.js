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

  var username;
  var registered = false;

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

  var setupSocketEvents = function (socket) {
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

      var socket = io.connect('http://' + document.domain + ':' + location.port);
      setupSocketEvents(socket);
    }
  };
})();

Chat.init();
