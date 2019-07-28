import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatGridListModule} from '@angular/material';
import { Player } from './../models/./player';
import { Block } from './../models/block';
import { GameService } from './../services/game.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-multi-player',
  templateUrl: './multi-player.component.html',
  styleUrls: ['./multi-player.component.scss']
})
export class MultiPlayerComponent {

	lock = false;

	constructor(public gs: GameService, private snackBar: MatSnackBar, public dialog: MatDialog) {

	}

	newGame() {
		this.gs.freeBlocksRemaining = 9;
		this.gs.initBlocks();
		this.lock = false;
		this.gs.turn = 0;
	}

	resetGame(event) {
		location.reload();
		event.preventDefault();
	}

	playerClick(i) {
		if ( this.gs.blocks[i].free == false || this.lock == true ) { // If Block is already fill, don't Do anything
			return;
		}

		this.gs.freeBlocksRemaining -= 1; // Reduce no. of free blocks after each selection

		if ( this.gs.freeBlocksRemaining <= 0 ) {

			this.gs.draw += 1;
			this.lock = true;
			this.snackBar.open('Game:', 'Draw', {
		      duration: 4000,
		    });
			this.newGame();
			return;
		}


		this.gs.blocks[i].free = false;

		if ( this.gs.turn == 0 ) { // Player1 Turn
			this.gs.blocks[i].setValue('tick');

		} else { // Bot Turn
			this.gs.blocks[i].setValue('cross');
		}

		const complete = this.gs.blockSetComplete();

		if ( complete == false ) {
			this.changeTurn();
			return;
		} else {
			this.lock = true;
			this.gs.players[this.gs.turn].score += 1;
			this.snackBar.open('Winner:', 'Player ' + (this.gs.turn + 1), {
		      duration: 4000,
		      verticalPosition: 'top'
		    });

			setTimeout(() => {
		    	this.newGame();
			}, 200);
		 return;
		}

	}


	botTurn() {

		if ( this.gs.freeBlocksRemaining <= 0 ) {
			return;
		}

		const bot_selected = this.gs.figureBotMove() - 1;

		if ( this.gs.blocks[bot_selected].free == true ) {
			this.playerClick(bot_selected);
		} else {
			this.botTurn();
			return;
		}

	}


	changeTurn() {
		const player = this.gs.changeTurn();
		const timout = Math.floor(Math.random() * (+400 - +150)) + +400;

		// if( player == 1 ) { // Bot Turn
		// 	setTimeout(() => {
		// 		this.botTurn();
		// 	}, timout)

		// }
	}
}
