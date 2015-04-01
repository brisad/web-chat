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
    if username in registered_users:
        emit('registered', False)
    else:
        registered_users.add(username)
        emit('registered', True)

    print("Users: " + str(registered_users))

@socketio.on('unregister')
def unregister_user(username):
    try:
        registered_users.remove(username)
    except KeyError:
        print("Unknown user '{}' tried to unregister".format(username))

    print("Users: " + str(registered_users))


if __name__ == '__main__':
    socketio.run(app)
