var UserList = React.createClass({
  render: function () {
    return (
      <div>
        <ul>
          <li>User 1</li>
          <li>User 2</li>
        </ul>
      </div>
    );
  }
});

var ChatMessages = React.createClass({
  render: function () {
    return (
      <ul id="messages">
        <li>User 1: Chat message 1</li>
        <li>User 2: Chat message 2</li>
      </ul>
    );
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

React.render(
  <div>
    <h1>Chat</h1>
    <UserList />
    <ChatMessages />
    <InputForm />
  </div>,
  document.body
);
