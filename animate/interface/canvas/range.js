class LDRange extends LDBase {
	constructor(x, y, w, h, functions) {
		super(x, y, w, h)
		this.fill = this.color = colors.lightblue;
		this.highlight = colors.middleblue;
		this.selectColor = colors.brightblue;
		this.dragColor = colors.purpleblue;
		this.ondrag = functions.ondrag;
		this.onclick = functions.onclick;
	}

	down() {
		if (this.left || this.right) {
			this.dragging = true;
		} else if (this.mouseIsOver) {
			this.toggle();
			this.onclick();
		}
	}

	up() {
		if (this.dragging) {
			if (this.left) {
				const dif = this.x - this.dragX;
				this.ondrag('left', dif > 0 ? -1 : 1, Math.abs(dif));

			} else {
				const dif = this.dragX - (this.x + this.w);
				this.ondrag('right', dif > 0 ? 1 : -1, Math.abs(dif));
			}
		}
		this.dragging = false;
	}

	display(ctx) {
		super.display(ctx);

		if (this.left) {
			ctx.fillStyle = this.dragColor;
			ctx.fillRect(this.x, this.y, 4, this.h);
		}
		if (this.right) {
			ctx.fillStyle = this.dragColor;
			ctx.fillRect(this.x + this.w - 4, this.y, 4, this.h);
		}
	}

	over(x, y) {

		super.over(x, y);

		if (this.dragging) this.dragX = x;

		if (this.mouseIsOver) {
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