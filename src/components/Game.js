import React, { useState, useEffect, useCallback } from "react";
import { dictionary } from "../constants/words";
import WordGrid from "./WordGrid";
import TranslationCardsContainer from "./TranslationCards";
import languages from "iso-639-1";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { create_confetti } from "../utils/confetti";

const lookup = require("country-code-lookup");

export const GAME_STATES = {
  PICK: "PICK",
  GUESS: "GUESS",
  WIN: "WIN",
  LOSE: "LOSE",
};

const Game = ({ secretWord, translationList }) => {
  const [gameState, setGameState] = useState(GAME_STATES.PICK);
  const [currentRow, setCurrentRow] = useState(-1);
  const [grid, setGrid] = useState(
    Array(6)
      .fill()
      .map(() => Array(5).fill("")),
  );
  const [translations, setTranslations] = useState({
    revealed: [],
    displayedOptions: [],
    futureOptions: parseTranslations(translationList),
  });

  function parseTranslations(translations) {
    return translations.map((item) => ({
      ...item,
      countryName: lookup.byIso(item.countryCode).country,
      flagUrl: `https://flagcdn.com/${item.countryCode.toLowerCase()}.svg`,
      translations: item.translations.map((translation) => ({
        ...translation,
        languageName: languages.getName(translation.languageCode),
      })),
    }));
  }

  const handleKeyPress = useCallback(
    (e) => {
      if (gameState !== GAME_STATES.GUESS) {
        return;
      }
      const key = e.key;
      if (key.length === 1 && key.match(/[a-z]/i)) {
        addLetter(key.toUpperCase());
      } else if (key === "Backspace") {
        removeLetter();
      } else if (key === "Enter") {
        makeGuess();
      }
    },
    [gameState, currentRow],
  );

  useEffect(() => {
    if (gameState === GAME_STATES.PICK) {
      updateCountryOptions();
      setCurrentRow(currentRow + 1);
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const updateCountryOptions = () => {
    const displayedOptions = translations.futureOptions.slice(0, 3);
    const futureOptions = translations.futureOptions.slice(3);
    setTranslations((prevTranslations) => {
      return {
        ...prevTranslations,
        displayedOptions: displayedOptions,
        futureOptions: futureOptions,
      };
    });
  };

  const makeGuess = () => {
    const guess = grid[currentRow].join("").toLowerCase();
    if (guess.length === 5) {
      if (!isWordValid(guess)) {
        alert("Not a valid word.");
      } else if (guess === secretWord.toLowerCase()) {
        create_confetti();
        setGameState(GAME_STATES.WIN);
      } else {
        if (currentRow < 5) {
          setGameState(GAME_STATES.PICK);
        } else {
          setGameState(GAME_STATES.LOSE);
        }
      }
    }
  };

  const isWordValid = (word) => {
    return dictionary.has(word);
  };

  const addLetter = (letter) => {
    const row = grid[currentRow];
    const firstEmptyIndex = row.indexOf("");
    if (firstEmptyIndex !== -1) {
      setGrid((prevGrid) => {
        const grid = [...prevGrid];
        grid[currentRow][firstEmptyIndex] = letter;
        return grid;
      });
    }
  };

  const removeLetter = () => {
    for (let i = grid[currentRow].length - 1; i >= 0; i--) {
      if (grid[currentRow][i]) {
        setGrid((prevGrid) => {
          const grid = [...prevGrid];
          grid[currentRow][i] = "";
          return grid;
        });
        return;
      }
    }
  };

  const handleTranslationSelection = (translation) => {
    setTranslations((prevTranslations) => {
      const displayedOptions = [];
      const revealed = [...prevTranslations.revealed, translation];
      return {
        ...prevTranslations,
        revealed: revealed,
        displayedOptions: displayedOptions,
      };
    });

    setGameState(GAME_STATES.GUESS);
  };

  const StatusBar = () => {
    const StatusMessage = () => {
      switch (gameState) {
        case GAME_STATES.PICK:
          return (
            <>
              <FaAngleDown /> <strong className={"text-info"}>Pick</strong> one{" "}
              <FaAngleDown />
            </>
          );
        case GAME_STATES.GUESS:
          return (
            <>
              <FaAngleUp /> Make a{" "}
              <strong className={"text-info"}>guess</strong> <FaAngleUp />
            </>
          );
        case GAME_STATES.WIN:
          return (
            <>
              <strong className={"text-success"}>Prodigy!</strong>
            </>
          );
        case GAME_STATES.LOSE:
          return (
            <>
              It was{" "}
              <strong className={"text-bg-danger p-1"}>
                {secretWord.toUpperCase()}
              </strong>
            </>
          );
        default:
          return null;
      }
    };
    return (
      <h5 className={"text-center mt-4 mb-3 text-secondary"}>
        {StatusMessage()}
      </h5>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          opacity: gameState === GAME_STATES.PICK ? 0.2 : 0.8,
        }}
      >
        <WordGrid
          grid={grid}
          currentRow={currentRow}
          isWon={gameState === GAME_STATES.WIN}
          style={{ alignSelf: "flex-end" }}
        />
      </div>
      <StatusBar />
      <div style={{ flex: 1 }}>
        <TranslationCardsContainer
          revealed={translations.revealed}
          options={translations.displayedOptions}
          onSelection={handleTranslationSelection}
        />
      </div>
    </div>
  );
};

export default Game;
