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
          winningEndpoints = [];
    numElementsRequiredForWin.antiDiagonal
      = numElementsRequiredForWin.diagonal;
    for (const direction in util.board.directionToTupleMappings) {
      const endpoints = util.board.checkWinForDirection(
        lastPlayerMoves,
        numElementsRequiredForWin[direction],
        boardDimensions,
        direction
      );
      if (endpoints) winningEndpoints.push(endpoints);
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
