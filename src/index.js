import {
  Ship,
  GameBoard,
  Player
} from './models';
import {
  initializePlayer1Board,
  renderPlayer1GameBoardState,
  renderPlayer2GameBoard,
  renderPlayer2GameBoardState,
  announceWinner
} from './DOM';
import './css/gameBoard.css';
import './css/coordinate.css';
import './css/index.css';

const player1 = new Player("player1", "real");
const player2 = new Player("computer", "computer");

const player1Name = document.getElementById("player1-name");
const player2Name = document.getElementById("player2-name");
const newGameBtn = document.getElementById("new-game");
const player2GameBoard = document.getElementById("player2-board");

player1Name.textContent = player1._name;
player2Name.textContent = player2._name;

initializePlayer1Board();
// initializePlayer2Board(player2._gameBoard);

// const player1Carrier = new Ship(5);
// player1._gameBoard.place(player1Carrier, [0, 0]);
// const player2Carrier = new Ship(5);
// player2._gameBoard.place(player2Carrier, [4, 4]);
// player2._gameBoard.receiveAttack([5, 4]);
// player1._gameBoard.receiveAttack([0, 3]);
// player2._gameBoard.receiveAttack([4, 4]);

// renderPlayer1GameBoardState(player1._gameBoard);
renderPlayer2GameBoard(player2._gameBoard);

newGameBtn.addEventListener("click", newGame)

let availableCoordinates = [];
let availableMoves = [];


export function newGame() {
  const newPlayer1 = new Player("you", "real");
  const newPlayer2 = new Player("computer", "computer");
  player1Name.textContent = newPlayer1._name;
  player2Name.textContent = newPlayer2._name;

  const player1Carrier = new Ship(5, getRandomInt(2) === 0 ? 'v' : 'h');
  const player1Battleship = new Ship(4, getRandomInt(2) === 0 ? 'v' : 'h');
  const player1Destroyer = new Ship(3, getRandomInt(2) === 0 ? 'v' : 'h');
  const player1Submarine = new Ship(3, getRandomInt(2) === 0 ? 'v' : 'h');
  const player1PatrolBoat = new Ship(2, getRandomInt(2) === 0 ? 'v' : 'h');
  const player2Carrier = new Ship(5, getRandomInt(2) === 0 ? 'v' : 'h');
  const player2Battleship = new Ship(4, getRandomInt(2) === 0 ? 'v' : 'h');
  const player2Destroyer = new Ship(3, getRandomInt(2) === 0 ? 'v' : 'h');
  const player2Submarine = new Ship(3, getRandomInt(2) === 0 ? 'v' : 'h');
  const player2PatrolBoat = new Ship(2, getRandomInt(2) === 0 ? 'v' : 'h');

  availableCoordinates = [];
  for (let verticalIndex = 0; verticalIndex < 10; verticalIndex++) {
    for (let horizontalIndex = 0; horizontalIndex < 10; horizontalIndex++) {
      availableCoordinates.push([horizontalIndex, verticalIndex].toString());
    }
  }

  randomizeGameBoard(player1Battleship, newPlayer1._gameBoard);
  randomizeGameBoard(player1Carrier, newPlayer1._gameBoard);
  randomizeGameBoard(player1Destroyer, newPlayer1._gameBoard);
  randomizeGameBoard(player1Submarine, newPlayer1._gameBoard);
  randomizeGameBoard(player1PatrolBoat, newPlayer1._gameBoard);

  availableCoordinates = [];
  for (let verticalIndex = 0; verticalIndex < 10; verticalIndex++) {
    for (let horizontalIndex = 0; horizontalIndex < 10; horizontalIndex++) {
      availableCoordinates.push([horizontalIndex, verticalIndex].toString());
    }
  }
  availableMoves = [];
  for (let verticalIndex = 0; verticalIndex < 10; verticalIndex++) {
    for (let horizontalIndex = 0; horizontalIndex < 10; horizontalIndex++) {
      availableMoves.push([horizontalIndex, verticalIndex].toString());
    }
  }

  randomizeGameBoard(player2Battleship, newPlayer2._gameBoard);
  randomizeGameBoard(player2Carrier, newPlayer2._gameBoard);
  randomizeGameBoard(player2Destroyer, newPlayer2._gameBoard);
  randomizeGameBoard(player2Submarine, newPlayer2._gameBoard);
  randomizeGameBoard(player2PatrolBoat, newPlayer2._gameBoard);

  initializePlayer1Board();
  renderPlayer1GameBoardState(newPlayer1._gameBoard);
  renderPlayer2GameBoard(newPlayer2._gameBoard);
  player1Turn(newPlayer1, newPlayer2);
}


function checkWinner(player1, player2) {

}

function player1Turn(player1, player2) {
  if (player1._gameBoard.allSunk()) {
    announceWinner(player2._name);
    return;
  }
  if (player2._gameBoard.allSunk()) {
    announceWinner(player1._name);
    return;
  }
  renderPlayer2GameBoard(player2._gameBoard, player1, player2);
}

export function player2Turn(player1, player2) {
  if (player1._gameBoard.allSunk()) {
    announceWinner(player2._name);
    return;
  }
  if (player2._gameBoard.allSunk()) {
    announceWinner(player1._name);
    return;
  }
  computerTurn(player1._gameBoard, player2._gameBoard);
  player1Turn(player1, player2);
}

function computerTurn(opponentGameBoard, gameBoard) {
  /*
  1.  get available moves at any given time
  2.  randomly choose one of those moves
  3.  call opponent board's receiveAttack passing the chosen move
  4.  remove the chosen move from available moves
  */
  const chosenMoveIndex = getRandomInt(availableMoves.length);
  const chosenMove = availableMoves[chosenMoveIndex];
  availableMoves = availableMoves.filter((move) => move !== chosenMove);
  opponentGameBoard.receiveAttack([Number(chosenMove[0]), Number(chosenMove[2])]);
  renderPlayer2GameBoard(gameBoard)
  renderPlayer1GameBoardState(opponentGameBoard)
}

function randomizeGameBoard(ship, gameBoard) {
  /*
  1.  create an array to hold `availableSpots` for ships at any given time 
  2.  create a queue of `ships` to be placed on the board
  3.  while `ships` is not empty:
      4.  get and remove a `ship` from `ships`
      5.  calculate an array of `legitSpots` for `ship` by:
            for each `spot` of `availableSpots`
              calculate `affectedSpots` if placed `ship` on that `spot` based on its length (and orientation)
              check if all `affectedSpots` are present in `availableSpots`
                true:
                  create an object `candidate` = {
                    spot: `spot`,
                    affectedSpots: `affectedSpots`
                  }
                  add `candidate` to `legitSpots`
      6.  randomly choose a `candidate` from `legitSpots`
      7.  remove `candidate.affectedSpots` from `availableSpots`
  */
  const candidates = [];

  availableCoordinates.forEach((coordinate) => {
    if (ship._orientation === 'v') {
      if (Number(coordinate[2]) + ship._length <= 10) {
        const affectedCoordinates = [];
        let isLegit = true;
        for (let unit = 0; unit < ship._length; unit++) {
          affectedCoordinates.push([Number(coordinate[0]), Number(coordinate[2]) + unit].toString());
        }
        affectedCoordinates.forEach((affectedCoordinate) => {
          if (!availableCoordinates.includes(affectedCoordinate)) {
            isLegit = false;
          }
        });
        if (isLegit) {
          candidates.push({
            _coordinate: coordinate,
            _affectedCoordinates: affectedCoordinates
          });
        }
      }
    } else {
      if (Number(coordinate[0]) + ship._length <= 10) {
        const affectedCoordinates = [];
        let isLegit = true;
        for (let unit = 0; unit < ship._length; unit++) {
          affectedCoordinates.push([Number(coordinate[0] + unit), Number(coordinate[2])].toString());
        }
        affectedCoordinates.forEach((affectedCoordinate) => {
          if (!availableCoordinates.includes(affectedCoordinate)) {
            isLegit = false;
          }
        });
        if (isLegit) {
          candidates.push({
            _coordinate: coordinate,
            _affectedCoordinates: affectedCoordinates
          });
        }
      }
    }

  })

  const selectedCandidateIndex = getRandomInt(candidates.length);
  const selectedCandidate = candidates[selectedCandidateIndex];
  availableCoordinates = availableCoordinates.filter((coordinate) => !selectedCandidate._affectedCoordinates.includes(coordinate))
  gameBoard.place(ship, [Number(selectedCandidate._coordinate[0]), Number(selectedCandidate._coordinate[2])]);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}