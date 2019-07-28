import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

declare var $: any;

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss']
})
export class CongratulationsComponent implements OnInit {

  	constructor(
	    public dialogRef: MatDialogRef<CongratulationsComponent>,
	    @Inject(MAT_DIALOG_DATA) private data: {}
    ) {}

	onNoClick(): void {
	    this.dialogRef.close();
	}

	ngOnInit() {
		$(document).ready(function() {
			$('#congrats').effect( 'pulsate', {times: 5}, 1000 );
        });
	}
}
