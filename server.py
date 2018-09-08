from flask import Flask, render_template, request, send_from_directory
import os

app = Flask(__name__, static_folder='templates')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if '/api' in path:
        pass
    elif path and os.path.exists('react_client/build/' + path):
        return send_from_directory('react_client/build', path)
    else:
        return send_from_directory('react_client/build', 'index.html')

if __name__ == '__main__':
   app.run(debug = True)