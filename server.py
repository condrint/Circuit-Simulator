from flask import Flask, render_template, request, send_from_directory, make_response, jsonify
import os, sys
from simulate import simulate

app = Flask(__name__, static_folder='templates')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=['GET', 'POST'])
def router(path):
    if 'api' in path:
        #print(request.json, file=sys.stdout)
        result = simulate(request.json['edges'], request.json['nodes'])
        print(jsonify(result), file=sys.stdout)
        return jsonify(result)

    elif path and os.path.exists('react_client/build/' + path):
        return send_from_directory('react_client/build', path)

    else:
        return send_from_directory('react_client/build', 'index.html')

if __name__ == '__main__':
   app.run(debug = True)