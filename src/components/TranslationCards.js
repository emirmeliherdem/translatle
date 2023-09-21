import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import "./TranslationCards.css";

const TranslationCard = ({ translation, onSelection }) => {
  const { countryName, flagUrl, translations } = translation;
  const [isRevealed, setIsRevealed] = useState(false);

  const handleCardClick = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      onSelection(translation);
    }
  };

  return (
    <div
      className={`translation-card ${isRevealed ? "revealed" : ""}`}
      onClick={handleCardClick}
    >
      <img className="flag" src={flagUrl} alt={countryName} />
      <div className="country-name">{countryName}</div>
      {isRevealed && (
        <div className="translations-list">
          {translations.map((item, index) => (
            <li
              key={index}
              data-tooltip-id="my-tooltip"
              data-tooltip-content={item.languageName}
              data-tooltip-place="right"
            >
              {item.word} {item.pronunciation && ` (${item.pronunciation})`}
            </li>
          ))}
        </div>
      )}
      <Tooltip id="my-tooltip" />
    </div>
  );
};

const TranslationCardsContainer = ({ revealed, options, onSelection }) => {
  return (
    <div className="translations-container">
      {[...revealed, ...options].map((translation) => (
        <TranslationCard
          key={translation.countryName}
          translation={translation}
          onSelection={onSelection}
        />
      ))}
    </div>
  );
};

export default TranslationCardsContainer;
