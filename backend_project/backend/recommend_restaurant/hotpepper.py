from .models import Restaurant
from django.db.utils import IntegrityError
import requests
import json

import pandas as pd
from IPython import display
import time
from janome.tokenizer import Tokenizer
from janome.analyzer import Analyzer
from janome import tokenfilter, charfilter
import re, regex

HOTPEPPER_API_KEY = 'YOUR HOTPEPPER API KEY HERE'
GET_restaurant_NUM = 100

USE_SEARCH_FIELD_LIST = ['address','keyword', 'free_drink', 'free_food', 'private_room',
                         'wifi', 'non_smoking', 'parking', 'night_view', 'karaoke', 'tv', 'lunch',
                         'midnight', 'midnight_meal', 'pet', 'child',]

USE_RETURN_FIELD_LIST = ['access', 'address', 'barrier_free','budget',
                          'catch', 'child','close', 'coupon_urls', 
                          'free_drink', 'free_food', 'genre', 'id',
                          'lunch', 'midnight', 'mobile_access', 'name',
                          'name_kana', 'non_smoking', 'open','parking', 
                          'photo', 'small_area', 'wifi',]

#
CHECK_KETWORD_LIST = ['barrier_free', 'budget', 'child', 'free_drink', 
                      'free_food', 'lunch', 'non_smoking', 'parking', 'wifi']

CHECK_KEYWORD_HIRA_DIC = {('車椅子','バリアフリー'):'barrier_free',
                          ('子供','子ども','こども'):'child',
                          ('ワイファイ','wifi','wi-fi'):'wifi',
                          ('のみ','飲み'):'free_drink',
                          ('たべ','食べ'):'free_drink',
                          ('ランチ'):'lunch',
                          ('禁煙'):'non_smoking',
                          ('車','駐車場','パーキング'):'parking',
                          ('ペット','犬','猫'):'pet',
                          ('個室'):'private_room',
                          ('クーポン'):'',
                          ('座敷'):'tatami',
                          ('カクテル'):'cocktail',
                          ('焼酎'):'shochu',
                          ('日本酒'):'sake',
                          ('ワイン'):'wine',
                          ('夜景'):'night_view',
                          ('tv','テレビ'):'tv',      
                         }

#文分割、単語抜き出し
def  extra_use_words(sentence):
    char_filters = [charfilter.UnicodeNormalizeCharFilter()]
    token_filters = [tokenfilter.LowerCaseFilter(),
                     tokenfilter.POSKeepFilter(['名詞', '形容詞', '副詞']),
                     #tokenfilter.CompoundNounFilter(),
                    ]
    n_token_filters = [tokenfilter.LowerCaseFilter(),
                       tokenfilter.POSKeepFilter(['名詞']),]
    tokenizer = Tokenizer()

    analyzer = Analyzer(char_filters=char_filters, token_filters=token_filters)
    n_analyzer = Analyzer(char_filters=char_filters, token_filters=n_token_filters)

    use_words_list  = [token.surface for token in analyzer.analyze(sentence)]
    n_words_list  = [token.surface for token in n_analyzer.analyze(sentence)]

    #print("N:",n_words_list)

    return n_words_list, use_words_list

#いらなそうな単語除去
#おそらく最新の検索形式だと必要ない関数？
def check_words(word):
    not_use_word = ['店','駅', '近く', '雰囲気']
    if word in not_use_word:
        return False
    else:
        return True
    

def extra_keywords(sentence):
    keywords_dic = {}
    n_words_list, search_words_list = extra_use_words(sentence)
    keyword = ''
    
    #bodyの一部を作成
    for search_word in search_words_list:
        use_flag = False
        for keyword_list in CHECK_KEYWORD_HIRA_DIC.keys():
            if search_word in keyword_list:
                keywords_dic[CHECK_KEYWORD_HIRA_DIC[keyword_list]] = 1
                use_flag = True
                break
        
        #keyword部分作成(残った名詞全部をつなげる)
        if (not use_flag) and (check_words(search_word) and (search_word in n_words_list)):
            keyword += search_word + ' '

    keywords_dic['keyword'] = keyword

    return keywords_dic

def make_body(search_words, region):
    #改善の余地あり
    body_part = extra_keywords(search_words)
    #'keyword':search_words['keyword'],
    #CHANGED(益川) 
    #
    body = {'key':HOTPEPPER_API_KEY,
            'format':'json',
            'address':region,
            'count':GET_restaurant_NUM,
            'type':"special",
            'order':4, #初期値は4だが自明にする
            }
    body = body_part | body #辞書結合
    #print("body:", body)

    for filed in USE_SEARCH_FIELD_LIST:
        if (filed in search_words) and (search_words[filed] != ''):
            body[filed] = search_words[filed]

    return body



#ホットペッパーグルメに聞く関数
#search_sentence部分がおそらく適切な受け取り方になっていない？
def ask_hotpepper(search_sentence, count=100):
    URL = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/'

    ############仮　エラーにならないよう埋めている
    #本当は引数として受け取りたい
    region = ""
    body = make_body(search_sentence, region)
    response = requests.get(URL,body)
    return response

#ホットペッパーグルメの検索結果をデータベースに追加する関数
####この関数はいじってないのでデータベースに保存するフィールドは増やす必要あり
def insert_objects(hotpepper_response):
    shops = hotpepper_response.json()['results']['shop']
    if len(shops) == 0:
        return {}
    assert len(shops) > 0
    essential_fields = [ f.name for f in Restaurant._meta.fields if not f.blank and not f.null]
    #データベースの有効なフィールド名のリスト
    valid_fields = [ f.name for f in Restaurant._meta.fields ]
    shop_keys = shops[0].keys()
    assert all([key in shop_keys for key in essential_fields]), f"{shop_keys} must include all in {essential_fields}"

    #CHANGED
    #青葉さんのUSE_RETURN_FIELD_LISTのフィールド情報も登録できるよう修正
    
    #NOTE 
    #hotpepper APIで辞書がネストされているアイテムは全てここで代表となる値を一つ選んでしまっているので, プロンプト等での処理は不要
    print(f"Len Shops: {len(shops)}")
    for shop in shops:
        fields = {
            "name" : shop["name"],
            "address" : shop["address"],
            # "child": shop["child"],
            # "wifi" : shop["wifi"],
            # "budget" : shop["budget"]["name"],
            # "genre" : shop["genre"]["name"],
            #CHANGED sub_genre常にある前提にしていた部分を変更
            # "sub_genre" : shop["sub_genre"]["name"],
            # "station_name" : shop["station_name"],
            # "url" : shop["urls"]["pc"],
        }

        for key in shop.keys():
            if key == "small_area":
                fields["small_area_code"] = shop["small_area"]["code"]
                fields["small_area_name"] = shop["small_area"]["name"]
            #CHANGED genre, sub_genre, budgetは同じパターンなのである時だけにして、まとめておきました
            elif key in ["genre", "sub_genre", "budget"]:
                fields[key] = shop[key]["name"]
            elif key == "url":
                fields[key] = shop[key]["pc"]
            elif key == "id":
                fields["hotpepper_id"] = shop[key]
            elif key == "coupon_urls":
                fields["coupon_url"] = shop[key]["pc"]
            elif key in valid_fields:
                fields[key] = shop[key]
        # print(fields)
        assert all([key in essential_fields + valid_fields for key in fields.keys()]), "Your fields contain some invalid keys"
        #CHANGED
        #既に追加してあるデータを再度追加すると、IntegrityErrorが出るのでそれだけ例外処理
        try:
            Restaurant.objects.create(**fields)
        except IntegrityError:
            pass
        
    return shops
