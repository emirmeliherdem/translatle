import React from "react";
import "./WordGrid.css";

const WordGrid = ({ grid, currentRow, isWon }) => {
  const renderRow = (row, painted) => {
    return row.map((letter, position) => {
      return (
        <div
          key={position}
          className="letter-tile"
          style={{ backgroundColor: painted ? "#538d4e" : "#2a2a2a" }}
        >
          {letter}
        </div>
      );
    });
  };

  const renderGrid = () => {
    return (
      <div className="letter-grid">
        {grid.map((row, rowIndex) =>
          renderRow(row, rowIndex === currentRow && isWon),
        )}
      </div>
    );
  };

  return renderGrid();
};

export default WordGrid;
