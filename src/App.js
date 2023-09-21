import React from "react";
import Game from "./components/Game";
import "./App.css";
import gameData from "./constants/gameData.json";
import { BsTranslate } from "react-icons/bs";

function App() {
  const wordData = getWordData();

  function getWordData() {
    const index = Math.floor(Math.random() * gameData.gameData.length);
    return gameData.gameData[index];
  }

  return (
    <div>
      <h2 id="game-title">
        Translatle <BsTranslate />
      </h2>
      <hr />
      <Game
        secretWord={wordData.word}
        translationList={wordData.translationOptions}
      />
    </div>
  );
}

export default App;
