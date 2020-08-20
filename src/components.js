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

const Step = ({sliceIndex, onClick}) => (
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
)

const Steps = ({moves, onClick}) => (
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
)

export {Status, Steps}
