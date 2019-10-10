class LDFrame extends LDButton {
	constructor(x, y, w, h, index, functions) {
		super(x, y, w, h, functions);
		this.index = index;
	}

	display(ctx) {
		super.display(ctx);
		ctx.font = '12px monospace';
		ctx.fillStyle = 'black';
		ctx.fillText(this.index, this.x + 2, this.y + this.h - 2);
	}
}