class LDLayer extends LDRange {
	constructor(x, y, w, h, label, functions) {
		super(x, y, w, h, functions);
		this.label = label;
		this.color = colors.lightblue;
		this.highlight = colors.middleblue;
	}

	display(ctx) {
		super.display(ctx);
		ctx.font = '10px sans-serif';
		ctx.fillStyle = 'black';
		ctx.fillText(this.label, this.x + 2, this.y + this.h - 2);
	}
}