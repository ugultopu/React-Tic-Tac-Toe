import React from 'react';
import Board from 'Board';
import {Status, Steps} from 'components';
import {
  sumArrays,
  isArrayInArrayOfArrays,
} from 'arrayUtils';

class Game extends React.Component {

  static validateProps(props) {
    const {numElementsRequiredForWin, boardDimensions} = props;
    if (
      Math.max(...Object.values(numElementsRequiredForWin))
      >
      Math.min(...Object.values(boardDimensions))
    ) {
      throw new RangeError("Number of elements required to win " +
                           "cannot be bigger than board dimensions.");
    }
  }

  static isGameEnded(numberOfMoves, stepNumber, numberOfWinningEndpoints) {
    return stepNumber === numberOfMoves && numberOfWinningEndpoints > 0;
  }

  static getMovesUntilStep(moves, stepNumber) {
    return moves.slice(0, stepNumber);
  }

  static getWinningEndpointsForDirection(
    delta,
    target,
    lastMove,
    squares,
  ) {
    const player = squares[lastMove[0]][lastMove[1]],
          endpoints = [];
    let numElements = 1;
    for (let i = 0; i < 2; i++) {
      const multiplier = (i === 0 ? -1 : 1);
      let point = sumArrays(lastMove, delta, multiplier);
      while (squares[point[0]]?.[point[1]] === player) {
        numElements++;
        endpoints[i] = point;
        point = sumArrays(point, delta, multiplier);
      }
    }
    if (numElements === target) return endpoints;
  }

  static getWinningEndpoints(
    lastMove,
    squares,
    numElementsRequiredForWin
  ) {
    numElementsRequiredForWin.antiDiagonal = numElementsRequiredForWin.diagonal;
    const directionDeltas = {
            horizontal: [0, 1],
            vertical: [1, 0],
            diagonal: [1, 1],
            antiDiagonal: [-1, 1],
          },
          winningEndpoints = [];
    for (const direction in directionDeltas) {
      const delta = directionDeltas[direction],
            target = numElementsRequiredForWin[direction],
            endpoints = Game.getWinningEndpointsForDirection(
                          delta,
                          target,
                          lastMove,
                          squares,
                        );
      if (endpoints) winningEndpoints.push(endpoints);
    }
    return winningEndpoints;
  }

  static getNewSquaresAfterJump(
    moves,
    previousStepNumber,
    stepNumber,
    squares
  ) {
    const beginIndex = previousStepNumber,
            endIndex = stepNumber;
    if (endIndex > beginIndex) {
      const movesToAdd = moves.slice(beginIndex, endIndex);
      let xIsNext = beginIndex % 2 === 0;
      for (const move of movesToAdd) {
        squares[move[0]][move[1]] = xIsNext ? 'X' : 'O';
        xIsNext = !xIsNext;
      }
    } else {
      const movesToRemove = moves.slice(endIndex, beginIndex);
      for (const move of movesToRemove) squares[move[0]][move[1]] = null;
    }
    return squares;
  }

  constructor(props) {
    Game.validateProps(props);
    super(props);
    const {boardDimensions: {width, height}} = this.props;
    this.state = {
      // Array of tuples. Each tuple is of form [rowIndex, colIndex],
      // with the topmost row and leftmost column having indices 0.
      moves: [],
      stepNumber: 0,
      // NOTE: 'squares' is derived from 'moves'.
      squares: Array.from(Array(height), () => Array(width).fill(null)),
      // NOTE: 'winningEndpoints is derived from 'moves. It is an array
      // of tuples (a tuple is an array of two elements).
      winningEndpoints: [],
    };
  }

  addMove = move => {
    this.setState((
      {moves, stepNumber, squares, winningEndpoints},
      {numElementsRequiredForWin}
    ) => {
      const isGameEnded = Game.isGameEnded(
              moves.length,
              stepNumber,
              winningEndpoints.length
            );
      moves = Game.getMovesUntilStep(moves, stepNumber);
      if (isGameEnded || isArrayInArrayOfArrays(moves, move)) return;
      squares[move[0]][move[1]] = stepNumber % 2 === 0 ? 'X' : 'O';
      stepNumber++;
      moves.push(move);
      return {
        moves,
        stepNumber,
        squares,
        winningEndpoints: Game.getWinningEndpoints(
          move,
          squares,
          numElementsRequiredForWin,
        ),
      }
    });
  }

  jumpTo = newStepNumber => {
    this.setState(({moves, stepNumber, squares}) => ({
      stepNumber: newStepNumber,
      squares: Game.getNewSquaresAfterJump(
                moves,
                stepNumber,
                newStepNumber,
                squares
              ),
    }));
  }

  render() {
    const {
      state: {
        squares,
        stepNumber,
        moves,
        winningEndpoints: {length: numberOfWinningEndpoints}
      },
      addMove,
      jumpTo
    } = this;
    return (
      <div className="game">
        <div className="game-board">
          <Board {...{squares, addMove}} />
        </div>
        <div className="game-info">
          <Status
            isGameEnded={Game.isGameEnded(
                          moves.length,
                          stepNumber,
                          numberOfWinningEndpoints,
                        )}
            isStepNumberEven={stepNumber % 2 === 0}
          />
          <Steps {...{moves, jumpTo}} />
        </div>
      </div>
    );
  }

}

export default Game;
