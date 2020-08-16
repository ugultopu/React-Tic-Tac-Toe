// Array
function sumArrays(a1, a2, mul) {
  return a1.map((e, i) => e + mul * a2[i]);
}

function doesArrayIncludeSubArray(arrayOfArrays, subArray) {
  return arrayOfArrays.some(
           elementArray => subArray.every(
                             (e, i) => e === elementArray[i]
                           )
         );
}

// Board
const directionToTupleMappings = {
        horizontal: [1, 0],
        vertical: [0, 1],
        diagonal: [1, 1],
        antiDiagonal: [-1, 1],
      };

function isPointValid(point, boardDimensions) {
  const {width, height} = boardDimensions;
  return (
    !(point[0] < 0) && (point[0] < width)
    &&
    !(point[1] < 0) && (point[1] < height)
  );
}

/*
 * Returns [rowIndex, columnIndex] representation of a regular array
 * index, where the array represents a matrix (that is, a
 * two-dimensional array).
 */
function getTupleForMove(move, boardDimensions) {
  const {width} = boardDimensions;
  return [move % width, Math.floor(move / width)];
}

function getPlayerMovesAsTuples(moves, boardDimensions, forX = true) {
  const movesAsTuples = [];
  for (let i = forX ? 0 : 1; i < moves.length; i+=2) {
    movesAsTuples.push(getTupleForMove(moves[i], boardDimensions));
  }
  return movesAsTuples;
}

function getSquaresFromMoves(boardDimensions, stepNumber, moves) {
  const {width, height} = boardDimensions,
        squares = new Array(width * height).fill(null);
  let xIsNext = true;
  for (let i = 0; i < stepNumber; i++) {
    squares[moves[i]] = xIsNext ? 'X' : 'O';
    xIsNext = !xIsNext;
  }
  return squares;
}

export default {
  array: {sumArrays, doesArrayIncludeSubArray},
  board: {
    directionToTupleMappings,
    isPointValid,
    getPlayerMovesAsTuples,
    getSquaresFromMoves,
  },
}
