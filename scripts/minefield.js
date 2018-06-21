/*
* Minesweeper Game code for each square on the minefield
* One single cell of the Minesweeper app and the data it contains
* Copyright (c) 2018 Brad Thiessen, App Rights Reserved
*/
'use strict';

import {Square} from './square.js'

export class MineField {
    constructor(cols, rows, mines) {
        // create the field
        this.field = [];
        let row = -1;
        let col = -1;
        for (row = 0; row < rows; row++){
            this.field[row] = [];
            // for each column create a square
            for (col = 0; col < cols; col++) {
                this.field[row][col] = new Square();
            }
        }

        // place mines
        for (let i = 0; i < mines; i++) {
            do {
                col = Math.floor(Math.random() * cols);
                row = Math.floor(Math.random() * rows);
            } while (this.field[row][col].mine);
            this.field[row][col].mine = true;
            
            //increase adjacent counter
            for (let rowAdjust = -1; rowAdjust < 2; rowAdjust++){
                for (let colAdjust = -1; colAdjust < 2; colAdjust++){
                    let newRow = row + rowAdjust;
                    let newCol = col + colAdjust;
                    if ((newRow >= 0 && newRow < rows) 
                        && (newCol >= 0 && newCol < cols) 
                        && !(newRow == row && newCol == col)) {
                            let X = this.field[newRow][newCol]
                            X.addAdjacentMines(X.getAdjacentMines() + 1);
                    }
                }

            }
            console.log(row, col);

        }
    }
    get minefield () {
        return this.field;
    }

}