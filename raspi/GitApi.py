# THIS IS WHERE API CALL ARE MADE FROM

import requests
import json

class GitApi:
    """ SUPER AWESOME REST API CALLS """

    def __init__(self, url):
        self.url = url
    
    def MakeMagic(self, name):
        print("The spell was: ", name)
        url = self.url + "/api/gitmagic/" + name
        print(url)
        headers = {}
        response = requests.get(url, headers=headers)
        piHeaders = {
            'Content-Type': 'application/json',
        }
        piPayload = {
            'spell': name
        }
        if (name == "reparo"):
            requests.post("http://192.168.43.94:3000/api/display/blame", headers=headers, response)

        requests.post("http://192.168.43.94:3000/api/display", headers=piHeaders, data=json.dumps(piPayload))
        print(response.text)

