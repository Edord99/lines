class LDLayer extends LDRange {
	constructor(x, y, w, h, layer) {
		super(x, y, w, h);
		this.label = `d${layer.d}`;
		this.color = colors.lightblue;
		this.highlight = colors.middleblue;

		this.onclick = layer.toggle.bind(layer);
		this.ondrag = function(side, dir, dif) {
			if (side == 'left' && layer.startFrame > 0) {
				layer.startFrame += (1 + Math.floor(dif / col)) * dir;
			}
			if (side == 'right' && layer.endFrame < lns.anim.endFrame) {
				layer.endFrame += (1 + Math.floor(dif / col)) * dir;
			}
			lns.ui.layers.update();
		};

		this.split = new LDButton(this.x + this.w, this.y, this.h/2, this.h/2, '+', 
			{
				onclick: function() {
					console.log(layer)
					lns.ui.layers.splitLayer(layer);
				}
			}
		);
	}

	display(ctx) {
		super.display(ctx);
		ctx.font = '10px sans-serif';
		ctx.fillStyle = '#F0F7FF';
		ctx.fillText(this.label, this.x + 2, this.y + this.h - 2);

		this.split.display(ctx);
	}

	over(x, y) {
		super.over(x, y);
		this.split.over(x, y);
	}

	down() {
		super.down();
		// console.log(this.split.mouseIsOver);
		this.split.down();
	}
}