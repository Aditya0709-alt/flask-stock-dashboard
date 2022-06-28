import time
import json
import random
from flask import render_template, jsonify, Response

from app import app, stocks as st

stocks_data = st.get_stocks()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stocks')
def stocks():
    res = [x.info() for x in stocks_data]
    return jsonify(res)

@app.route('/stream-stocks')
def stream_stocks():
    def event_stream():
        while True:
            time.sleep(0.5)
            json_data = json.dumps({
                "stock": stocks_data[random.randint(0,len(stocks_data)-1)].info(),
                "time": time.strftime("%M:%S", time.gmtime())
            })
            yield f'data: {json_data}\n\n'
    return Response(event_stream(), mimetype="text/event-stream")