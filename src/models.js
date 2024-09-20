export class Ship {
  _length;
  _hitsCount = 0;
  _orientation = 'v';
  constructor(length, orientation) {
    this._length = length;
    if (orientation) {
      this._orientation = orientation;
    }
  }
  hit() {
    if (this._hitsCount < this._length) {
      this._hitsCount++;
    }
  }
  isSunk() {
    return this._hitsCount === this._length;
  }
}

export class GameBoard {
  _state;
  _ships = [];
  constructor() {
    this._state = [];
    for (let vertical = 0; vertical < 10; vertical++) {
      this._state.push([]);
      for (let horizontal = 0; horizontal < 10; horizontal++) {
        this._state[vertical].push({
          _hit: false,
          _miss: false,
          _ship: null
        });
      }
    }
  }

  place(ship, coordinate) {
    const verticalCoordinate = coordinate[1];
    const horizontalCoordinate = coordinate[0];
    if (ship._orientation === 'v') {
      if (horizontalCoordinate > 9) {
        throw new Error("can not place ship overflowing the board horizontally");
      }
    } else {
      if (verticalCoordinate > 9) {
        throw new Error("can not place ship overflowing the board vertically");
      }
    }

    if (this._state[verticalCoordinate][horizontalCoordinate]._ship !== null) {
      throw new Error("there is an existing ship at that coordinate");
    }
    if (ship._orientation === 'v') {
      if (verticalCoordinate + ship._length <= 10) {
        for (let unit = 0; unit < ship._length; unit++) {
          this._state[verticalCoordinate + unit][horizontalCoordinate]._ship = ship;
        }
        this._ships.push(ship);
      } else {
        throw new Error("ship is overflowing the board");
      }
    } else {
      if (horizontalCoordinate + ship._length <= 10) {
        for (let unit = 0; unit < ship._length; unit++) {
          this._state[verticalCoordinate][horizontalCoordinate + unit]._ship = ship;
        }
        this._ships.push(ship);
      } else {
        throw new Error("can not place ship overflowing board horizontally");
      }
    }
  }

  receiveAttack(coordinate) {
    const verticalCoordinate = coordinate[1];
    const horizontalCoordinate = coordinate[0];
    if (this._state[verticalCoordinate][horizontalCoordinate]._hit ||
      this._state[verticalCoordinate][horizontalCoordinate]._miss
    ) {
      throw new Error("this coordinate is already attacked");
    }

    if (this._state[verticalCoordinate][horizontalCoordinate]._ship !== null) {
      this._state[verticalCoordinate][horizontalCoordinate]._ship.hit();
      this._state[verticalCoordinate][horizontalCoordinate]._hit = true;
    } else {
      this._state[verticalCoordinate][horizontalCoordinate]._miss = true;
    }

  }

  allSunk() {
    let result = true;
    this._ships.forEach((ship) => {
      if (!ship.isSunk()) {
        result = false;
      }
    })
    return result;
  }
}

export class Player {
  _type;
  _name;
  _gameBoard;
  constructor(name, type) {
    this._name = name;
    this._type = type;
    this._gameBoard = new GameBoard();
  }
}