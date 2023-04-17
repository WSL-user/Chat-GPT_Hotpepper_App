import requests
HOTPEPPER_API_KEY = 'YOUR HOTPEPPER API KEY'

#ホットペッパーグルメに聞く関数
def ask_hotpepper(keyword, count=100):
    URL = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/'

    body = {
      'key':HOTPEPPER_API_KEY,
      'keyword': keyword, #
      'format':'json',
      'count':count,
      'type':"special"
    }
    response = requests.get(URL,body)

    return response