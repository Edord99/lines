class LDButton extends LDBase {
	constructor(x, y, w, h, functions) {
		super(x, y, w, h);
		this.fill = colors.lightpink;
		this.color = colors.lightpink;
		this.highlight = colors.middlepink;
		this.selectColor = colors.brightpink;
		this.onclick = functions.onclick;
	}

	down() {
		if (this.mouseIsOver) this.onclick();
	}

	up() {

	}
}