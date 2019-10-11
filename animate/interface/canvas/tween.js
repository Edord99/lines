class LDTween extends LDRange {
	constructor(x, y, w, h, label) {
		super(x, y, w, h);
		this.fill = this.color = colors.lightgreeh;
		this.highlight = colors.middlegreen;
		this.selectColor = colors.brightgreen;
		this.dragColor = colors.darkgreen;

		this.onclick = function() {
			

		};
	}
}