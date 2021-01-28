import re
from konlpy.tag import Hannanum
from collections import Counter
import sys
import json

def preprocess_special(strings):
    stop_special_char = re.sub(pattern='[가-힣 a-zA-Z\d\.\n]+', repl='', string=strings)
    stop_special_char_pattern = '[' + '\\'.join(set(stop_special_char)) + ']'
    if stop_special_char_pattern == '[]':
        return strings
    new_strings = re.sub(pattern=stop_special_char_pattern, repl=' ',string=strings)
    return new_strings
def preprocess_no_eng_num(strings):
    new_strings = re.sub(pattern='[a-zA-Z]',repl='',string=strings)
    new_strings = re.sub(pattern='[0-9]', repl='', string=new_strings)
    return new_strings
def preprocess_no_num_pattern(strings):
    new_strings = re.sub(pattern='[0-9]+[ㄱ-ㅎ가-힣]*', repl=' ', string=strings)
    return new_strings

def count2cloud(count):
    cloud_list = []
    for word in count:
        cloud_word = {
            "text": '',
            "value": 0
        }
        cloud_word['text'] = word[0]
        cloud_word['value'] = word[1]
        cloud_list.append(cloud_word)
    return cloud_list

def text2cloud(text):

    stopwords = ['라', '중', '이', '때문', '지', '이상', '등', '수', '것', '시작', '부분', '당시', '경우', '이후', '오브', '리그', '편', '위', '정도', '활동', '전', '둘',
    '한', '도중', '자체', '경기', '방송이','때','녹두','이유','문단을','대부분','번','일','리','두','초','나','문단','문','방송','적','후','단어','게임','유튜브','영상','말','역사','시청자들','본인','이전','시청자','업로드','콘텐츠','듯','현재','명','들','사람','1','개','관련','채널','모습','주','거','내','사이','자신','유튜버','컨텐츠','생각','내용','를','을','시즌','조','관','그','제목']


    no_special_text = preprocess_special(text)
    no_num_pattern_text = preprocess_no_num_pattern(no_special_text)

    final_text = no_num_pattern_text
    h = Hannanum()
    nouns = h.nouns(final_text)
    unique_nouns = set(nouns)
    for word in unique_nouns:
        if word in stopwords:
            while word in nouns:
                nouns.remove(word)

    count = Counter(nouns)
    top_20 = count.most_common(20)
    cloud_words = count2cloud(top_20)
    return cloud_words

target = sys.argv[1]
cloud_result = json.dumps(text2cloud(target)) 
# cloud_result = r'[{"text" : "tsdg", "value": 64}]'
print(cloud_result)
