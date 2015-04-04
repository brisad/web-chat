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
  render: function () {
    return (
      <div id="inputForm">
        <div id="inputWrapper">
          <input type="text"></input>
        </div>
        <button>Send</button>
      </div>
    );
  }
});

var Chat = (function () {

  // All users and messages shown in UI
  var _users = [];
  var _messages = [];

  // Render chat UI with React.  This function needs to be called in
  // order for any update to be shown.
  var render = function () {
    React.render(
      <div>
        <h1>Chat</h1>
        <UserList>
          {_users}
        </UserList>
        <ChatMessages>
          {_messages}
        </ChatMessages>
        <InputForm />
        </div>,
      document.body
    );
  }

  // Render the empty UI at init
  render();

  // Public functions
  return {
    setUsers: function (users) {
      _users = users;
      render();
    },

    addMessage: function (message) {
      _messages.push(message);
      render();
    },
  };
})();
