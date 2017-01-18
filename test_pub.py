#!/usr/bin/env python
# -*- coding: utf-8 -*-
import redis


r = redis.StrictRedis(host='localhost', port=6379, db=0)

p = r.pubsub()


def my_handler(message):
    print 'MY HANDLER: ', message['data']

# p.subscribe(**{'my-channel': my_handler})

r.publish('push', 'awesome data')

# r.publish('push', 'quit')
