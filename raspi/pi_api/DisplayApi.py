from flask import Flask, request, abort, jsonify
import I2C_LCD_driver
import time

app = Flask(__name__)

mylcd = I2C_LCD_driver.lcd()

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/api/display', methods=['POST'])
def create_task():
    print(request)
    if not request.json or not 'spell' in request.json:
        abort(400)
    data = request.json['spell']
    # dataArray = str(data).split("'")
    # print("TEXT TO PRINT: ", dataArray[0])
    announceSpell(str(data))
    return jsonify(data), 201

def announceSpell(spell):
    mylcd.lcd_clear()
    mylcd.lcd_display_string("Spell cast:",1) 
    mylcd.lcd_display_string(spell,2)   # Show spell


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
