from django.shortcuts import render
from django.http import HttpResponse

import openai

# Create your views here.
model_engine = "text-davinci-003"
openai.api_key='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'

#chatGPTを呼ぶ関数
def ChatGPT(user_query):
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

def index(request):
    response = "Hello World!" #ChatGPT("Hello World!")
    print(response)
    return HttpResponse(response);