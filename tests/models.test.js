/* eslint-disable no-undef */
import {
  Ship,
  GameBoard,
  Player
} from '../src/models';

describe('Ship objects tests', () => {
  let ship;
  let ship2;
  beforeEach(() => {
    ship = new Ship(3);
    ship2 = new Ship(3, 'h');
  });

  test("Ship objects include their length", () => {
    expect(ship._length).toBe(3);
  });

  test("Ship objects include the number of times they've been hit", () => {
    expect(ship._hitsCount).toBe(0);
  });

  test("hit() function of ship objects", () => {
    ship.hit();
    expect(ship._hitsCount).toBe(1);
  })

  test("isSunk() function of ship objects", () => {
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("ship object includes orientation", () => {
    expect(ship2._orientation).toBe('h');
  })

  test("ship object always include orientation", () => {
    expect(ship._orientation).toBe('v');
  })
})

describe("GameBoard objects tests", () => {
  let gameBoard;
  let resultingGameBoard;
  beforeEach(() => {
    gameBoard = new GameBoard();
    resultingGameBoard = [];
    for (let vertical = 0; vertical < 10; vertical++) {
      resultingGameBoard.push([]);
      for (let horizontal = 0; horizontal < 10; horizontal++) {
        resultingGameBoard[vertical].push({
          _hit: false,
          _miss: false,
          _ship: null
        });
      }
    }
  })

  test("game board dimension", () => {
    expect(JSON.stringify(gameBoard._state)).toBe(JSON.stringify(resultingGameBoard));
    expect(gameBoard._state.length).toBe(10);
    expect(gameBoard._state[0].length).toBe(10);
  })

  test("place a ship at a specific coordinate", () => {
    const testShip1 = new Ship(2);
    gameBoard.place(testShip1, [0, 0]);
    resultingGameBoard[0][0]._ship = testShip1;
    resultingGameBoard[1][0]._ship = testShip1;
    expect(JSON.stringify(gameBoard._state)).toBe(JSON.stringify(resultingGameBoard));
    expect(JSON.stringify(gameBoard._ships)).toBe(JSON.stringify([testShip1]));
  })

  test("place a ship with horizontal orientation at a specific coordinate", () => {
    const testShip1 = new Ship(2, 'h');
    gameBoard.place(testShip1, [0, 0]);
    resultingGameBoard[0][0]._ship = testShip1;
    resultingGameBoard[0][1]._ship = testShip1;
    expect(JSON.stringify(gameBoard._state)).toBe(JSON.stringify(resultingGameBoard));
    expect(JSON.stringify(gameBoard._ships)).toBe(JSON.stringify([testShip1]));
  })


  test("place multiple ships onto the board", () => {
    const testShip1 = new Ship(1);
    const testShip2 = new Ship(2);
    gameBoard.place(testShip1, [2, 3]);
    gameBoard.place(testShip2, [5, 6]);
    resultingGameBoard[3][2]._ship = testShip1;
    resultingGameBoard[6][5]._ship = testShip2;
    resultingGameBoard[7][5]._ship = testShip2;
    expect(JSON.stringify(gameBoard._state)).toBe(JSON.stringify(resultingGameBoard));
    expect(JSON.stringify(gameBoard._ships)).toBe(JSON.stringify([testShip1, testShip2]));
  })

  test("place multiple ships with different orientations onto the board", () => {
    const testShip1 = new Ship(1);
    const testShip2 = new Ship(2, 'h');
    gameBoard.place(testShip1, [2, 3]);
    gameBoard.place(testShip2, [5, 6]);
    resultingGameBoard[3][2]._ship = testShip1;
    resultingGameBoard[6][5]._ship = testShip2;
    resultingGameBoard[6][6]._ship = testShip2;
    expect(JSON.stringify(gameBoard._state)).toBe(JSON.stringify(resultingGameBoard));
    expect(JSON.stringify(gameBoard._ships)).toBe(JSON.stringify([testShip1, testShip2]));
  })

  test("place a ship overflowing the board vertically", () => {
    const testShip1 = new Ship(2);
    expect(() => gameBoard.place(testShip1, [0, 9])).toThrow();
  })

  test("place a horizontal ship overflowing the board vertically", () => {
    const testShip1 = new Ship(3, 'h');
    expect(() => gameBoard.place(testShip1, [0, 10])).toThrow("can not place ship overflowing the board vertically");
  })

  test("place a ship overflowing the board horizontally", () => {
    const testShip1 = new Ship(3);
    expect(() => gameBoard.place(testShip1, [10, 0])).toThrow("can not place ship overflowing the board horizontally");
  })

  test("place a horizontal ship overflowing board horizontally", () => {
    const testShip1 = new Ship(3, 'h');
    expect(() => gameBoard.place(testShip1, [8, 0])).toThrow("can not place ship overflowing board horizontally");
  })

  test("place a ship onto an existing ship", () => {
    const testShip1 = new Ship(2);
    const testShip2 = new Ship(1, 'h');
    gameBoard.place(testShip1, [0, 0]);
    expect(() => gameBoard.place(testShip2, [0, 1])).toThrow();
  })

  test("receive hit attack", () => {
    const testShip1 = new Ship(3);
    gameBoard.place(testShip1, [0, 0]);
    gameBoard.receiveAttack([0, 0]);
    resultingGameBoard[0][0]._ship = testShip1;
    resultingGameBoard[1][0]._ship = testShip1;
    resultingGameBoard[2][0]._ship = testShip1;
    resultingGameBoard[0][0]._hit = true;
    expect(testShip1._hitsCount).toBe(1);
    expect(JSON.stringify(gameBoard._state)).toBe(JSON.stringify(resultingGameBoard));
  });

  test("receive attack on the attacked coordinate", () => {
    const testShip1 = new Ship(2);
    gameBoard.place(testShip1, [0, 0]);
    gameBoard.receiveAttack([0, 0]);
    resultingGameBoard[0][0]._ship = testShip1;
    resultingGameBoard[1][0]._ship = testShip1;
    resultingGameBoard[0][0]._hit = true;
    expect(testShip1._hitsCount).toBe(1);
    expect(() => gameBoard.receiveAttack([0, 0])).toThrow("this coordinate is already attacked");
    expect(testShip1._hitsCount).toBe(1);
  })

  test("receive miss attack", () => {
    const testShip1 = new Ship(3);
    gameBoard.place(testShip1, [0, 0]);
    gameBoard.receiveAttack([1, 0]);
    resultingGameBoard[0][0]._ship = testShip1;
    resultingGameBoard[1][0]._ship = testShip1;
    resultingGameBoard[2][0]._ship = testShip1;
    resultingGameBoard[0][1]._miss = true;
    expect(testShip1._hitsCount).toBe(0);
    expect(JSON.stringify(gameBoard._state)).toBe(JSON.stringify(resultingGameBoard));
  })

  test("report whether or not all of their ships have been sunk", () => {
    const testShip1 = new Ship(1);
    const testShip2 = new Ship(2);
    gameBoard.place(testShip1, [0, 0]);
    gameBoard.place(testShip2, [1, 0]);
    resultingGameBoard[0][0]._ship = testShip1;
    resultingGameBoard[0][1]._ship = testShip2;
    resultingGameBoard[1][1]._ship = testShip2;
    resultingGameBoard[0][0]._hit = true;
    resultingGameBoard[0][1]._hit = true;
    resultingGameBoard[1][1]._hit = true;
    gameBoard.receiveAttack([0, 0]);
    expect(testShip1.isSunk()).toBe(true);
    expect(gameBoard.allSunk()).toBe(false);
    gameBoard.receiveAttack([1, 0]);
    expect(testShip2.isSunk()).toBe(false);
    expect(gameBoard.allSunk()).toBe(false);
    gameBoard.receiveAttack([1, 1]);
    expect(testShip2.isSunk()).toBe(true);
    expect(gameBoard.allSunk()).toBe(true);
    expect(JSON.stringify(gameBoard._state)).toBe(JSON.stringify(resultingGameBoard));
  })
})

describe("Player objects tests", () => {
  let gameBoard;
  beforeEach(() => {
    gameBoard = new GameBoard();
  })

  test("real player objects", () => {
    const testPlayer1 = new Player("player 1", "real");
    expect(testPlayer1._name).toBe("player 1");
    expect(testPlayer1._type).toBe("real");
    expect(JSON.stringify(testPlayer1._gameBoard)).toBe(JSON.stringify(gameBoard));
  });

  test("computer player objects", () => {
    const testPlayer1 = new Player("computer player 1", "computer");
    expect(testPlayer1._name).toBe("computer player 1");
    expect(testPlayer1._type).toBe("computer");
    expect(JSON.stringify(testPlayer1._gameBoard)).toBe(JSON.stringify(gameBoard));
  })
})