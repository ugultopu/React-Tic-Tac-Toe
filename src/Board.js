import React from 'react';

const Square = ({value, onClick}) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

const Row = ({
  rowIndex,
  width,
  squares,
  onClick,
}) => (
  <div className="board-row" key={rowIndex}>
    {[...Array(width).keys()].map(colIndex => (
      <Square
        key={colIndex}
        value={squares[colIndex]}
        onClick={() => onClick(rowIndex * width + colIndex)}
      />
    ))}
  </div>
);

class Board extends React.Component {

  static directionDeltas = {
    horizontal: [1, 0],
    vertical: [0, 1],
    diagonal: [1, 1],
    antiDiagonal: [-1, 1],
  };

  getSquares() {
    const {boardDimensions: {width, height}, moves} = this.props,
          squares = new Array(width * height).fill(null);
    let xIsNext = true;
    for (let i = 0; i < moves.length; i++) {
      squares[moves[i]] = xIsNext ? 'X' : 'O';
      xIsNext = !xIsNext;
    }
    return squares;
  }

  handleClick(move) {
    const {moves, isGameEnded, addMove} = this.props;
    if (isGameEnded || moves.includes(move)) return;
    addMove(move);
  }

  render() {
    const {boardDimensions: {width, height}} = this.props,
          squares = this.getSquares(),
          rows = [];
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      const rowBegin = rowIndex * width,
            rowEnd = rowBegin + width;
      rows.push(
        <Row
          key={rowIndex}
          {
            ...{
              rowIndex,
              width,
              squares: squares.slice(rowBegin, rowEnd),
              onClick: i => this.handleClick(i)
            }
          }
        />
      );
    }
    return (
    <div>
      {rows}
    </div>
    );
  }

}

export default Board;
