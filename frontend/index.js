import { wordsList, testDictionary, realDictionary } from './dictionary.js';
import { fetchTranslations } from './translations.js';


const dictionary = realDictionary;

const BASE_ROTATION_DURATION = 10;

const LETTER_COUNT = 5;

const ATTEMPT_COUNT = 5;
const INITIAL_TRANS_COUNT = 3;
const TRANS_COUNT = ATTEMPT_COUNT + INITIAL_TRANS_COUNT - 1;

const state = {
    secret_word: wordsList[Math.floor(Math.random() * wordsList.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    revealedGrid: Array(5).fill(''),
    revealedTranslations: [],
    options: [],
    attempts: 0,
    row: 0,
};

// Elements
const circle = document.getElementById("circle");
const grid = document.getElementById("grid")
const wordElement = document.getElementById("word");
const translationsList = document.getElementById("translations");
const feedbackMessage = document.getElementById("feedback");
const cardsContainer = document.getElementById('cards-container');

var cardId = 0;

// Initialize game
function drawRow(row) {
    for (let i = 0; i < LETTER_COUNT; i++) {
        const box = document.createElement('div');
        box.className = 'letter-tile';
        //box.textContent = letter;
        box.id = `box${row}${i}`;
        grid.appendChild(box);
    }
}

function updateRow() {
    const row = state.row;
    for (let i = 0; i < state.grid[row].length; i++) {
        const tile = document.getElementById(`box${row}${i}`);
        tile.textContent = state.grid[row][i];
    }
}

function removeUnselectedCards(selectedId) {
    console.log(selectedId);
    const allCards = document.querySelectorAll('.col');
    allCards.forEach((card) => {
        if (!card.firstChild.classList.contains('active')) {
            card.remove();
        }
    });
}

function displayOption(country) {
    const flag_url = country["Flag URL"];
    const country_name = country["Country"];
    const translations = country["Translations"];

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('col');
    cardDiv.id = cardId++;

    const card = document.createElement('div');
    card.classList.add('card', 'btn');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('card-img-canvas');

    const image = document.createElement('img');
    image.classList.add('card-img');
    image.src = flag_url;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const name = document.createElement('p');
    name.textContent = country_name;
    name.classList.add('country-name');

    const translationsContainer = document.createElement('div');
    translationsContainer.classList.add('translations-container');

    // Append the elements to construct the card
    cardBody.appendChild(name);
    cardBody.appendChild(translationsContainer);
    imageDiv.appendChild(image);
    card.appendChild(imageDiv);
    card.appendChild(cardBody);
    cardDiv.appendChild(card);

    card.addEventListener('click', () => {
        if (card.classList.contains('active')) return;
        card.classList.toggle("active");
        card.classList.remove('btn');

        removeUnselectedCards(cardDiv.id);

        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'list-group-flush');
        translations.forEach((translation) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = translation.word;
            if (translation.pronounciation) {
                li.textContent = `${translation.word} (${translation.pronounciation})`;
            } else {
                li.textContent = translation.word;
            }
            li.title = translation.language;

            ul.appendChild(li);
        });

        // Append the list to the translations container
        translationsContainer.appendChild(ul);
    });

    cardsContainer.appendChild(cardDiv);
}

function getGuess() {
    return state.grid[state.row].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    const row = state.row;
    for (var i = 0; i < LETTER_COUNT; i++) {
        if (!state.grid[row][i]) {
            state.grid[row][i] = letter;
            return;
        }
    }
}

function removeLetter() {
    const row = state.row;
    for (var i = LETTER_COUNT - 1; i >= 0; i--) {
        if (state.grid[row][i] && !state.revealedGrid[i]) {
            state.grid[row][i] = '';
            return;
        }
    }
}

function revealLetter() {
    const unrevealedIndices = [];
    for (let i = 0; i < state.revealedGrid.length; i++) {
        if (!state.revealedGrid[i]) {
            unrevealedIndices.push(i);
        }
    }

    if (!unrevealedIndices.length) {
        return -1;
    }

    const revealIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    state.revealedGrid[revealIndex] = state.secret_word[revealIndex];
}

function makeGuess() {
    if (state.grid[state.row][LETTER_COUNT - 1]) {
        const guess = getGuess();
        if (!isWordValid(guess)) {
            alert('Not a valid word.');
        } else if (guess.toLowerCase() === state.secret_word.toLowerCase()) {
            feedbackMessage.textContent = "Congratulations! You guessed it!";
            return;
        }
        else {
            state.attempts++;
            if (state.attempts < ATTEMPT_COUNT) {
                feedbackMessage.textContent = `Wrong guess. ${ATTEMPT_COUNT - state.attempts} attempts left.`;
                startNewRound();
            } else {
                feedbackMessage.textContent = "Sorry, you're out of attempts. The word was: " + wordElement.textContent;
                return;
            }
        }
    }
    else {
        // invalid guess
    }
}

async function startNewRound() {
    if (state.attempts % 2 == 1)
        revealLetter();

    state.options = await fetchTranslations(state.secret_word);
    if (state.options) {
        state.options.forEach((country) => displayOption(country));
    }
    state.grid[state.row] = state.revealedGrid.slice();
    
    state.row++;
    drawRow(state.row);
    updateRow();
}

// Event listener for the keyboard input
function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter') {
            makeGuess();
        }
        else if (key === 'Backspace') {
            removeLetter();
        }
        else if (isLetter(key)) {
            addLetter(key);
        }
        updateRow();
    };
}

async function initializeGame() {
    const word = state.secret_word;
    wordElement.textContent = word;
    feedbackMessage.textContent = 'Guess the word in 5 attempts.';
    drawRow(0);

    startNewRound();

    registerKeyboardEvents();
}


initializeGame();
