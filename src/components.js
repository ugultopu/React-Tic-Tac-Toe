import React from 'react';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Row(props) {
  const {rowIndex, width, squares, onClick} = props,
        cols = [];
  for (let colIndex = 0; colIndex < width; colIndex++) {
    const squareIndex = rowIndex * width + colIndex;
    cols.push(
      <Square
        key={colIndex}
        value={squares[colIndex]}
        onClick={() => onClick(squareIndex)}
      />
    );
  }
  return (
    <div className="board-row" key={rowIndex}>
      {cols}
    </div>
  );
}

function Board(props) {
  const {boardDimensions: {width, height}, squares, onClick} = props,
        rows = [];
  for (let rowIndex = 0; rowIndex < height; rowIndex++) {
    const rowBegin = rowIndex * width,
          rowEnd = rowBegin + width;
    rows.push(
      <Row
        key={rowIndex}
        /*
         * What's going on below? As we can understand from the first
         * pair of curly braces (which are rendered as blue with syntax
         * highlighting), we are inlining a block of JavaScript code in
         * JSX. But what are we inlining? We are declaring a JavaScript
         * object (inline declaration using the inner curly braces), and
         * spreading this inline declared object immediately. One
         * interesting part of the object is that we are using "object
         * shorthand" syntax in order to prevent repetition in the
         * declaration. This way, we are preventing repetitive prop
         * declaration. If we didn't do it this way, we would have
         * needed to do it as follows:
         *
         *     rowIndex={rowIndex}
         *     width={width}
         *     squares={squares.slice(rowBegin, rowEnd)}
         *     onClick={onClick}
         *
         * Which is repetitive.
         */
        {
          ...{
            rowIndex,
            width,
            squares: squares.slice(rowBegin, rowEnd),
            onClick,
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

function Status(props) {
  const {isGameEnded, isStepNumberEven} = props;
  return (
    <div>
      {
        isGameEnded
        ?
        `Winner: ${isStepNumberEven ? 'O' : 'X'}`
        :
        `Next player: ${isStepNumberEven ? 'X' : 'O'}`
      }
    </div>
  );
}

function Step(props) {
  const {sliceIndex, onClick} = props;
  return (
    <li key={sliceIndex}>
      <button onClick={() => onClick(sliceIndex)}>
        {
          sliceIndex
          ?
          'Go to move #' + sliceIndex
          :
          'Go to game start'
        }
      </button>
    </li>
  );
}

function Steps(props) {
  const {moves, onClick} = props;
  return (
    <ol>
      <Step
        key={0}
        sliceIndex={0}
        onClick={onClick}
      />
      {
        moves.map((_, idx) => {
          const sliceIndex = idx + 1;
          return (
            <Step
              key={sliceIndex}
              {...{sliceIndex, onClick}}
            />
          );
        })
      }
    </ol>
  );
}

export {Board, Status, Steps}
