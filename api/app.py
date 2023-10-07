from flask import Flask, jsonify
#from word2word import Word2word
from supported_languages import SUPPORTED_LANGUAGES
import random
import googletrans
from googletrans import Translator
from flask_cors import cross_origin
import countries

app = Flask(__name__)

OPTION_COUNT = 3
SUPPORTED_LANGUAGES = googletrans.LANGUAGES.keys()
GAME_LANGUAGE = 'en'

# Replace this with your logic to fetch data from the "word2word" dataset
def fetch_word_translations(word):
    countries_list = countries.get_filtered_countries_data(GAME_LANGUAGE, SUPPORTED_LANGUAGES)
    selected_countries = countries.get_random_countries(countries_list, OPTION_COUNT)
    results = []
    for country in selected_countries:
        option = country.copy()
        translations = []
        for lang in country['Language Codes']:
            if lang in SUPPORTED_LANGUAGES:
                translator = Translator().translate(text=word, src='en', dest=lang)
                translations.append({
                    'language': lang, 
                    'word': translator.text, 
                    'pronounciation': translator.pronunciation,
                })
        option['Translations'] = translations
        results.append(option)
    return results

@app.route('/translations/<word>')
@cross_origin()
def get_translations(word):
    translations = fetch_word_translations(word)
    return jsonify(translations)

if __name__ == '__main__':
    app.run(debug=True)
