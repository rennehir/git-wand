# THIS IS WHERE API CALL ARE MADE FROM

import requests
import json

class GitApi:
    """ SUPER AWESOME REST API CALLS """

    def __init__(self, url):
        self.url = url
        
    def MakeMagic(self, name):
        url = self.url + "/api/gitmagic"
        headers = {}
        payload = {"spell": name}
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(response.text)

