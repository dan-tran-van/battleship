import {
  Ship,
  GameBoard,
  Player
} from './models';
import {
  newGame,
  player2Turn
} from './index';

const player1GameBoard = document.getElementById("player1-board");
const player2GameBoard = document.getElementById("player2-board");
const body = document.querySelector("body");

export function initializePlayer1Board() {
  player1GameBoard.textContent = '';
  for (let verticalIndex = 0; verticalIndex < 10; verticalIndex++) {
    for (let horizontalIndex = 0; horizontalIndex < 10; horizontalIndex++) {
      const coordinate = document.createElement("div");
      coordinate.setAttribute("data-1-vertical-index", verticalIndex);
      coordinate.setAttribute("data-1-horizontal-index", horizontalIndex);
      coordinate.classList.add("coordinate");
      player1GameBoard.append(coordinate);
    }
  }
}

// export function initializePlayer2Board(gameBoard) {
//   for (let verticalIndex = 0; verticalIndex < 10; verticalIndex++) {
//     for (let horizontalIndex = 0; horizontalIndex < 10; horizontalIndex++) {
//       const coordinate = document.createElement("div");
//       coordinate.setAttribute("data-2-vertical-index", verticalIndex);
//       coordinate.setAttribute("data-2-horizontal-index", horizontalIndex);
//       coordinate.classList.add("coordinate");
//       coordinate.addEventListener("click", () => {
//         gameBoard.receiveAttack([horizontalIndex, verticalIndex]);
//         renderPlayer2GameBoard(gameBoard);
//       }, { once: true });
//       player2GameBoard.append(coordinate);
//     }
//   }
// }

export function renderPlayer1GameBoardState(gameBoard) {
  for (let verticalIndex = 0; verticalIndex < 10; verticalIndex++) {
    for (let horizontalIndex = 0; horizontalIndex < 10; horizontalIndex++) {
      const coordinate = document
        .querySelector(`.coordinate[data-1-vertical-index="${verticalIndex}"][data-1-horizontal-index="${horizontalIndex}"]`);
      coordinate.textContent = '';
      if (gameBoard._state[verticalIndex][horizontalIndex]._ship) {
        coordinate.classList.add("coordinate--ship");
        if (gameBoard._state[verticalIndex][horizontalIndex]._ship.isSunk()) {
          coordinate.classList.add("coordinate--sunk");
        }
      }
      if (gameBoard._state[verticalIndex][horizontalIndex]._miss) {
        const missMark = document.createElement("div");
        missMark.classList.add("miss-mark");
        coordinate.classList.add("coordinate--miss");
        coordinate.append(missMark);
      }
      if (gameBoard._state[verticalIndex][horizontalIndex]._hit) {
        coordinate.classList.add("coordinate--hit");
      }

    }
  }
}


export function renderPlayer2GameBoardState(gameBoard) {
  player2GameBoard.textContent = '';
  for (let verticalIndex = 0; verticalIndex < 10; verticalIndex++) {
    for (let horizontalIndex = 0; horizontalIndex < 10; horizontalIndex++) {
      const coordinate = document.createElement("div");
      coordinate.setAttribute("data-2-vertical-index", verticalIndex);
      coordinate.setAttribute("data-2-horizontal-index", horizontalIndex);
      coordinate.classList.add("coordinate-state");
      if (gameBoard._state[verticalIndex][horizontalIndex]._ship) {
        coordinate.classList.add("coordinate-state--ship");
        if (gameBoard._state[verticalIndex][horizontalIndex]._ship.isSunk()) {
          coordinate.classList.add("coordinate-state--sunk");
        }
      }
      if (gameBoard._state[verticalIndex][horizontalIndex]._miss) {
        const missMark = document.createElement("div");
        missMark.classList.add("miss-mark");
        coordinate.textContent = '';
        coordinate.classList.add("coordinate-state--miss");
        coordinate.append(missMark);
      }
      if (gameBoard._state[verticalIndex][horizontalIndex]._hit) {
        coordinate.classList.add("coordinate-state--hit");
      }

      player2GameBoard.append(coordinate);
    }
  }
}

export function renderPlayer2GameBoard(gameBoard, player1, player2) {
  player2GameBoard.textContent = '';
  for (let verticalIndex = 0; verticalIndex < 10; verticalIndex++) {
    for (let horizontalIndex = 0; horizontalIndex < 10; horizontalIndex++) {
      const coordinate = document.createElement("div");
      coordinate.setAttribute("data-2-vertical-index", verticalIndex);
      coordinate.setAttribute("data-2-horizontal-index", horizontalIndex);
      coordinate.classList.add("coordinate");
      if (gameBoard._state[verticalIndex][horizontalIndex]._ship) {
        coordinate.classList.add("coordinate--ship");
        if (gameBoard._state[verticalIndex][horizontalIndex]._ship.isSunk()) {
          coordinate.classList.add("coordinate--sunk");
        }
      }
      if (gameBoard._state[verticalIndex][horizontalIndex]._miss) {
        const missMark = document.createElement("div");
        missMark.classList.add("miss-mark");
        coordinate.textContent = '';
        coordinate.classList.add("coordinate--miss");
        coordinate.append(missMark);
      }
      if (gameBoard._state[verticalIndex][horizontalIndex]._hit) {
        coordinate.classList.add("coordinate--hit");
      }


      if (!(coordinate.classList.contains("coordinate--miss"))) {
        if (!(coordinate.classList.contains("coordinate--hit"))) {
          coordinate.addEventListener("click", () => {
            gameBoard.receiveAttack([horizontalIndex, verticalIndex]);
            renderPlayer2GameBoardState(gameBoard);
            player2Turn(player1, player2);
          }, { once: true });
        }
      }
      player2GameBoard.append(coordinate);
    }
  }
}

export function announceWinner(winner) {
  const winnerAnnouncementDialog = document.createElement("dialog");
  const closeBtn = document.createElement("button");
  const newGameBtn = document.createElement("button");

  closeBtn.textContent = "Close";
  newGameBtn.textContent = "New game";

  const winnerAnnouncement = document.createElement("div");
  winnerAnnouncement.textContent = `${winner} won!`;
  closeBtn.addEventListener("click", () => {
    winnerAnnouncementDialog.close();
    body.removeChild(winnerAnnouncementDialog);
  })

  newGameBtn.addEventListener("click", () => {
    newGame();
    winnerAnnouncementDialog.close();
    body.removeChild(winnerAnnouncementDialog);
  })
  winnerAnnouncementDialog.append(winnerAnnouncement, closeBtn, newGameBtn);
  body.append(winnerAnnouncementDialog);
  winnerAnnouncementDialog.showModal();
}