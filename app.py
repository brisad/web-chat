from flask import Flask
from flask.ext.socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'not so secret'
socketio = SocketIO(app)

@app.route("/")
def main():
    return ""


if __name__ == '__main__':
    socketio.run(app)
