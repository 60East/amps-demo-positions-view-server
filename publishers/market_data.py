#!/usr/bin/env python
import AMPS
import time
import random


# settings
TOPIC = 'market_data'
PUBLISH_RATE_PER_SECOND = 2000


# helper message generator function
def make_message():
    # create the symbol
    s1, s2, s3 = random.randint(1, 26), random.randint(1, 26), random.randint(1, 26)

    # generate and adjust the bid
    bid = s1 * s2 * s3 / 10
    bid += bid * random.uniform(0, 0.01) * random.choice((-1, 1))

    return '{"symbol":"%s","bid":%.2f,"ask":%.2f,"timestamp":%f}' % (
        '%s%s%s' % (chr(64 + s1), chr(64 + s2), chr(64 + s3)),  # symbol
        bid,                                                    # bid
        bid * 1.1,                                              # ask
        time.time()                                             # timestamp
    )


def publish_market_data():
    # create the server chooser
    chooser = AMPS.DefaultServerChooser()
    chooser.add('tcp://localhost:9007/amps/json')
    chooser.add('tcp://localhost:9107/amps/json')
    chooser.add('tcp://localhost:9207/amps/json')

    # create the HA publisher and connect
    client = AMPS.HAClient(TOPIC)
    client.set_server_chooser(chooser)
    client.set_publish_store(AMPS.MemoryPublishStore())
    client.connect_and_logon()

    # publish indefinitely
    rate = 1.0 / PUBLISH_RATE_PER_SECOND
    while True:
        client.publish(TOPIC, make_message())

        # pace yourself to maintain the publish rate
        time.sleep(rate)


if __name__ == '__main__':
    publish_market_data()
