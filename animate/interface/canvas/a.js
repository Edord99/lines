class A {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.stroke = 'transparent';
		this.mouseIsOver = false;
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
			this.stroke = this.highlight;
			this.mouseIsOver = true;
		} else {
			this.stroke = 'transparent';
			this.mouseIsOver = false;
		}
	}

	display(ctx) {
		ctx.fillStyle = this.fill;
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = 2;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
}

class AFrame extends A {
	constructor(x, y, w, h, index, callback) {
		super(x, y, w, h);
		this.fill = '#fdf';
		this.highlight = 'blue'
		this.index = index;
		this.callback = callback;
	}

	down() {
		if (this.mouseIsOver) {
			this.callback();
		}
	}

	up() {

	}

	display(ctx) {
		super.display(ctx);
		ctx.font = '12px monospace';
		ctx.fillStyle = 'black';
		ctx.fillText(this.index, this.x + 2, this.y + this.h - 2);
	}

	select() {
		this.fill = '#FF79FF';
	}

	unselect() {
		this.fill = '#fdf';
	}
}

class ALayer extends A {
	constructor(x, y, w, h, callback) {
		super(x, y, w, h)
		this.fill = '#ADD8E6';
		this.highlight = 'blue'
		this.callback = callback;
	}

	down() {
		if (this.left || this.right)
			this.dragging = true;
	}

	up() {
		if (this.dragging) {
			if (this.left) {
				const dif = this.x - this.dragX;
				this.callback('left', dif > 0 ? -1 : 1, Math.abs(dif));

			} else {
				const dif = this.dragX - (this.x + this.w);
				this.callback('right', dif > 0 ? 1 : -1, Math.abs(dif));
			}
		}
		this.dragging = false;
	}

	display(ctx) {
		super.display(ctx);
		if (this.left) {
			ctx.fillStyle = this.highlight;
			ctx.fillRect(this.x, this.y,4, this.h);
		}
		if (this.right) {
			ctx.fillStyle = this.highlight;
			ctx.fillRect(this.x + this.w - 4, this.y, 4, this.h);
		}
	}

	over(x, y) {

		if (this.dragging) this.dragX = x;

		if (x > this.x && x < this.x + this.w &&
			y > this.y && y < this.y + this.h) {

			if (x < this.x + 4) this.left = true;
			else if (!this.dragging) this.left = false;
			
			if (x > this.x + this.w - 4) this.right = true;
			else if (!this.dragging) this.right = false;
		
		} else {
			if (!this.dragging) this.left = false;
			if (!this.dragging) this.right = false;
		}
	}

	
}