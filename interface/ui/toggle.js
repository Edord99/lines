class UIToggle extends UIButton {
	constructor(params) {
		super(params);
		this.onText = params.onText;
		this.offText = params.offText;
		super.setTextContent(this.onText);
		
		this.isOn = true;
		if (params.isOn === false) this.toggle();
	}

	handler() {
		this.callback();
		this.toggle();
	}

	toggle() {
		if (this.isOn) this.off();
		else  this.on();
		this.isOn = !this.isOn;
	}

	on() {
		this.el.textContent = this.onText;
		this.removeClass('off');
	}

	off() {
		this.el.textContent = this.offText;
		this.addClass('off');
	}
}
