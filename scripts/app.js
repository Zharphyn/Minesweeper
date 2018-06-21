/* 
* Minesweeper Javascript code
* @copyright: (c) 2018 Brad Thiessen, All rights reserved 
*/
'use strict'

import {MineField} from './minefield.js'

const COLS = 15; // the default number of columns on the grid
const ROWS = 15; // the default number of rows on the grid

export class App {
    constructor() {
        this.___private___ = {
            minefield: [],
            name: "Dragonsweeper",
            WinnerSound: new buzz.sound("./sounds/SFX_Winner_BT.wav"),
            EndGameSound: new buzz.sound("./sounds/MUS_End_BT.wav"),
            GameSound: new buzz.sound("./sounds/MUS_Game_BT.wav"),
            FailedSound: new buzz.sound("./sounds/SFX_Caught_Dragon_BT.wav"),
            MarkMineSound: new buzz.sound("./sounds/SFX_MarkMine_BT.wav"),
            ClickSpaceSound: new buzz.sound("./sounds/SFX_ClickSpace_BT.wav")
        } 
        this.t;
        this.lost = false;
        this.musicState = true;
        //initialize variables
        if (!buzz.isWAVSupported()) {
            alert("Your browser doesn't support WAV Format.");  
        } else {
            this.___private___.GameSound.loop().play();
        }

        this.drawToolRow();
        this.renderMinefieldGrid();
        this.createEventHandlers();
    }

    add() {
        let seconds = parseInt($('#timer').val());
        seconds++
        let TimeDisplay = seconds > 9 ? seconds > 99 ? seconds > 999 ? seconds.toString() : 
            "0" + seconds.toString()  : "00" + seconds.toString() : "000" + seconds.toString();
        $('#timer').val(TimeDisplay);

    }

    timer() {
        this.t = setInterval(this.add, 1000);
    }

    winner(){
        clearInterval(this.t);
        let message = `Congratulations!! You found all of the dragons in ${$('#timer').val()} seconds!!`;
        let $Div = $('<div />').attr({ id: 'winner'});
        let $WinMessage = $('<input/>').attr({ type: 'text', id: 'winner-message', name: 'winner-message', readonly: true}).val(message);
        $Div.append($WinMessage).append($('<p>'));
        $('#game-screen').prepend($Div);
        let my = this.___private___;
        if (my.GameSound.isPaused()) {
            this.musicState = false;
        } else {
            this.musicState = true;
            my.GameSound.stop();
            my.EndGameSound.loop = false;
            my.EndGameSound.play();
        }

        my.WinnerSound.loop = false;
        my.WinnerSound.play(); // play dragon roar

        $("#game-board").empty();
    }

    loser() {
        clearInterval(this.t);
        let message1 = `You survived for ${$('#timer').val()} seconds, before you encountered a dragon.`;
        let message2 = `After cooking you, the dragon ate you!`;
        let $Div = $('<div />').attr({ id: 'loser'});
        let $LoseMessage1 = $('<input/>').attr({ type: 'text', id: 'lose-message1', name: 'lose-message', readonly: true}).val(message1).addClass('lose-message');
        let $LoseMessage2 = $('<input/>').attr({ type: 'text', id: 'lose-message2', name: 'lose-message', readonly: true}).val(message2).addClass('lose-message');
        $Div.append($LoseMessage1).append($LoseMessage2).append($('<p>'));
        $('#game-screen').prepend($Div);
        let my = this.___private___;
        if (my.GameSound.isPaused()) {
            this.musicState = false;
        } else {
            this.musicState = true;
            my.GameSound.stop();
            my.EndGameSound.loop = false;
            my.EndGameSound.play();
        }

        my.FailedSound.loop = false;
        my.FailedSound.play(); // play dragon roar
        this.lost = true;
    }

    getClass(row, col, rows, cols, $cell, mineField){
        $cell.addClass("revealed");
        $cell.removeClass("mine-button");
        switch ( mineField[col][row].getAdjacentMines()) {
            case 0:
                $cell.addClass("zero");
                this.reveal(row, col, rows, cols, $cell, mineField);
                break;
            case 1:
                $cell.addClass("one");
                break;
            case 2:
                $cell.addClass("two");
                break;
            case 3:
                $cell.addClass("three");
                break;
            case 4:
                $cell.addClass("four");
                break;
            case 5:
                $cell.addClass("five");
                break;
            case 6:
                $cell.addClass("six");
                break;
            case 7:
                $cell.addClass("seven");
                break;
            case 8:
                $cell.addClass("eight");
                break;
        }
    }

    // reveals the minefield around an empty square
    reveal(row, col, rows, cols, $el, mineField) {
        for (let newRow = row-1; newRow < row + 2; newRow++){
            if (newRow < 0 || newRow >= rows) {continue;} // if we are outside of the grid on the row
            for (let newCol = col-1; newCol < col + 2; newCol++){
                if (newCol < 0 || newCol >= cols) {continue;} // if we are outside of the grid on the column
                if ((newCol >= 0 && newCol < cols) && (newRow >= 0 && newRow < rows)) {
                    let $cell = $(`#${newCol}-${newRow}`);
                    if ($cell.hasClass("flag")) { // remove a set flag, if encountered
                        $cell.removeClass("flag");
                        let minecount = parseInt($('#mine-count').val(), 10);
                        minecount++;
                        $('#mine-count').val(minecount);
                    }
                    if ($cell.hasClass("revealed")) {continue;} // if cell is already marked as revealed
                    $cell.removeClass("mine-button");
                    this.getClass(newRow, newCol, rows, cols, $cell, mineField);      
                }
            }    
        }
    }

    countRemainingMineButtons() {
        let remaining = 0;
        let rows = parseInt($(`#grid-size`).val());
        let cols = rows;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let $cell = $(`#${col}-${row}`);
                if (!($cell.hasClass("revealed"))) {
                    remaining++;
                }
            }
        }
        return remaining;
    }

    // creates the event on click of a mine field element, the image is changed to a flag.
    // ultimately this event will change to run the algorithm to determine what image to 
    // display to the user.
    buildMineButtonEvents(cols = COLS, rows = ROWS){
        let my = this.___private___;
        clearInterval(this.t);
        $('#timer').val(0);
        $( ".cell" ).contextmenu((event) => {
            let minecount = parseInt($('#mine-count').val(), 10);

            if ($(event.target).hasClass("mine-button")) {
                my.MarkMineSound.loop = false;
                my.MarkMineSound.play(); // play the sound of a cell being clicked
                $(event.target).removeClass("mine-button");
                $(event.target).addClass("flag");
                $(event.target).addClass("revealed");
                minecount--;
            } else {
                $(event.target).addClass("mine-button");
                $(event.target).removeClass("flag");
                $(event.target).removeClass("revealed");
                minecount++;
            }
            $('#mine-count').val(minecount);
            if ((minecount == 0) && (this.countRemainingMineButtons() == 0)) {
                this.winner();
            }
            return false;
        });

        $('.cell').on('click', (event) => {
            if (!this.lost) {
                let GridSize = parseInt($(`#grid-size`).val());
                if (GridSize) {
                    cols = GridSize;
                    rows = GridSize;
                } else {
                    $(`#grid-size`).value = cols;
                }
                let $cell = $(event.target);
                if ($('#timer').val() == 0){               
                    this.timer();
                }

                let col = $cell.data('col');
                let row = $cell.data('row');
                let mineField = my.minefield.minefield;
                $cell.removeClass("mine-button");
                if (mineField[col][row].mine) { // is a mine
                    $cell.addClass("dragon"); // set cell to dragon
                    this.loser();
                } else { // not a mine
                    my.ClickSpaceSound.loop = false;
                    my.ClickSpaceSound.play(); // play the sound of a cell being clicked
                    $cell.addClass("revealed"); // set the cell status to revealed
                    if ($cell.hasClass("flag")) { // remove a flag if encountered
                        $cell.removeClass("flag");
                        let minecount = parseInt($('#mine-count').val(), 10);
                        minecount++;
                        $('#mine-count').val(minecount);
                    }
                    this.getClass(row, col, rows, cols, $cell, mineField); 
                }
                if ((parseInt($('#mine-count').val(), 10) == 0) && (this.countRemainingMineButtons() == 0)) {
                    this.winner();
                }
            }
        })
    }

    // draws the command row above the minefield grid
    drawToolRow() {
        let $Div = $('<div />').attr({ id: 'top-row'});
        let $MineCount = $('<input/>').attr({ type: 'text', id: 'mine-count', name: 'mine-count', readonly: true}).val(25);
        let $Timer = $('<input/>').attr({ type: 'text', id: 'timer', name: 'timer', readonly: true}).val('0000');
        let $GridSize = $('<input/>').attr({ type: 'text', id: 'grid-size', name: 'grid-size'}).val(15); // value is the size of the grid. Always a square
        let $Reset = $('<input />').attr({ type: 'button', id: 'reset-button'}).val('Reset').addClass('reset-button');
        let $Music= $('<input />').attr({ type: 'button', id: 'music-button'}).val('Music').addClass('music-button');
        let $gameScreen = $('#game-screen');

        $Div.append($MineCount).append($Timer).append($GridSize).append($Reset).append($Music);
        $gameScreen.prepend($Div);
        
    }

    // draw the actual grid on the screen
    renderMinefieldGrid(cols = COLS, rows = ROWS) {
        let my = this.___private___;
        this.lost = false;
        // attempts to convert the value in the #grid-size element
        let GridSize = parseInt($(`#grid-size`).val());
        if (GridSize) {
            cols = GridSize;
            rows = GridSize;
        } else {
            $(`#grid-size`).val(cols);
        }
        let mines = Math.round((cols * rows) / 10);
        $('#mine-count').val(mines);
        
        my.minefield = new MineField(cols,rows, mines);

        $("#game-board").empty();
        for (let row = 0; row < rows; row++) {
            let $tr = $('<tr />');
            for (let col = 0; col < cols; col++) {
                let $td = $('<td />').attr('id', col.toString()+'-'+row.toString() ).data('row', row).data('col', col).addClass("cell").addClass("mine-button");
                $tr.append($td);
            }

            $('#game-board').append($tr);
        }
        this.buildMineButtonEvents();
    }

    // creates event handlers for most of the buttons. The minefield buttons are handled elsewhere
    createEventHandlers() {
        $(`#play-now-btn`).on('click', (event) => {
            // Hide the splash screen and show the game screen
            $('#splash-screen').removeClass('show');
            $('#splash-screen').addClass('hide');
            $('#game-screen').removeClass('hide');
            $('#game-screen').addClass('show');
        });

        $(`#music-button`).on('click', (event) => {
            let my = this.___private___;
            my.GameSound.togglePlay(); // turns background music on/off
        });

        $(`#reset-button`).on('click', (event) => {
            let my = this.___private___;
            $('#winner').remove();
            $('#loser').remove();
            if (this.musicState) {
                my.GameSound.play();
            }
            this.renderMinefieldGrid();
        });
    }


    // start the game
    // wait for user input
    // reveal mines depending on input
    run() {

//
    }

}