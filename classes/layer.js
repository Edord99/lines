class Layer {
	constructor(params) {
		this.d = params.d; // drawing index
		this.s = params.s; // start index
		this.e = params.e; // end index
		this.c = params.c; // color
		this.n = params.n; // segment number
		this.r = params.r; // random jiggle range
		this.w = params.w; // random wiggle range
		this.v = params.v; // wiggle velocity
		this.x = params.x || 0;
		this.y = params.y || 0;
	}
}