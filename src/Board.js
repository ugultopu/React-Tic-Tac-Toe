import React from 'react';

const Square = ({square, onClick}) => (
  <button className="square" onClick={onClick}>
    {square}
  </button>
);

const Row = ({rowIndex, row, addMove}) => (
  <div className="board-row" key={rowIndex}>
    {row.map((square, colIndex) => (
      <Square
        {...{
          key: colIndex,
          square,
          onClick: () => addMove([rowIndex, colIndex]),
        }}
      />
    ))}
  </div>
);

const Board = ({squares, addMove}) => (
  <div>
    {squares.map((row, rowIndex) => (
      <Row
        {...{
          key: rowIndex,
          rowIndex,
          row,
          addMove,
        }}
      />
    ))}
  </div>
);

export default Board;
