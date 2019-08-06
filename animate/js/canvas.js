function Canvas(id, width, height, color) {
	const self = this;

	this.width = width;
	this.height = height;
	this.canvas = document.getElementById(id); // lns.canvas.canvas is html elem

	this.ctx = this.canvas.getContext('2d');
	this.ctx.miterLimit = 1;

	this.bgColor = new Color(function(_color) {
		self.canvas.style.backgroundColor = _color;
	});

	this.setLineWidth = function(n) {
		self.ctx.lineWidth = +n;
	};

	/* canvas bg color */
	if (color) this.bgColor.set(color);

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

	this.startCapture = true;

	this.videoCapture = function() {
		if (self.startCapture) {
			self.startCapture = false;
			lns.render.videoCapture = true;
			self.stream = self.canvas.captureStream();
			self.rec = new MediaRecorder(self.stream);
			self.rec.start();
			self.rec.addEventListener('dataavailable', e => {
   				const blob = new Blob([ e.data ], { 'type': 'video/webm' });
   				const url = URL.createObjectURL(blob);

   				const a = document.createElement('a');
   				document.body.appendChild(a);
   				a.href = url;
   				a.download = `${lns.interface.title.getValue()}.webm` || 'lines.webm';
   				a.click();
   				// window.URL.revokeObjectURL(url);
			});
		} else {
			lns.render.videoCapture = false;
			self.startCapture = true;
			self.rec.stop();
		}
	};

	this.prevCap = { n: '', f: 0 };

	this.capture = function() {
		if (lns.files.saveFilesEnabled) {
			canvas.toBlob(function(blob) {
				const title = lns.interface.title.getValue(); // this is a UI
				const n = Cool.padNumber(lns.currentFrame, 3);
				let frm = 0;
				let fileName = `${title}-${n}-${frm}.png`;
				if (n == self.prevCap.n) {
					frm = self.prevCap.f + 1;
					fileName = `${title}-${n}-${frm}.png`;
					self.prevCap.f = frm;
				}
				self.prevCap.n = n;

				const f = saveAs(blob, fileName);
				f.onwriteend = function() { 
					window.requestAnimFrame(() => {
						lns.render.draw('cap'); 
					});
				};
					
			});
		} else {
			const cap = self.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			window.location.href = cap;
		}
	};

	/* shift-f key */
	this.fitCanvasToDrawing = function() {
		lns.data.saveLines();
		
		let tolerance = 0;
		// min max size of canvas
		let min = { x: 10000, y: 10000 };
		let max = { x: 0, y: 0 };

		for (let i = 0; i < lns.layers.length; i++) {
			const layer = lns.layers[i];
			const drawing = lns.drawings[layer.d];
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
		lns.interface.faces.width.set(self.canvas.width);
		lns.interface.faces.height.set(self.canvas.height);

		for (let i = 0; i < lns.layers.length; i++) {
			const layer = lns.layers[i];
			const diff = {
				x: layer.x + (min.x - tolerance),
				y: layer.y + (min.y - tolerance)
			};
			if (diff.x > 0) layer.x -= diff.x;
			if (diff.y > 0) layer.y -= diff.y;
		}
	};
}