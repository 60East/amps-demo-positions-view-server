#!/usr/bin/env python
from multiprocessing import Process
from signal import signal, SIGTERM
from customers import publish_customer_data
from executions import publish_execution_data
from market_data import publish_market_data


execution = None
market_data = None


def sigterm_handler():
    if execution:
        execution.terminate()

    if market_data:
        market_data.terminate()


if __name__ == '__main__':
    signal(SIGTERM, sigterm_handler)

    # publish companies first
    publish_customer_data()

    # run other publishes in parallel
    execution = Process(target=publish_execution_data)
    market_data = Process(target=publish_market_data)

    execution.start()
    market_data.start()
    execution.join()
    market_data.join()
