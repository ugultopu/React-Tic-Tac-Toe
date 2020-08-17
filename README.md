React Tic Tac Toe
=================

## **[Try it here][Live Version]**

[This project][the project] contains my improvements on the [official
React tutorial]. You can [view the code differences][differences from
official tutorial] between my version and the offical version. Some of
my improvements are:

- Redesigned the code so that instead of storing the whole board for
  each step, therefore requiring `boardWidth * boardHeight *
  numberOfMoves` memory, stored only the list of moves in an array named
  `moves`. The elements of the `moves` array are indices that represent
  the squares the move is made on that step.

  To give an example, let's say that `X` moved `(0,0)`, `O` moved `(1,2)`
  and `X` moved to `(2,0)`. On the official tutorial's version, this
  would have been stored as:

      history = {
        ['X',  null, null
         null, null, null
         null, null, null],

        ['X',  null, null
         null, null, null
         null, 'O',  null],

        ['X',  null, 'X',
         null, null, null
         null, 'O',  null],
      }

  In my version, it is stored simply as:

      moves = [0, 7, 2]

  Since we know that `X` and `O` alternate, all we need to do is to
  store the indices sequentially. Then, using this information, we can
  create a representation of the whole board using a function.

- Redesign the function that calculates game end / determines the
  winner. The function in the official tutorial is as follows:

      function calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
      }

  The problem with it is that:

  - It accommodates only `3x3` boards.

  - Every single possible winning combination needs to be enumerated.
    This can be done and placed it in the code as a constant, but it is
    very wasteful for larger boards because the number of possible
    combinations drastically increase when we increase the board
    dimensions.

  For these reasons, I have completely changed how the winner is
  calculated. The new algorithm is as follows:


  - Get the last move from the moves list.

  - Determine which user this last move belongs to. Then, get all moves
    for that user from the moves list and put them in an array.

  - Map that array to a list of coordinates. That is, for example if
    that array contained `[2, 5, 7]`, convert it to
    `[[2,0]],[2,1],[2,2]]`.

  - The last element of that array is the latest move, since we store
    the moves sequentially. Observe the fact that if there is a winning
    combination, it has to contain that last move. Because if not, this
    means that the game was already over in previous moves, and this
    logically cannot be possible. Hence, we know for sure that if there
    is a winner, that winner must contain the last move.

  - Knowing this fact, we check the board:

    - Horizontally
    - Vertically
    - Diagonally (and anti-diagonally)

    starting from that last element and going in both directions
    (up-down, left-right, etc.) for all directions (horizontal,
    vertical, diagonal). For the full algorithm, you can analyze the
    code.

  This way, we can arbitrarily change the board dimensions, as well as
  the number of elements required to win. That is, in the default Tic
  Tac Toe, a player needs a sequence of three elements to win, but with
  this version, the players can configure the board to be, say `10x10`
  and configure the number of elements required to win are five.

- Converted some elements into components to make the code more
  readable. For example, made `Status` and `Steps` function components
  of their own and referred to them from the `Game` component.

TODO
----

- Convert the `Board` component into a class component in order to
  organize the code better. There are a couple functions that would make
  much sense as a member of a class named `Board` and this way, the code
  can be much more readable and maintainable.

- Implement the improvement ideas suggested at the end of the [official
  React tutorial].

- Before starting the game, allow the user to configure the board
  dimensions and number of elements required to win. In the first
  iteration, make the UI to configure these simple input boxes. In the
  second iteration, make it so that the user can hover the cursor and a
  "ghost" board, along with number indicating the width and height would
  appear. The user can change the dimensions by moving the mouse and
  when they are happy, then can either click the left mouse button or
  press <kbd>Return</kbd> to approve the board dimensions.

  Similarly for the number of elements required to win, in the first
  iteration, there would be a simple input box. In the second iteration,
  after selecting the board dimensions, the number of elements required
  to win would appear as a "ghost sequence of elements" within the
  board, and the player would configure the length of this "ghost
  sequence" with arrow keys.

[Live Version]: https://ugultopu.github.io/React-Tic-Tac-Toe
[the project]: https://github.com/ugultopu/React-Tic-Tac-Toe
[differences from official tutorial]:
https://github.com/ugultopu/React-Tic-Tac-Toe/compare/ugultopu:official-tutorial...master
[official React tutorial]: https://reactjs.org/tutorial/tutorial.html
