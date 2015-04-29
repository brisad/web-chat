# Chat #

A simple web-chat using WebSockets and React.

## Installing ##

Create a virtualenv, activate it and install all dependencies with
pip:
```sh
virtualenv env
source env/bin/activate
pip install -r requirements.txt
```

Install JavaScript dependencies:
```sh
npm install
bower install
```

Now you should be ready to run the application by running
```sh
python app.py
```

### SSLError problem ###

On my Debian box I get the following error when I try to run the
SocketIO server:

    Traceback (most recent call last):
      File "app.py", line 2, in <module>
        from flask.ext.socketio import SocketIO
      File "/home/michael/.envs/chat/local/lib/python2.7/site-packages/flask/exthook.py", line 62, in load_module
        __import__(realname)
      File "/home/michael/.envs/chat/local/lib/python2.7/site-packages/flask_socketio/__init__.py", line 5, in <module>
        from socketio.server import SocketIOServer
      File "/home/michael/.envs/chat/local/lib/python2.7/site-packages/socketio/server.py", line 6, in <module>
        from gevent.pywsgi import WSGIServer
      File "/home/michael/.envs/chat/local/lib/python2.7/site-packages/gevent/pywsgi.py", line 12, in <module>
        from gevent import socket
      File "/home/michael/.envs/chat/local/lib/python2.7/site-packages/gevent/socket.py", line 659, in <module>
        from gevent.ssl import sslwrap_simple as ssl, SSLError as sslerror, SSLSocket as SSLType
      File "/home/michael/.envs/chat/local/lib/python2.7/site-packages/gevent/ssl.py", line 386, in <module>
        def get_server_certificate(addr, ssl_version=PROTOCOL_SSLv3, ca_certs=None):
    NameError: name 'PROTOCOL_SSLv3' is not defined

To solve it, I opened the `ssl.py` file referenced in the traceback
above which is part of my virtual environment. I changed
`PROTOCOL_SSLv3` to `PROTOCOL_SSLv23` in the function call and saved
the file. After that it works fine.
