#!/usr/bin/env python
import AMPS
import time
import random


# settings
TOPIC = 'executions'
CUSTOMERS = 10 * 1000
TOTAL_PUBLISHES = 5 * 1000 * 1000
PUBLISH_RATE_PER_SECOND = 100


# helper message generator function
def make_message(id):
    # create the symbol
    s1, s2 = random.randint(1, 26), random.randint(1, 26)

    # generate and adjust the price
    price = s1 * s2 / 10
    price += price * random.uniform(0, 0.01) * random.choice((-1, 1))

    return '{"id":"%s","symbol":"%s","qty":%d,"price":%.2f,"customer_id":"%s","timestamp":%f}' % (
        id + 1,                                  # execution id
        '%s%sA' % (chr(64 + s1), chr(64 + s2)),  # symbol
        random.randint(1, 10) * 100,             # quantity
        price,                                   # price
        random.randint(1, CUSTOMERS),            # customer id
        time.time()                              # timestamp
    )


def publish_execution_data():
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

    # publish up to TOTAL_PUBLISHES messages, with PUBLISH_RATE_PER_SECOND
    id = 0
    rate = 1.0 / PUBLISH_RATE_PER_SECOND
    while id < TOTAL_PUBLISHES:
        client.publish(TOPIC, make_message(id))
        id += 1

        # pace yourself to maintain the publish rate
        time.sleep(rate)

    # wait for all publishes to be persisted
    while client.get_unpersisted_count() > 0:
        time.sleep(1)

    # done
    client.close()


if __name__ == '__main__':
    publish_execution_data()
