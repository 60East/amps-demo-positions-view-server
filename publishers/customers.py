#!/usr/bin/env python
from os.path import join
from os.path import dirname as dname
from glob import glob
import csv
import AMPS
import time


# settings
TOPIC = 'customers'


def load_companies():
    companies = []

    for company_file_path in glob(join(dname(__file__), 'companies', '*.csv')):
        with open(company_file_path) as company_file:
            reader = csv.reader(company_file)
            reader.next()  # skip the header row

            for company in reader:
                companies.append((len(companies) + 1, company[1]))

    return companies


def publish_customer_data():
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

    # read companies from files and populate the topic
    for company in load_companies():
        client.publish(TOPIC, '{"id":"%s","name":"%s"}' % company)

    # wait for all publishes to be persisted
    while client.get_unpersisted_count() > 0:
        time.sleep(1)

    # done
    client.close()


if __name__ == '__main__':
    publish_customer_data()
