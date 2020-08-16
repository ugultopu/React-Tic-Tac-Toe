import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.validateProps();
    this.state = {
      // Array of indices. The indices refer to an array that
      // represents the game board (that is, a matrix).
      moves: [],
      stepNumber: 0,
      // Array of tuples (a tuple is an array of two elements).
      winningEndpoints: [],
    };
  }

  validateProps() {
    if (
      Math.max(...Object.values(this.props.numElementsRequiredForWin))
      >
      Math.min(...Object.values(this.props.boardDimensions))
    ) {
      throw new RangeError("Number of elements required to win " +
                           "cannot be bigger than board dimensions.");
    }
  }

  /*
   * Returns [rowIndex, columnIndex] representation of a regular array
   * index, where the array represents a matrix (that is, a
   * two-dimensional array).
   */
  getTupleForMove(move) {
    const {width} = this.props.boardDimensions;
    return [move % width, Math.floor(move / width)];
  }

  getPlayerMovesAsTuples(forX = true) {
    const {moves} = this.state;
    const movesAsTuples = [];
    for (let i = forX ? 0 : 1; i < moves.length; i+=2) {
      movesAsTuples.push(this.getTupleForMove(moves[i]));
    }
    return movesAsTuples;
  }

  isPointValid(point) {
    const {width, height} = this.props.boardDimensions;
    return (
      !(point[0] < 0) && (point[0] < width)
      &&
      !(point[1] < 0) && (point[1] < height)
    );
  }

  sumArrays(a1, a2, mul) {
    return a1.map((e, i) => e + mul * a2[i]);
  }

  doesArrayIncludeSubArray(arrayOfArrays, subArray) {
    return arrayOfArrays.some(
             elementArray => subArray.every(
                               (e, i) => e === elementArray[i]
                             )
           );
  }

  checkWin() {
    const directionToTupleMappings = {
            horizontal: [1, 0],
            vertical: [0, 1],
            diagonal: [1, 1],
            antiDiagonal: [-1, 1]
          },
          lastPlayerMoves = this.getPlayerMovesAsTuples(
                              this.state.moves.length % 2 !== 0
                            ),
          lastMove = lastPlayerMoves[lastPlayerMoves.length - 1],
          {numElementsRequiredForWin} = this.props,
          winningEndpoints = [];
    numElementsRequiredForWin.antiDiagonal
      = numElementsRequiredForWin.diagonal;
    console.log(lastPlayerMoves);
    for (const direction in directionToTupleMappings) {
      const delta = directionToTupleMappings[direction],
            targetNumElements = numElementsRequiredForWin[direction],
            endPoints = [this.sumArrays(lastMove, delta, -1),
                         this.sumArrays(lastMove, delta, 1)],
            finalEndPoints = [];
      let numElements = 1;
      console.log('direction is ' + direction);
      console.log('endPoints are ');
      console.log(endPoints);
      for (let idx = 0; idx < endPoints.length; idx++) {
        let point = endPoints[idx];
        let multiplier = (idx === 0 ? -1 : 1);
        console.log('idx is ' + idx);
        console.log('point is ' + point);
        console.log('multiplier is ' + multiplier);
        while (this.isPointValid(point)
            && this.doesArrayIncludeSubArray(lastPlayerMoves, point)
              ) {
          numElements++;
          point = this.sumArrays(point, delta, multiplier);
        }
        console.log('numElements are ' + numElements);
        finalEndPoints[idx] = point;
      }
      if (numElements === targetNumElements) {
        winningEndpoints.push(finalEndPoints);
      }
    }
    this.setState({
      winningEndpoints
    });
  }

  isGameEnded() {
    const {winningEndpoints, stepNumber, moves} = this.state;
    return winningEndpoints.length > 0 && stepNumber === moves.length;
  }

  handleClick(move) {
    const {moves, stepNumber} = this.state;
    const movesUntilStep = moves.slice(0, stepNumber);
    if (this.isGameEnded() || movesUntilStep.includes(move)) return;
    this.setState({
      moves: [...movesUntilStep, move],
      winningEndpoints: [],
      stepNumber: stepNumber + 1,
    }, this.checkWin);
  }

  jumpTo(stepNumber) {
    this.setState({stepNumber});
  }

  getSquaresFromMoves() {
    const {width, height} = this.props.boardDimensions,
          squares = new Array(width * height).fill(null);
    let xIsNext = true;
    for (let i = 0; i < this.state.stepNumber; i++) {
      squares[this.state.moves[i]] = xIsNext ? 'X' : 'O';
      xIsNext = !xIsNext;
    }
    return squares;
  }

  render() {
    const {moves, stepNumber} = this.state;

    const movesList = moves.map((_, idx) => {
      const sliceIndex = idx + 1;
      return (
        <li key={sliceIndex}>
          <button onClick={() => this.jumpTo(sliceIndex)}>
            {'Go to move #' + sliceIndex}
          </button>
        </li>
      );
    });

    let status;
    if (this.isGameEnded()) {
      status = 'Winner: ' + (moves.length % 2 === 0 ? 'O' : 'X');
    } else {
      status = 'Next player: ' + (stepNumber % 2 === 0 ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            boardDimensions={this.props.boardDimensions}
            squares={this.getSquaresFromMoves()}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>
            <li key={0}>
              <button onClick={() => this.jumpTo(0)}>Go to game start</button>
            </li>
            {movesList}
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game
    boardDimensions={{
      width: 5,
      height: 7,
    }}
    numElementsRequiredForWin={{
      horizontal: 3,
      vertical: 3,
      diagonal: 3,
    }}
  />,
  document.getElementById('root')
);
