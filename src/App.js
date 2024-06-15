import React, { useRef } from "react";
import Game from "./components/Game";
import GuideModal from "./components/GuideModal";
import "./App.css";
import gameData from "./constants/gameData.json";
import { BsTranslate } from "react-icons/bs";
import { BsQuestionCircle } from "react-icons/bs";

const _ = require("lodash");

function App() {
  const modalRef = useRef();
  const openGuideModal = () => {
    modalRef.current.openModal();
  };

  const wordData = getWordData();

  function getWordData() {
    const index = Math.floor(Math.random() * gameData.gameData.length);
    const wordData = gameData.gameData[index];
    wordData.translationOptions = _.shuffle(wordData.translationOptions);
    return wordData;
  }

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1 }}></div>
        <h2 id="game-title">
          Translatle <BsTranslate />
        </h2>
        <BsQuestionCircle
          style={{
            cursor: "pointer",
            fontSize: "24px",
            flex: 1,
          }}
          onClick={openGuideModal}
        />
      </header>
      <GuideModal ref={modalRef} />{" "}
      <Game
        secretWord={wordData.word}
        translationList={wordData.translationOptions}
      />
    </>
  );
}

export default App;
