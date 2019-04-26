class Frame {
	constructor(index) {
		this.l = index; // layer index
	}

	setProperty(property, value) {
		this[property] = value;
	}
}