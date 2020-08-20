import React from 'react';
import Board from './Board';
import {Status, Steps} from './components';
import {
  sumArrays,
  isArrayInArrayOfArrays,
} from './util';

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
    const {numElementsRequiredForWin, boardDimensions} = this.props;
    if (
      Math.max(...Object.values(numElementsRequiredForWin))
      >
      Math.min(...Object.values(boardDimensions))
    ) {
      throw new RangeError("Number of elements required to win " +
                           "cannot be bigger than board dimensions.");
    }
  }

  getCurrentMoves() {
    const {moves, stepNumber} = this.state;
    return moves.slice(0, stepNumber);
  }

  isGameEnded() {
    const {winningEndpoints, stepNumber, moves} = this.state;
    return winningEndpoints.length > 0 && stepNumber === moves.length;
  }

  /*
  * Returns [rowIndex, columnIndex] representation of a regular array
  * index, where the array represents a matrix (that is, a
  * two-dimensional array).
  */
 getPointForMove(move) {
  const {width} = this.props.boardDimensions;
  return [move % width, Math.floor(move / width)];
}

  getLastPlayerMovesAsPoints() {
    const {moves} = this.state,
          isLastPlayerX = moves.length % 2 !== 0,
          lastPlayerMovesAsPoints = [];
    for (let i = isLastPlayerX ? 0 : 1; i < moves.length; i+=2) {
      lastPlayerMovesAsPoints.push(this.getPointForMove(moves[i]));
    }
    return lastPlayerMovesAsPoints;
  }

  isPointValid(point) {
    const {width, height} = this.props.boardDimensions;
    return (
      !(point[0] < 0) && (point[0] < width)
      &&
      !(point[1] < 0) && (point[1] < height)
    );
  }

  getWinningEndpointsForDirection(direction) {
    const lastPlayerMoves = this.getLastPlayerMovesAsPoints(),
          target = this.props.numElementsRequiredForWin[direction],
          delta = Board.directionDeltas[direction],
          lastMove = lastPlayerMoves[lastPlayerMoves.length - 1],
          endpoints = [];
    let numElements = 1;
    for (let i = 0; i < 2; i++) {
      const multiplier = (i === 0 ? -1 : 1);
      let point = sumArrays(lastMove, delta, multiplier);
      while (this.isPointValid(point)
            && isArrayInArrayOfArrays(lastPlayerMoves, point)
      ) {
        numElements++;
        endpoints[i] = point;
        point = sumArrays(point, delta, multiplier);
      }
    }
    if (numElements === target) return endpoints;
  }

  setWinningEndpoints() {
    const winningEndpoints = [];
    for (const direction in Board.directionDeltas) {
      const endpoints = this.getWinningEndpointsForDirection(direction);
      if (endpoints) winningEndpoints.push(endpoints);
    }
    this.setState({winningEndpoints});
  }

  addMove(move) {
    this.setState({
      moves: [...this.getCurrentMoves(), move],
      stepNumber: this.state.stepNumber + 1,
    }, this.setWinningEndpoints);
  }

  jumpTo(stepNumber) { this.setState({stepNumber}); }

  render() {
    const {boardDimensions, numElementsRequiredForWin} = this.props;
    numElementsRequiredForWin.antiDiagonal = numElementsRequiredForWin.diagonal;
    return (
      <div className="game">
        <div className="game-board">
          <Board
            moves={this.getCurrentMoves()}
            {
              ...{
                boardDimensions,
                numElementsRequiredForWin,
                // NOTE: Adding `setWinningEndpoints` like this WILL NOT
                // WORK. Because doing it this way does not bind `this`
                // to current object (Game class instance):
                // setWinningEndpoints
              }
            }
            isGameEnded={this.isGameEnded()}
            addMove={move => this.addMove(move)}
            // This doesn't work either. Again, the requirement is to
            // bind `this` to current instance of the Game class:
            // setWinningEndpoints={setWinningEndpoints}
            // setWinningEndpoints={endpoints => this.setWinningEndpoints(endpoints)}
          />
        </div>
        <div className="game-info">
          <Status
            isGameEnded={this.isGameEnded()}
            isStepNumberEven={this.state.stepNumber % 2 === 0}
          />
          <Steps
            moves={this.state.moves}
            onClick={stepNumber => this.jumpTo(stepNumber)}
          />
        </div>
      </div>
    );
  }
}

export default Game;