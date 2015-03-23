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
      <ul>
        <li>User 1: Chat message 1</li>
        <li>User 2: Chat message 2</li>
      </ul>
    );
  }
});

var InputBox = React.createClass({
  render: function () {
    return (
      <input type="text"></input>
    );
  }
});

var SendButton = React.createClass({
  render: function () {
    return (
      <button>Send</button>
    );
  }
});

React.render(
  <div>
    <h1>Chat</h1>
    <UserList />
    <ChatMessages />
    <InputBox />
    <SendButton />
  </div>,
  document.getElementById('content')
);
