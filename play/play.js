/* play module */

function LinesPlayer(src, canvas, callback) {
	this.canvas = canvas;
	if (!this.canvas) this.canvas = document.getElementById('lines');
	if (!this.canvas) {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
	}
	this.ctx = this.canvas.getContext('2d');
	this.ctx.miterLimit = 1;
	this.width;
	this.height;
	this.scale = 1;
	
	this.currentFrame = 0; // always int, floor cfc
	this.currentFrameCounter = 0; // uses intervalRatio, so it's a float
	this.playing = true;
	
	this.fps = 15;
	this.lineInterval = 1000/this.fps;
	this.timer = performance.now();
	this.intervalRatio = this.lineInterval / (1000 / this.fps);  // initialize to one but this is the math
	this.frames = [];
	this.drawings = [];
	this.ctxStrokeColor;
	this.mixedColors = false;

	this.draw = function() {
		requestAnimFrame(this.draw.bind(this));
		if (performance.now() > this.lineInterval + this.timer) {
			this.timer = performance.now();
			if (this.playing && this.currentFrameCounter < this.frames.length) {
				this.currentFrameCounter += this.intervalRatio;
				this.currentFrame = Math.floor(this.currentFrameCounter);
			}
			if (this.playing && this.currentFrame == this.frames.length) {
				this.currentFrame = this.currentFrameCounter = 0;
			}
			this.ctx.clearRect(0, 0, this.width, this.height);
			if (this.frames[this.currentFrame]) {
				if (!this.mixedColors)
					this.ctx.beginPath();
				for (let i = 0; i < this.frames[this.currentFrame].length; i++) {
					const fr = this.frames[this.currentFrame][i];
					const dr = this.drawings[fr.d];
					if (this.mixedColors)
						this.ctx.beginPath();
					for (let h = fr.i; h < fr.e; h++) {
						let line = dr.l[h];
						if (line && line.e) {
							let v = new Vector(line.e.x, line.e.y);
							v.subtract(line.s);
							v.divide(dr.n);
							this.ctx.moveTo( line.s.x + getRandom(-dr.r, dr.r), line.s.y + getRandom(-dr.r, dr.r) );
							for (let j = 0; j < dr.n; j++) {
								let p = new Vector(line.s.x + v.x * j, line.s.y + v.y * j);
								this.ctx.lineTo( p.x + v.x + getRandom(-dr.r, dr.r), p.y + v.y + getRandom(-dr.r, dr.r) );
							}
							if (this.ctxStrokeColor != dr.c) {
								this.ctxStrokeColor = dr.c;
								this.ctx.strokeStyle= "#" + this.ctxStrokeColor;
							}
						}			
					}
					if (this.mixedColors)
						this.ctx.stroke();
				}
				if (!this.mixedColors)
					this.ctx.stroke();
			}
		}
	}

	this.loadAnimation = function(src, callback) {
		const self = this;
		$.getJSON(src, function(data) {
			self.frames =  data.f;
			self.drawings = data.d;
			self.fps = data.fps;
			self.intervalRatio = self.lineInterval / (1000 / self.fps);
			self.currentFrame = this.currentFrameCounter = 0;
			self.width = self.canvas.width = data.w;
			self.height = self.canvas.height = data.h;
			self.ctxStrokeColor = undefined; // note setting canvas width resets the color
			self.ctx.miterLimit = 1;
			requestAnimFrame(self.draw.bind(self));
			
			/* why a callback */
			if (callback)
				callback();
		});
	}

	this.loadAnimation(src, callback);
}

function loadAnimation(src, canvas, callback) {
	const player = new LinesPlayer(src, canvas, callback);
}

/* should have something load all canvas elems w data-src??? */