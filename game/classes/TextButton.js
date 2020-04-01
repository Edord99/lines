class TextButton extends Button {
	constructor(x, y, msg, wrap, letters) {
		super({x: x, y: y});
		// this.debug = true;
		this.center = false;
		this.text = new Text(this.position.x, this.position.y, msg, wrap, letters);
		this.setCollider();
	}

	setMsg(msg) {
		this.text.setMsg(msg);
		this.text.wrap = msg.length;
		this.setCollider();
	}

	setCollider() {
		this.width = this.collider.width = (this.text.wrap < this.text.msg.length ? this.text.wrap : this.text.msg.length) * this.text.track;
		this.height = this.collider.height = (this.text.breaks.length + 1) * this.text.letters.height;
	}

	display() {
		super.display();
		if (this.alive) this.text.display();
	}

	setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
		this.text.setPosition(x, y);
	}
}