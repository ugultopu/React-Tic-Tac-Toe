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

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

/*
 * A mapping of the number of steps we need to take to go to a
 * direction. First element represents the horizontal direction and the
 * second element represents the vertical direction. Positive represents
 * right for horizontal (and DOWN for vertical). Negative represents left
 * for horizontal (and UP for vertical).
 */
directions = {
  north: [0, -1],
  northEast: [1, -1],
  east: [1, 0],
  southEast: [1, 1],
  south: [0, 1],
  southWest: [-1, 1],
  west: [-1, 0],
  northWest: [-1, -1]
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Arrays of tuples ([rowIndex, columnIndex])
      moves: {
        x: [],
        o: [],
      },
      /*
       * Actually, no. Just keep the simple, one dimentional moves
       * array, and keep the functions that extract the moves as arrays
       * of tuples for each player. This is THE RIGHT WAY (TM) of doing
       * this, as this prevents duplicate, repetitive, unnecessary data
       * representation. However, if you like better performance, you
       * can consider _memoizing_ the functions that extract "workable"
       * data from the "real, condensed data" (which is the simple, one
       * dimensional moves array).
       */
      xIsNext: true,
      gameEnded: false,
    };
  }

  /*
   * Returns [rowIndex, columnIndex] representation of a regular array
   * index, where the array represents a matrix (that is, a
   * two-dimensional array).
   */
  getTupleForIndex(index) {
    const {width} = this.props.boardDimensions;
    return [Math.floor(index / width), index % width];
  }

  isGameEnded() {
    const {moves} = this.state,
          lastMove = moves[moves.length - 1],
          lastMoveAsTuple = this.getTupleForIndex(lastMove);

  }

  handleClick(i) {
    const {gameEnded, moves} = this.state;
    if (gameEnded || i in moves) return;
    this.setState({
      moves: [...moves, move],
      gameEnded: isGameEnded(),
    });

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game
    boardDimensions={{
      width: 3,
      height: 3,
    }}
    numElementsRequiredForWin={{
      horizontal: 3,
      vertical: 3,
      sequential: 3,
    }}
  />,
  document.getElementById('root')
);
