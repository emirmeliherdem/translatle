// import React, { useState } from 'react';
// import './TranslationCard.css';
//
// const TranslationCard = ({ translation, onSelection }) => {
//   const { countryName, flagUrl, translations } = translation;
//   const [isRevealed, setIsRevealed] = useState(false);
//
//   const handleCardClick = () => {
//     if (!isRevealed) {
//       setIsRevealed(true);
//       onSelection(translation);
//     }
//   };
//
//   return (
//     <div className={`translation-card ${isRevealed ? 'revealed' : ''}`} onClick={handleCardClick}>
//       <img className="flag" src={flagUrl} alt={countryName} />
//       <div className="country-name">{countryName}</div>
//       { isRevealed && <div className="translations-list">
//           {translations.map((item, index) => (
//             <li key={index}>{item.word} {item.pronunciation} {item.language}</li>
//           ))}
//       </div>}
//     </div>
//   );
// };
//
// export default TranslationCard;
