function Palette(ui) {
	const self = this;
	this.palettes = {};
	this.current = '';

	this.addPalette = function() {
		lns.data.saveLines();
		const name = self.current = prompt('Name this palette.');
		if (name) {
			self.palettes[name] = {
				color: lns.render.lineColor,
				n: lns.draw.layer.n,
				r: lns.draw.layer.r,
				w: lns.draw.layer.w,
				v: lns.draw.layer.v,
				lineWidth: lns.canvas.ctx.lineWidth,
				mouse: lns.draw.mouseInterval,
				brush: lns.draw.brush,
				brushSpread: lns.draw.brushSpread,
				dots: lns.draw.dots,
				grass: lns.draw.grass
			};
			/* is this petter or panel better? */
			lns.ui.panels.palette.add(new UIButton({
				title: name,
				callback: function() {
					self.loadPalette(name);
				}
			}));
		}
	};

	this.loadPalette = function(name) {
		/* this is crazy ... */
		lns.data.saveLines();
		self.palettes.current = name;
		const palette = self.palettes[name];
		
		lns.render.lineColor = palette.color;

		lns.draw.setProperties(self.palettes[name]);

		lns.canvas.ctx.lineWidth = self.palettes[name].lineWidth;
		lns.draw.mouseInterval = self.palettes[name].mouse;
		lns.draw.brush = self.palettes[name].brush;
		lns.draw.brushSpread = self.palettes[name].brushSpread;
		lns.draw.dots = self.palettes[name].dots;
		lns.draw.grass = self.palettes[name].grass;

		for (prop in palette) {
			if (lns.ui.faces[prop] !== undefined) {
				lns.ui.faces[prop].setValue(palette[prop]);
			}
		};
	};
}