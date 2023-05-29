import openai
from django.forms.models import model_to_dict

# Create your views here.
openai.api_key='YOUR OPENAI API KEY HERE'

#chatGPTに聞く関数
def ask_chatGPT(restaurant):
    prompt = make_prompt(restaurant)
    print(prompt)
    return ChatGPT(prompt)
    
#プロンプト生成
#TODO 改良してみよう(渕君)
def make_prompt(restaurant):
    shop_dict = model_to_dict(restaurant)
    # 指示文章の英語化
    prompt = "Please generate a 400-character advertisement for a restaurant in Japanese based on the following characteristics. Note that the words on the front side of ':' should not be used.\n\n"

    # Hotpepper APIから得たデータのうち、下の要素のみを使って宣伝文を生成させる
    candicates = set([
        "access",
        "address",
        "budget",
        "wifi",
        "child",
        "genre",
        "sub_genre"
        "catch",
        "child",
        "station_name",
        "name",
        "open",
        "parking"
    ])

    print(shop_dict)

    for key, value in shop_dict.items():
        # このif文はよくわからなかったので残しておきます
        if key not in ["id"]:
            if key in candicates:
                # genreとbudgetにあるcodeという要素は不要なので省く
                
                # CHANGED(益川)
                # ここはDB内のRestaurantオブジェクトのインスタンスからの参照になり, 既にgenreとbudgetはDB登録の段で辞書ではなくなるように処理しているので, 不要
                # ask_chatGPTのエラーの原因となってしまっていたので, コメントアウト
                
                # if key in ["genre", "budget"]:
                #     d = dict()
                #     for k, v in value.items():
                #         if k != "code":
                #             d[k] = v
                #     value = d
                prompt += f"{key} : {value}\n"

    return prompt

#chatGPTからプロンプト(user_query)対する答えを得る関数
def ChatGPT(user_query, model_engine="text-davinci-003"):
    '''
    This function uses the OpenAI API to generate a response to the given
    user_query using the ChatGPT model
    '''
    # Use the OpenAI API to generate a response
    completion = openai.Completion.create(
          engine = model_engine,
          prompt = user_query,
          max_tokens = 1024,
          n = 1,
          temperature = 0.5,
    )
    response = completion.choices[0].text
    return response
