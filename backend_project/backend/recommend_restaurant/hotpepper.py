from .models import Restaurant
import requests
HOTPEPPER_API_KEY = 'YOUR HOTPEPPER API KEY HERE'

#ホットペッパーグルメに聞く関数
def ask_hotpepper(keyword, adress,count=100):
    URL = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/'

    body = {
      'key':HOTPEPPER_API_KEY,
      ##
      'adress': adress,
      'keyword': keyword, #
      'format':'json',
      'count':count,
      'type':"special"
    }
    response = requests.get(URL,body)

    return response

#ホットペッパーグルメの検索結果をデータベースに追加する関数
def insert_objects(hotpepper_response):
    shops = hotpepper_response.json()['results']['shop']
    if len(shops) == 0:
        return {}
    assert len(shops) > 0
    essential_fields = [ f.name for f in Restaurant._meta.fields if not f.blank and not f.null]
    shop_keys = shops[0].keys()
    assert all([key in shop_keys for key in essential_fields]), f"{shop_keys} must include all in {essential_fields}"
    for shop in shops:
        fields = {
            "name" : shop["name"],
            "address" : shop["address"],
            "child": shop["child"],
            "wifi" : shop["wifi"],
            "budget" : shop["budget"]["name"],
            "genre" : shop["genre"]["name"],
            "sub_genre" : shop["sub_genre"]["name"],
            "station_name" : shop["station_name"],
            "url" : shop["urls"]["pc"],
        }
        if "catch" in shop.keys():
            fields["catch"] = shop["catch"]
        Restaurant.objects.create(**fields)
    return shops