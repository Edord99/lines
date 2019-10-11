function Layers() {
	const self = this;
	this.layers = [];

	this.updateProperty = function(prop, value) {
		for (let i = 0; i < self.layers.length; i++) {
			if (self.layers[i].toggled) self.layers[i][prop] = value;
		}
	};

	this.resetLayers = function() {
		for (let i = self.layers.length - 1; i >= 0; i--) {
			if (self.layers[i].toggled) self.layers[i].toggle();
		}
		for (let i = this.panel.rows.length - 1; i > 1; i--) {
			this.panel.removeRow(this.panel.rows[i]);
		}
		self.layers = [];
	};

	this.displayLayers = function() {
		self.resetLayers();
		lns.ui.drawings.resetDrawings();

		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			if (layer.isInFrame(lns.anim.currentFrame)) {
				self.layers.push(layer);

				const row = self.panel.addRow(`layer-${i}`);
				row.add(new UILabel({text: `${i},${layer.d}` }));

				row.add(new UIToggle({
					onText: '◐',
					offText: '◑',
					callback: function() {
						layer.toggle();
						/*
							maybe some ui render setttings function here
							crazy and repetetive but also useful
						*/
						if (layer.toggled) {
							lns.ui.faces.w.value = layer.n;
							lns.ui.faces.r.value = layer.r;
							lns.ui.faces.w.value = layer.w;
							lns.ui.faces.v.value = layer.v;
						} else {
							lns.ui.faces.w.value = lns.draw.n;
							lns.ui.faces.r.value = lns.draw.r;
							lns.ui.faces.w.value = lns.draw.w;
							lns.ui.faces.v.value = lns.draw.v;
						}
					}
				})); /* select */

				row.add(new UILabel({text: 'S'}));
				row.add(new UIText({
					value: layer.f.s,
					callback: function(value) {
						layer.startFrame = +value;
						if (layer.startFrame > lns.anim.endFrame) lns.anim.endFrame = layer.startFrame;
						if (layer.endFrame < layer.startFrame) layer.endFrame = layer.startFrame;
						lns.ui.updateInterface();
					}
				}));

				row.add(new UILabel({ text: 'E' }));
				row.add(new UIText({
					value: layer.f.e,
					callback: function(value) {
						layer.endFrame = +value;
						if (layer.endFrame > lns.anim.endFrame) lns.anim.endFrame = layer.endFrame;
						if (layer.startFrame > layer.endFrame) layer.startFrame = layer.endFrame;
						lns.ui.updateInterface();
					}
				}));

				row.add(new UIButton({
					text: "+",
					callback: function() {
						self.splitLayer(layer);
					}
				})); /* duplicate/ split */

				row.add(new UIButton({
					text: 'x',
					callback: function() {
						layer.remove();
						self.resetLayers();
					}
				})); /* delete - not really a toggle then ... */

				// panels['layer'].add(new UIToggle({
				// 	on: '👀',
				// 	off: '🕶️',
				// 	callback: function() {
				// 		layers[i].toggle();
				// 	}
				// }), row);

				/* add animation */
				function addAnimation(a) {
					const aRow = self.panel.addRow(`layer-${i}-anim-${layer.a.length}`);
					
					aRow.add(new UISelect({
						options: ['anim', 's', 'e', 'n', 'r', 'w', 'v'],
						value: a.prop || 'anim',
						selected: a.prop || 'anim',
						callback: function(value) {
							a.prop = value;
							if (value == 's' || value == 'e') {
								a.sv = 0;
								a.ev = lns.anim.drawings[layer.d].length
							}
						}
					}));

					aRow.add(new UIText({
						label: 'sf',
						value: a.sf,
						blur: true,
						callback: function(value) {
							a.sf = +value;
						}
					}));

					aRow.add(new UIText({
						label: 'ef',
						value: a.ef,
						blur: true,
						callback: function(value) {
							a.ef = +value;
							/* not DRY ... from explode*/
							layer.endFrame = +value;
							if (lns.anim.currentState.end < layer.endFrame) 
								lns.anim.currentState.end = layer.endFrame;
							lns.ui.updateInterface(); /* fart ... just update frames? */
						}
					}));

					aRow.add(new UIText({
						label: 'sv',
						value: a.sv,
						callback: function(value) {
							a.sv = +value;
						}
					}));

					aRow.add(new UIText({
						label: 'ev',
						value: a.ev,
						callback: function(value) {
							a.ev = +value;
						}
					}));

					aRow.add(new UIButton({
						text: '↻',
						callback: function() {
							a.sv = 0;
							a.ev = lns.anim.drawings[layer.d].length;
							lns.ui.updateInterface();
						}
					}));

					aRow.add(new UIButton({
						text: 'X',
						callback: function() {
							self.panel.removeRow(aRow);
							layer.a.splice(layer.a.indexOf(a));
						}
					}));
				}

				row.add(new UIButton({
					text: '❏',
					callback: function() {
						const a = {
							prop: undefined,
							sf: lns.anim.currentFrame,
							ef: lns.anim.currentFrame,
							sv: 0,
							ev: 0
						};
						addAnimation(a);
						layer.a.push(a);
					}
				}));

				for (let i = 0; i < layer.a.length; i++) {
					addAnimation(layer.a[i]);
				}
				// https://unicode.org/charts/PDF/U2600.pdf
				// https://tutorialzine.com/2014/12/you-dont-need-icons-here-are-100-unicode-symbols-that-you-can-use
				// ☠ ☰ ☁ ☂ ⛄ ⚆ ⚈ ⚇ ⚉ 
			}
		}
	};

	this.allToggled = false;
	this.toggleAll = function() {
		/* match all toggled */
		for (let i = 0; i < self.layers.length; i++) {
			if (self.layers[i].toggled != self.allToggled)
				self.layers[i].toggle();
		}
		
		/* toggle */
		for (let i = 0; i < self.layers.length; i++) {
			self.layers[i].toggle();
		}

		self.allToggled = !self.allToggled; /* set toggle */

		/* how to make ui react here ??? */
	};

	this.duplicate = function(layer) {
		const newLayer = new Layer(_.cloneDeep(layer));
		newLayer.startFrame = newLayer.endFrame = layer.endFrame + 1;
		lns.anim.layers.push(newLayer);
		lns.ui.nextFrame();
	};

	/* z */
	this.cutLayerSegment = function() {
		for (let i = 0; i < self.layers.length; i++) {
			if (self.layers[i].toggled) {
				const drawing = lns.anim.drawings[self.layers[i].d];
				drawing.pop(); /* remove "end" */
				drawing.pop(); /* remove segment */
				drawing.push('end'); /* new end */
				self.layers[i].e = drawing.length; /* update layer end num */
			}
		}
	};

	/* shift z */
	this.cutLayerLine = function() {
		for (let i = 0; i < self.layers.length; i++) {
			if (self.layers[i].toggled) {
				const drawing = lns.anim.drawings[self.layers[i].d];
				drawing.pop(); /* remove "end" */
				for (let i = drawing.length - 1; i > 0; i--) {
					if (drawing[i] != 'end') drawing.pop();
					else break;
				}
				self.layers[i].e = drawing.length; /* update layer end num */
			}
		}
	};

	this.updateLayerColor = function(color) {
		for (let i = 0; i < self.layers.length; i++) {
			if (self.layers[i].toggled)
				self.layers[i].c = self.layers[i].prevColor = color;
		}
	};

	this.canvas = new Canvas("draw-layers", 0, 0, '#ffffff', true);

	/* do this with real ui later */
	this.toggleCanvas = function() {
		if (self.canvas.canvas.style.display != 'none') self.canvas.canvas.style.display = 'none';
		else self.canvas.canvas.style.display = '';
	};

	const barf = new UIToggle({
		id: 'toggle-layers',
		onText: "Close Layers",
		offText: "Open Layers",
		callback: self.toggleCanvas
	});


	this.updateInterval;
	this.alayers = [];
	this.aframes = [];
	this.can = { w: 0, h: 0 };

	/* g key */
	this.update = function() {
		
		const maxWidth = 60; /* largest w of one frame */
		const width = Math.min(640, self.canvas.canvas.parentElement.offsetWidth); /* width of layer canvas */
		const row = 16; /* base height */
		const height = row * (lns.anim.layers.length + 1);
		const col = Math.min(maxWidth, width / (lns.anim.plusFrame));
		
		if (self.can.w != width || self.can.h != height) {
			self.can.w = width;
			self.can.h = height;
			self.canvas.setWidth(width);
			self.canvas.setHeight(height);
		}

		for (let i = 0; i < lns.anim.plusFrame; i++) {
			const x = i * col;
			const y = height - row;
			const w = col;
			const h = row;
			
			if (!self.aframes[i]) {
				self.aframes[i] = new LDFrame(x, y, w, h, i, 
					{ 
						onclick: function() {
							lns.ui.setFrame(i);
							self.update();
						}
					}
				);
			} else {
				self.aframes[i].update(x, y, w, h);
			}
			
			if (i == lns.anim.currentFrame) this.aframes[i].select();
			else this.aframes[i].unselect();
		}

		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			const x = layer.startFrame * col;
			const y = i * row;
			const w = (layer.endFrame - layer.startFrame + 1) * col;
			const h = row;

			if (!self.alayers[i]) {
				self.alayers[i] = new LDLayer(x, y, w, h, layer);
			}
			else self.alayers[i].update(x, y, w, h);
		}

		if (!self.updateInterval) {
			self.updateInterval = setInterval(self.draw, 1000 / 30);
		}
	};


	this.draw = function() {
		
		self.canvas.ctx.fillStyle = 'white';
		self.canvas.ctx.fillRect(0, 0, self.can.w, self.can.h);

		for (let i = 0; i < self.alayers.length; i++) {
			self.alayers[i].display();
		}

		for (let i = 0; i < self.aframes.length; i++) {
			self.aframes[i].display();
		}
	};

	this.mouseMove = function(ev) {
		for (let i = 0; i < self.alayers.length; i++) {
			self.alayers[i].over(ev.offsetX, ev.offsetY);
		}
		
		for (let i = 0; i < self.aframes.length; i++) {
			self.aframes[i].over(ev.offsetX, ev.offsetY);
		}
	};

	this.mouseDown = function(ev) {
		for (let i = 0; i < self.alayers.length; i++) {
			self.alayers[i].down();
		}
		
		for (let i = 0; i < self.aframes.length; i++) {
			self.aframes[i].down();
		}
	};

	this.mouseUp = function(ev) {
		for (let i = 0; i < self.alayers.length; i++) {
			self.alayers[i].up();
		}
		
		for (let i = 0; i < self.aframes.length; i++) {
			// self.aframes[i].up();;
		}
	};

	this.outSideCanvas = function(ev) {
		if (ev.toElement != self.canvas.canvas) {
			for (let i = 0; i < self.alayers.length; i++) {
				self.alayers[i].over(-1, -1);
			}
		
			for (let i = 0; i < self.aframes.length; i++) {
				self.aframes[i].over(-1, -1);
			}
		}
	};

	self.canvas.canvas.addEventListener('mousemove', self.mouseMove);
	document.addEventListener('mousemove', self.outSideCanvas);
	self.canvas.canvas.addEventListener('mousedown', self.mouseDown);
	self.canvas.canvas.addEventListener('mouseup', self.mouseUp);
}