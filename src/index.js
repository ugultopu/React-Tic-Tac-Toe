import React from 'react';
import ReactDOM from 'react-dom';
import {Board, Status, Steps} from './components';
import util from './util';
import './index.css';

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

  checkWin() {
    const {moves} = this.state,
          {numElementsRequiredForWin, boardDimensions} = this.props,
          lastPlayerMoves = util.board.getPlayerMovesAsTuples(
                              moves,
                              boardDimensions,
                              moves.length % 2 !== 0
                            ),
          lastMove = lastPlayerMoves[lastPlayerMoves.length - 1],
          winningEndpoints = [];
    numElementsRequiredForWin.antiDiagonal
      = numElementsRequiredForWin.diagonal;
    console.log(lastPlayerMoves);
    for (const direction in util.board.directionToTupleMappings) {
      const delta = util.board.directionToTupleMappings[direction],
            targetNumElements = numElementsRequiredForWin[direction],
            endPoints = [util.array.sumArrays(lastMove, delta, -1),
                         util.array.sumArrays(lastMove, delta, 1)],
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
        while (util.board.isPointValid(point, boardDimensions)
            && util.array.doesArrayIncludeSubArray(lastPlayerMoves, point)
              ) {
          numElements++;
          point = util.array.sumArrays(point, delta, multiplier);
        }
        console.log('numElements are ' + numElements);
        finalEndPoints[idx] = point;
      }
      if (numElements === targetNumElements) {
        winningEndpoints.push(finalEndPoints);
      }
    }
    this.setState({winningEndpoints});
  }

  isGameEnded() {
    const {winningEndpoints, stepNumber, moves} = this.state;
    return winningEndpoints.length > 0 && stepNumber === moves.length;
  }

  handleClick(move) {
    const {moves, stepNumber} = this.state,
          movesUntilStep = moves.slice(0, stepNumber);
    if (this.isGameEnded() || movesUntilStep.includes(move)) return;
    this.setState({
      moves: [...movesUntilStep, move],
      winningEndpoints: [],
      stepNumber: stepNumber + 1,
    }, this.checkWin);
  }

  jumpTo(stepNumber) { this.setState({stepNumber}); }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            boardDimensions={this.props.boardDimensions}
            squares={util.board.getSquaresFromMoves(
                      this.props.boardDimensions,
                      this.state.stepNumber,
                      this.state.moves,
                    )}
            onClick={i => this.handleClick(i)}
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
