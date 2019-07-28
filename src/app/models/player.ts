export class Player {

	bot = true;
	score = 0;

	updateScore(total: number) {
		this.score += total;
		return this.score;
	}
}
