class UIColor extends UIInput {
	constructor(params) {
		super(params);
		this.el.type = "color";
		this.colors = [];

		this.el.addEventListener('input', ev => {
			this.current = ev.target.value;
			this.callback(ev.target.value);
		});

		this.el.addEventListener('focus', ev => {
			this.addColor(this.current);
		});

	}

	addColor(color) {
		const self = this;
		if (!this.colors.includes(color) && color) {
			this.colors.push(color);
			const btn = new UIButton({
				text: color,
				css: { "background": color },
				value: color,
				callback: function() {
					self.callback(color);
					self.setValue(color);
				}
			});
			
			/* only reference like this in elements */
			this.el.parentNode.appendChild(btn.el);
		}
	}

	update(value) {
		this.callback(value);
		this.setValue(value);
	}

	setValue(value) {
		this.addColor(value);
		this.current = value;
		super.setValue(value);
	}
}