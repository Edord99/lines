class Scene {
	constructor() {
		this.displayItems = [];
		this.updateItems = [];
		this.uiItems = [];
	}
	
	add(item) {
		this.displayItems.push(item);
		this.updateItems.push(item);
	}

	remove(item, type) {
		const index = this[`${type}Items`].indexOf(item);
		if (index >= 0) this[`${type}Items`].splice(index, 1);
	}

	addToDisplay(item) {
		this.displayItems.push(item);
	}

	addToUpdate(item) {
		this.updateItems.push(item);
	}

	addUI(item) {
		this.displayItems.push(item);
		this.uiItems.push(item);
	}

	addUIUpdate(item) {
		this.uiItems.push(item);
	}

	display() {
		for (let i = 0; i < this.displayItems.length; i++) {
			this.displayItems[i].display();
		}
	}

	update(offset) {
		for (let i = 0; i < this.updateItems.length; i++) {
			this.updateItems[i].update(offset);
		}
	}

	uiOver(x, y) {
		for (let i = 0; i < this.uiItems.length; i++) {
			this.uiItems[i].over(x, y);
			this.uiItems[i].out(x, y);
		}
	}

	uiDown(x, y) {
		for (let i = 0; i < this.uiItems.length; i++) {
			this.uiItems[i].down(x, y);
		}
	}

	uiUp(x, y) {
		for (let i = 0; i < this.uiItems.length; i++) {
			this.uiItems[i].up(x, y);
		}
	}
}