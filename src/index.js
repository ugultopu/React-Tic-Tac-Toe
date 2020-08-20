import React from 'react';
import ReactDOM from 'react-dom';
import Game from 'Game';
import 'index.css';

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
