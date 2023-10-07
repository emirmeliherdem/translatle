import csv, random

FILE_PATH = 'api/countries.csv'

def get_countries_data():
    data = []
    with open(FILE_PATH, newline='', encoding='utf-8-sig') as csvfile:
        csv_reader = csv.DictReader(csvfile, delimiter=';')
        for row in csv_reader:
            row['Languages'] = row['Languages'].split(',')
            row['Language Codes'] = row['Language Codes'].split(',')
            data.append(row)
    return data

def get_filtered_countries_data(game_lang, supported_languages):
    data = get_countries_data()
    return [country for country in data if game_lang not in country['Language Codes'] and
            any(lang in supported_languages for lang in country['Language Codes'])]

def get_random_countries(countries_list, n):
    return random.sample(countries_list, n)

if __name__ == '__main__':
    print(get_filtered_countries_data('en'))

