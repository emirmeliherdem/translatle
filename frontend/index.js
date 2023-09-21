import { wordsList, testDictionary, realDictionary } from './dictionary.js';

const dictionary = realDictionary;

const BASE_ROTATION_DURATION = 10;

const LETTER_COUNT = 5;

const ATTEMPT_COUNT = 5;
const INITIAL_TRANS_COUNT = 3;
const TRANS_COUNT = ATTEMPT_COUNT + INITIAL_TRANS_COUNT - 1;

const state = {
	secret_word: wordsList[Math.floor(Math.random() * wordsList.length)],
	grid: Array(5).fill(''),
	revealedGrid: Array(5).fill(''),
	attempts: 0,
};

async function fetchTranslations(word) {
	try {
		const response = await fetch(`http://127.0.0.1:5000/translations/${word}`);
		if (response.ok) {
			const translations = await response.json();
			console.log(translations);
			return translations;
		} else {
			console.error('Error fetching translations');
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
	return [];
}

// Elements
const circle = document.getElementById("circle");
const grid = document.getElementById("grid")
const wordElement = document.getElementById("word");
const translationsList = document.getElementById("translations");
const feedbackMessage = document.getElementById("feedback");

var translations = [];

// Initialize game
function drawGrid() {
	for (let i = 0; i < LETTER_COUNT; i++) {
		const box = document.createElement('div');
		box.className = 'letter-tile';
		//box.textContent = letter;
		box.id = `box${i}`;
		grid.appendChild(box);
	}
}

function updateGrid() {
	for (let i = 0; i < state.grid.length; i++) {
		const tile = document.getElementById(`box${i}`);
		tile.textContent = state.grid[i];
	}
}

async function initializeGame() {
	const word = state.secret_word;
	wordElement.textContent = word;
	feedbackMessage.textContent = 'Guess the word in 5 attempts.';
	drawGrid();
	// Fetch translations for the new word
	translations = await fetchTranslations(word);
	for (let i = 0; i < INITIAL_TRANS_COUNT; i++)
		displayTranslation(i);

	registerKeyboardEvents();
}

function getTranslation(i) {
	const trans = translations[i];
	var text = trans.word;
	if (trans.pronounciation)
		text += ' (' + trans.pronounciation + ')';
	return text + ' - ' + trans.language;
}

function displayTranslation(s) {
	const scale = s + 1;
	const orbit = document.createElement('div');
	orbit.className = 'orbit';
	orbit.style.width = `calc(100% + 60* ${scale}px)`;
	orbit.style.height = `calc(100% + 60* ${scale}px)`;
	if (s % 2)
		orbit.style.animationDirection = 'reverse';
	orbit.style.animationDuration = (BASE_ROTATION_DURATION + scale) + 's';

	const text = document.createElement('p');
	text.innerText = getTranslation(s);
	text.innerHTML = text.innerText.split('').map(
		(char, i) =>
			`<span style='transform:rotate(${i * 5}deg)'>${char}</span>`
	).join('');
	orbit.appendChild(text);
	circle.appendChild(orbit);
}

function getGuess() {
	return state.grid.reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
	return dictionary.includes(word);
}

function isLetter(key) {
	return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
	for (var i = 0; i < LETTER_COUNT; i++) {
		if (!state.grid[i]) {
			state.grid[i] = letter;
			return;
		}
	}
}

function removeLetter() {
	for (var i = LETTER_COUNT - 1; i >= 0; i--) {
		if (state.grid[i] && !state.revealedGrid[i]) {
			state.grid[i] = '';
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
	state.grid = state.revealedGrid.slice();
}

function makeGuess() {
	if (state.grid[LETTER_COUNT - 1]) {
		const guess = getGuess();
		if (!isWordValid(guess)) {
			alert('Not a valid word.');
		} else if (guess.toLowerCase() === state.secret_word.toLowerCase()) {
			feedbackMessage.textContent = "Congratulations! You guessed it!";
		}
		else {
			state.attempts++;
			if (state.attempts < ATTEMPT_COUNT) {
				feedbackMessage.textContent = `Wrong guess. ${ATTEMPT_COUNT - state.attempts} attempts left.`;
				revealLetter();
				// Display more translations on each incorrect guess
				displayTranslation(state.attempts + INITIAL_TRANS_COUNT - 1);
			} else {
				feedbackMessage.textContent = "Sorry, you're out of attempts. The word was: " + wordElement.textContent;
			}
		}
	}
	else {
		// invalid guess
	}
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
		updateGrid();
	};
}


initializeGame();
