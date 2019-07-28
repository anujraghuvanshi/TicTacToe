import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatGridListModule} from '@angular/material';
import { GameService } from './../services/game.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CongratulationsComponent } from '../congratulations/congratulations.component';
import { FirebaseService } from '../services/firebase.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';
export interface Result { email: string; status: string; time: string; }

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.scss']
})
export class SinglePlayerComponent {
    private itemsCollection: AngularFirestoreCollection<Result>;
    items: Observable<Result[]>;

    lock = false;

    results: any;

    loggedInPlayer: string;

    constructor(public gs: GameService,
                private snackBar: MatSnackBar,
                public dialog: MatDialog,
                public firebaseService: FirebaseService,
                private readonly afs: AngularFirestore,
                private data: SharedService
    ) {

        this.data.currentStatus.subscribe(loggedInUserEmail => this.loggedInPlayer = loggedInUserEmail)
        this.results = this.firebaseService.getAllresults();
    }

    newGame() {
        this.gs.freeBlocksRemaining = 9;
        this.gs.initBlocks();
        this.lock = false;
        this.gs.turn = 0;
    }
    
    ngOnDestroy() {
        this.gs.players[0].score = 0;
        this.gs.players[1].score = 0;
        this.gs.draw = 0;
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
        
        if (!this.gs.players[this.gs.turn].bot) {
            this.saveReasult('Won');
            
            this.openDialog();
        } else {
            this.saveReasult('Lost');
        }
        
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

        if ( player == 1 ) { // Bot Turn
            setTimeout(() => {
                this.botTurn();
            }, timout);

        }
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(CongratulationsComponent, {
            width: '650px',
            height: '550px',
            panelClass: 'my-panel'
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    saveReasult(status) {
        this.firebaseService.saveResult(status);
    }
}
