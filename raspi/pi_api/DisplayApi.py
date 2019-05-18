from flask import Flask, request, abort, jsonify
import lcd

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/api/display', methods=['POST'])
def create_task():
    print(request)
    if not request.json or not 'spell' in request.json:
        abort(400)
    data = request.json['spell'],
    print("TEXT TO PRINT: ", data)
    lcd.announceSpell(data)
    return jsonify(data), 201


if __name__ == '__main__':
     app.run(port='5002', debug=True)