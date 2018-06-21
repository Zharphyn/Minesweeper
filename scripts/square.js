/*
* Minesweeper Game code for each square on the minefield
* One single cell of the Minesweeper app and the data it contains
* Copyright (c) 2018 Brad Thiessen, App Rights Reserved
*/
'use strict';

export const SQUARE = {
    MIN: 0,
    MAX: 8
}


export class Square {

    constructor() {
        this.mine = false
        this.adjacentMines = 0;
    }

    get mine() {
        return this._mine;
      }
  
    set mine(value) {
        this._mine = value;
      }

    getAdjacentMines() {
        return this.adjacentMines;
    }

    addAdjacentMines(value){
        this.adjacentMines = value;
    }
    addAdjacent () { this.adjacentMines++ }
}