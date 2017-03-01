#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import redis


r = redis.StrictRedis(host='localhost', port=6379, db=0)

p = r.pubsub()


def my_handler(message):
    print 'MY HANDLER: ', message['data']

# p.subscribe(**{'my-channel': my_handler})

r.publish('push', json.dumps({'sessionid': '456', 'content': 'It is Marmot'}))

# r.publish('push', 'quit')
