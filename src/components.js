import React from 'react';

const Status = ({isGameEnded, isStepNumberEven}) => (
  <div>
    {
      isGameEnded
      ?
      `Winner: ${isStepNumberEven ? 'O' : 'X'}`
      :
      `Next player: ${isStepNumberEven ? 'X' : 'O'}`
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

const Steps = ({moves, jumpTo}) => (
  <ol>
    <Step
      key={0}
      sliceIndex={0}
      jumpTo={jumpTo}
    />
    {
      moves.map((_, idx) => {
        const sliceIndex = idx + 1;
        return (
          <Step
            key={sliceIndex}
            {...{sliceIndex, jumpTo}}
          />
        );
      })
    }
  </ol>
)

export {Status, Steps}
