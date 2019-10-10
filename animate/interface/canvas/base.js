class LDBase {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.mouseIsOver = false;
		this.isSelected = false;
	}

	update(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	over(x, y) {
		if (x > this.x && x < this.x + this.w &&
			y > this.y && y < this.y + this.h) {
			if (!this.isSelected) this.fill = this.highlight;
			this.mouseIsOver = true;
		} else {
			if (!this.isSelected) this.fill = this.color;
			this.mouseIsOver = false;
		}
	}

	display(ctx) {
		ctx.fillStyle = this.fill;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	select() {
		this.fill = this.selectColor;
	 	this.isSelected = true;
	}

	unselect() {
		this.fill = this.color;
		this.isSelected = false;
	}

	toggle() {
		if (this.isSelected) this.unselect();
		else this.select();
	}
}