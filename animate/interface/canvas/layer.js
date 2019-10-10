class LDLayer extends LDRange {
	constructor(x, y, w, h, layer) {
		super(x, y, w, h);
		this.label = `d${layer.d}`;
		this.color = colors.lightblue;
		this.highlight = colors.middleblue;

		this.onclick = layer.toggle.bind(layer);
		this.ondrag = function(side, dir, dif) {
			if (side == 'left' && layer.startFrame > 0) {
				layer.startFrame += (1 + Math.floor(dif / w)) * dir;
			}
			if (side == 'right' && layer.endFrame < lns.anim.endFrame) {
				layer.endFrame += (1 + Math.floor(dif / w)) * dir;
			}
			lns.ui.layers.update();
		};

		this.dup = new LDButton(x + w, y, h/2, h/2, '+', 
			{
				onclick: function() {
					lns.ui.layers.duplicate(layer);
				}
			}
		);

		this.anim = new LDButton(x + w, y + h/2, h/2, h/2, 'a',
		{
			onclick: function() {
				/* add tween range */
			}
		});
	}

	display() {
		super.display();
		lns.ui.layers.canvas.ctx.font = '10px sans-serif';
		lns.ui.layers.canvas.ctx.fillStyle = '#F0F7FF';
		lns.ui.layers.canvas.ctx.fillText(this.label, this.x + 2, this.y + this.h - 2);

		this.dup.display();
		this.anim.display();
	}

	over(x, y) {
		super.over(x, y);
		this.dup.over(x, y);
		this.anim.over(x, y);

	}

	down() {
		super.down();
		this.dup.down();
		this.anim.down();

	}

	update(x, y, w, h) {
		super.update(x, y, w, h);
		this.dup.update(x + w, y, h/2, h/2);
		this.anim.update(x + w, y + h/2, h/2, h/2);
	}
}