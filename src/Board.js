import React from 'react';

const Square = ({value, onClick}) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

const Row = ({
  rowIndex,
  width,
  values,
  handleClick,
}) => (
  <div className="board-row" key={rowIndex}>
    {[...Array(width).keys()].map(colIndex => (
      <Square
        key={colIndex}
        value={values[colIndex]}
        onClick={() => handleClick(rowIndex * width + colIndex)}
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

  getValuesForRow(rowIndex) {
    const {boardDimensions: {width}, moves} = this.props,
          begin = rowIndex * width,
          end = begin + width,
          values = [];
    for (let i = begin; i < end; i++) {
      const moveIndex = moves.indexOf(i);
      if (moveIndex > -1) values.push(moveIndex % 2 === 0 ? 'X' : 'O')
      else values.push(null);
    }
    return values;
  }

  handleClick = move => {
    const {moves, isGameEnded, addMove} = this.props;
    if (isGameEnded || moves.includes(move)) return;
    addMove(move);
  }

  render() {
    const {boardDimensions: {width, height}} = this.props,
          rows = [];
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      rows.push(
        <Row
          key={rowIndex}
          {
            ...{
              rowIndex,
              width,
              values: this.getValuesForRow(rowIndex),
              handleClick: this.handleClick
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
