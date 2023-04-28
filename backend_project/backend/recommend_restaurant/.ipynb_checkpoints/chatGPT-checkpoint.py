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
    prompt = f"""
      次の特徴を踏まえて、飲食店の400文字程度の宣伝文を生成してください。なお、「:」の前側の言葉は使用しないでください
    """

    for key, value in shop_dict.items():
        if key not in ["id"]:
            prompt += f"""
            {key} : {value}"""

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
