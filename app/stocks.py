import os
import math
import json
import random

from app import base_dir

class Stock:
    def __init__(self, *args, **kwargs):
        self.name = kwargs.get('name')
        self.symbol = kwargs.get('symbol')
        self.open = kwargs.get('open')
        self.high = kwargs.get('open')
        self.low = kwargs.get('low')
        self.current = self.open

    def __str__(self):
        return self.name

    def get_current(self):
        new_val = self.low + random.random()
        if new_val <  self.high:
            return '%.2f'%new_val
        return self.get_current()

    def info(self):
        return {
            'name': self.name,
            'symbol': self.symbol,
            'open': self.open,
            'high': self.high,
            'low': self.low,
            'current': self.get_current()
        }


def read_data():
    file_path = os.path.join(base_dir, 'data.json')
    f = open(file_path, 'r')
    f_content =  f.read()
    return json.loads(f_content)

def get_stocks():
    stocks = []
    data = read_data()
    for s in data:
        s_obj = Stock(
            name=s['name'], symbol=s['symbol'],
            open=s['open'], high=s['high'], low=s['low']
        )
        stocks.append(s_obj)
    return stocks[:3]
