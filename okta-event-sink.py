#!/usr/bin/env python3

from sanic import Sanic
from sanic.response import json, text


app = Sanic()

@app.route("/")
async def root(request):
    print("Root")
    return text("OK")

@app.route('/<path_arg:path>')
async def debugger(request, path_arg):
    print('Path - {}'.format(path_arg))
    print("Content")
    print(request.body)
    return text('Path - {}'.format(path_arg))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)