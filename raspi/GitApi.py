# THIS IS WHERE API CALL ARE MADE FROM

import requests

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
        print(response.text)

