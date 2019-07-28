export class Block {
	free = true;

	value = ''; // cross | tick
	symbol = ''; // cross | tick


	setValue(value) {
		this.value = value;

		if ( this.value == 'tick' ) {
			this.symbol = 'done';
		} else {
			this.symbol = 'close';
		}
	}


}
