class LDButton extends LDBase {
	constructor(x, y, w, h, label, functions) {
		super(x, y, w, h);
		this.fill = colors.lightpink;
		this.color = colors.lightpink;
		this.highlight = colors.middlepink;
		this.selectColor = colors.brightpink;
		this.onclick = functions.onclick;
		this.label = label;
	}

	down() {
		if (this.mouseIsOver) this.onclick();
	}

	display(ctx) {
		super.display(ctx);
		lns.ui.layers.canvas.ctx.font = '12px monospace';
		lns.ui.layers.canvas.ctx.fillStyle = 'black';
		lns.ui.layers.canvas.ctx.fillText(this.label, this.x + 2, this.y + this.h - 2);
	}
}