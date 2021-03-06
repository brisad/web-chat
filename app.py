from __future__ import print_function

from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'not so secret'
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template('index.html')

registered_users = set()

@socketio.on('register')
def register_user(username):
    if not username or username in registered_users:
        emit('registered', False)
        return

    registered_users.add(username)
    emit('registered', True)
    emit('user enter',
         {'username': username, 'userlist': list(registered_users)},
         broadcast=True)

@socketio.on('unregister')
def unregister_user(username):
    try:
        registered_users.remove(username)
    except KeyError:
        return  # Ignore if aleady unregistered

    emit('user leave',
         {'username': username, 'userlist': list(registered_users)},
         broadcast=True)

@socketio.on('message')
def receive_message(data):
    try:
        from_ = data['from']
        message = data['message']
    except:
        print('Got invalid message: "{}"'.format(data))
        return  # Ignore invalid data

    emit('message', {'from': from_, 'message': message}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
