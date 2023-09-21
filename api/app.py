from flask import Flask, jsonify
#from word2word import Word2word
from supported_languages import SUPPORTED_LANGUAGES
import random
import googletrans
from googletrans import Translator
from flask_cors import cross_origin

app = Flask(__name__)

TRANS_COUNT = 7
SUPPORTED_LANGUAGES = googletrans.LANGUAGES.keys()

def get_random_languages():
    random_languages = random.sample(SUPPORTED_LANGUAGES, TRANS_COUNT)
    return random_languages

# Replace this with your logic to fetch data from the "word2word" dataset
def fetch_word_translations(word):
    languages = get_random_languages()
    translations = []
    for lang in languages:
        result = Translator().translate(text=word, src='en', dest=lang)
        translations.append({
            "language": lang,
            "word": result.text,
            "pronounciation": result.pronunciation,
        })
    return translations

@app.route('/translations/<word>')
@cross_origin()
def get_translations(word):
    translations = fetch_word_translations(word)
    return jsonify(translations)

if __name__ == '__main__':
    app.run(debug=True)
