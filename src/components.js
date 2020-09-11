import React from 'react';

const Status = ({gameEnded, stepNumberEven, itsADraw}) => (
  <div>
    {
      gameEnded
      ?
      `Winner: ${stepNumberEven ? 'O' : 'X'}`
      :
      (
        itsADraw
        ?
        "It's a draw"
        :
        `Next player: ${stepNumberEven ? 'X' : 'O'}`
      )
    }
  </div>
)

const Step = ({sliceIndex, jumpTo}) => (
  <li key={sliceIndex}>
    <button onClick={() => jumpTo(sliceIndex)}>
      {
        sliceIndex
        ?
        'Go to move #' + sliceIndex
        :
        'Go to game start'
      }
    </button>
  </li>
)

const Steps = ({moves, jumpTo}) => {
  // Prepend an invalid, dummy move to symbolize the game start.
  //
  // WARNING Using 'moves.unshift` instead of the spread operator will
  // actually change the contents of the moves in the game's state. The
  // reason is that objects are passed by reference in JavaScript.
  moves = [[-1,-1], ...moves];
  return (
    <ol>
      {moves.map((_, sliceIndex) => (
        <Step
          key={sliceIndex}
          {...{sliceIndex, jumpTo}}
        />
      ))}
    </ol>
  );
}

export {Status, Steps}
