function Canvas(id, width, height, color) {
	const self = this;

	this.width = width;
	this.height = height;
	this.canvas = document.getElementById(id); // lns.canvas.canvas is html elem

	this.ctx = this.canvas.getContext('2d');
	this.ctx.miterLimit = 1;

	this.setBGColor = function(color) {
		self.bgColor = color;
		self.canvas.style.backgroundColor = color;
	};

	this.setBGColor(color);

	this.setLineWidth = function(n) {
		self.ctx.lineWidth = +n;
	};

	/* set line color */
	this.setStrokeColor = function(color) {
		this.ctx.strokeStyle = color;
	};

	/* update canvas width */
	this.setWidth = function(width) {
		self.width = self.canvas.width = +width;
		self.ctx.miterLimit = 1;
	};

	/* update canvas height */
	this.setHeight = function(height) {
		self.height = self.canvas.height = +height;
		self.ctx.miterLimit = 1;
	};
	
	/* set initial width and height */
	this.setWidth(this.width);
	this.setHeight(this.height);

	/* shift-f key */
	this.fitCanvasToDrawing = function() {
		lns.data.saveLines();
		
		let tolerance = 0;
		// min max size of canvas
		let min = { x: 10000, y: 10000 };
		let max = { x: 0, y: 0 };

		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			const drawing = lns.anim.drawings[layer.d];
			for (let j = 0; j < drawing.length; j++) {
				const point = drawing[j];
				if (point != 'end') {
					tolerance = Math.max(tolerance, layer.r * 4);
					min.x = Math.min(min.x, point.x + layer.x);
					min.y = Math.min(min.y, point.y + layer.y);
					max.x = Math.max(max.x, point.x + layer.x);
					max.y = Math.max(max.y, point.y + layer.y);
				}
			}
		}

		self.setWidth((max.x - min.x) + tolerance * 2);
		self.setHeight((max.y - min.y) + tolerance * 2);
		// lns.ui.faces.width.set(self.canvas.width);
		// lns.ui.faces.height.set(self.canvas.height);

		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			const diff = {
				x: layer.x + (min.x - tolerance),
				y: layer.y + (min.y - tolerance)
			};
			if (diff.x > 0) layer.x -= diff.x;
			if (diff.y > 0) layer.y -= diff.y;
		}
	};
}