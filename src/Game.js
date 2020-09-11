import React from 'react';
import Board from 'Board';
import {Status, Steps} from 'components';
import {
  sumArrays,
  arrayOfArraysIncludesArray,
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

  static getWinningEndpointsForDirection(
    delta,
    target,
    lastMove,
    squares,
  ) {
    const player = squares[lastMove[0]][lastMove[1]],
          endpoints = [lastMove, lastMove];
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
    squares = [...squares];
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
    props.numElementsRequiredForWin.antiDiagonal
      = props.numElementsRequiredForWin.diagonal;
    super(props);
    const {boardDimensions: {width, height}} = this.props;
    this.state = {
      // Essential state. The elements below cannot be derived from
      // other state elements.
      //
      // 'moves' is an array of tuples. Each tuple is of form [rowIndex,
      // colIndex], with the topmost row and leftmost column having
      // indices 0.
      moves: [],
      stepNumber: 0,
      // Derived state. The elements below can be derived using
      // essential state elements.
      squares: Array.from(Array(height), () => Array(width).fill(null)),
      winningEndpoints: [],
      gameEnded: false,
    };
  }

  addMove = move => {
    this.setState(({moves, stepNumber, squares, gameEnded}) => {
      if (gameEnded) return;
      moves = moves.slice(0, stepNumber);
      if (arrayOfArraysIncludesArray(moves, move)) return;
      // I think I need to copy 'squares' to prevent changing game state.
      squares = [...squares];
      squares[move[0]][move[1]] = stepNumber % 2 === 0 ? 'X' : 'O';
      moves.push(move);
      stepNumber++;
      const winningEndpoints = Game.getWinningEndpoints(
        move,
        squares,
        this.props.numElementsRequiredForWin,
      );
      return {
        moves,
        stepNumber,
        squares,
        winningEndpoints,
        gameEnded: winningEndpoints.length > 0,
      }
    });
  }

  jumpTo = newStepNumber => {
    this.setState(({moves, stepNumber, squares, winningEndpoints}) => ({
      stepNumber: newStepNumber,
      squares: Game.getNewSquaresAfterJump(
                moves,
                stepNumber,
                newStepNumber,
                squares
              ),
      gameEnded: winningEndpoints.length > 0 && newStepNumber === moves.length
    }));
  }

  render() {
    const {
      state: {moves, squares, stepNumber, gameEnded},
      props: {boardDimensions: {width, height}},
      addMove,
      jumpTo
    } = this;
    const stepNumberEven = this.state.stepNumber % 2 === 0,
          itsADraw = stepNumber === moves.length
                     && moves.length === height * width;
    return (
      <div className="game">
        <div className="game-board">
          <Board {...{squares, addMove}} />
        </div>
        <div className="game-info">
          <Status {...{gameEnded, stepNumberEven, itsADraw}} />
          <Steps {...{moves, stepNumber, jumpTo}} />
        </div>
      </div>
    );
  }

}

export default Game;
