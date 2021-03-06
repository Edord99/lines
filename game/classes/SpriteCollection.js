/*
	used mostly by SceneManager to handle sprites for each scene
	also used by game asset managers like pack or map
*/

class SpriteCollection {
	constructor(sprites) {
		this.sprites = sprites ? [...sprites] : [];
	}

	get length() {
		return this.sprites.length;
	}

	sprite(index) {
		return this.sprites[index];
	}

	remove(sprite) {
		this.sprites.splice(this.sprites.indexOf(sprite), 1);
	}

	add(sprite) {
		this.sprites.push(sprite);
	}

	// loop 
	all(callback) {
		for (let i = 0; i < this.sprites.length; i++) {
			callback(this.sprites[i], i);
		}
	}

	display() {
		this.all(sprite => { sprite.display(); });
	}
}