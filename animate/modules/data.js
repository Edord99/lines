function Data(anim) {
	const self = this;

	this.copyFrame = []; // copy layers in frame
	this.pasteFrames = []; // frame indexes to paste

	this.saveStates = {
		current: {
			drawings: undefined,
			layers: undefined
		},
		prev: {
			drawings: undefined,
			layers: undefined
		}
	};

	/* r key - save lines and add new lines */
	// this.saveLines = function() {
	// 	if (lns.draw.drawing.length > 0) {
	// 		// const layer = _.cloneDeep(lns.draw.layer);
	// 		// layer.d = anim.drawings.length;
	// 		// anim.layers.push(layer);
	// 		// anim.drawings.push(_.cloneDeep(lns.draw.drawing));
	// 		lns.draw.reset();
			
	// 		self.saveState(); /* save current state - one undo currently */
	// 	}
	// };

	/* c key  */
	this.copy = function() {
		self.saveLines();
		self.copyFrame = [];
		for (let i = 0; i < anim.layers.length; i++) {
			if (anim.layers[i].isInFrame(anim.currentFrame))
				self.copyFrame.push(anim.layers[i]);
		}
	};

	/* v key */
	this.paste = function() {
		self.saveState();

		if (self.pasteFrames.length == 0)
			self.pasteFrames.push(anim.currentFrame); 

		/* copy one frame onto multiple */
		for (let i = 0; i < self.pasteFrames.length; i++) {
			for (let j = 0; j < self.copyFrame.length; j++) {
				self.copyFrame[j].addIndex(self.pasteFrames[i]);
			}
		}

		self.clearSelected();
		self.saveLines();
		lns.ui.update();
	};

	this.selectFrame = function(elem) {
		if (!elem.classList.contains("selected")) {
 			elem.classList.add("selected");
 			self.pasteFrames.push(+elem.textContent);
 		} else {
 			self.pasteFrames.splice(self.pasteFrames.indexOf(+elem.textContent), 1);
 			elem.classList.remove("selected");
 		}
	};

	/* shift v */
	this.selectAll = function() {
		/* if less than all are selected deselect those first */
		const someSelected = Array.from(lns.ui.framesPanel.children).filter(elem => elem.classList.contains('selected')).length < lns.ui.framesPanel.children.length - 1;
		lns.ui.framesPanel.looper(elem => {
			if (someSelected) elem.classList.remove('selected');
			self.selectFrame(elem);
		});
	};

	/* alt v */
	this.selectRange = function() {
		const start = prompt("Start frame:");
		const end = prompt("end frame:");
		lns.ui.framesPanel.looper(elem => {
			self.selectFrame(elem);
		}, start, end);
	};

	/* ctrl v */
	this.clearSelected = function() {
		self.pasteFrames = [];

		/* this is a ui thing ... */
		const copyFrameElems = document.getElementsByClassName("selected");
		for (let i = copyFrameElems.length - 1; i >= 0; i--) {
			copyFrameElems[i].classList.remove("selected");
		}
	};

	/* x key */
	this.clearLines = function() {
		lns.draw.reset();
	};

	this.clearLayers = function() {
		self.saveState(); /* will save lines ... */
		for (let i = anim.layers.length - 1; i >= 0; i--) {
			if (anim.layers[i].isInFrame(anim.currentFrame))
				anim.layers[i].removeIndex(anim.currentFrame);
		}
	};

	this.cutTopLayer = function() {
		for (let i = anim.layers.length - 1; i >= 0; i--) {
			if (anim.layers[i].isInFrame(anim.currentFrame))
				anim.layers[i].removeIndex(anim.currentFrame);
			break;
		}
	};

	this.cutBottomLayer = function() {
		for (let i = 0; i < anim.layers.length; i++) {
			if (anim.layers[i].isInFrame(anim.currentFrame))
				anim.layers[i].removeIndex(anim.currentFrame);
			break;
		}
	};

	this.clearFrame = function() {
		self.clearLines();
		self.clearLayers();
	};

	/* d key */
	this.deleteFrame = function(index) {
		if (!index) index = lns.anim.currentFrame;
		self.saveState();
		if (anim.layers.length > 0) {
			for (let i = anim.layers.length - 1; i >= 0; i--) {
				if (anim.layers[i].isInFrame(index)) 
					anim.layers[i].shiftIndex(index, -1);
			}
		}
		lns.ui.setFrame(anim.currentFrame - 1);
		lns.ui.update();
	};

	/* shift-d */
	this.deleteFrameRange = function() {
		self.saveState();
		const startFrame = +prompt("Start frame:");
		const endFrame = +prompt("End frame:");

		if (endFrame > 0) {
			for (let j = endFrame; j >= startFrame; j--) {
				self.deleteFrame(j);
			}

			/* change the current frame in case its missing  */
			anim.frame = startFrame > 0 ? startFrame - 1 : 0;
			lns.ui.updateFramesPanel();
		}
	};

	/* z key */
	this.cutLastSegment = function() {
		if (lns.ui.layers.length > 0) lns.ui.cutLayerSegment();
		else lns.draw.pop(); 
	};

	/* shift z */
	this.cutLastLine = function() {
		if (lns.ui.layers.length > 0) lns.ui.cutLayerLine(); /* not currently working */
		else lns.draw.popOff();
	};

	/* save current state of frames and drawing - one undo */
	this.saveState = function() {
		/*
			if save state already exists, save current to previous state
			if not save previous to new
			always save current to new
		*/
		if (self.saveStates.current.drawings) {
			self.saveStates.prev.drawings = _.cloneDeep(self.saveStates.current.drawings);
			self.saveStates.prev.layers = _.cloneDeep(self.saveStates.current.layers);
		} else {
			self.saveStates.prev.drawings = _.cloneDeep(anim.drawings);
			self.saveStates.prev.layers = _.cloneDeep(anim.layers);
		}

		self.saveStates.current.drawings = _.cloneDeep(anim.drawings);
		self.saveStates.current.layers = _.cloneDeep(anim.layers);
	};

	/* ctrl z - undo one save state */
	this.undo = function() {
		if (self.saveStates.prev.drawings) {
			anim.drawings = _.cloneDeep(self.saveStates.prev.drawings);
			anim.layers = _.cloneDeep(self.saveStates.prev.layers);
			
			self.saveStates.current.drawings = _.cloneDeep(self.saveStates.prev.drawings);
			self.saveStates.current.layers = _.cloneDeep(self.saveStates.prev.layers);

			self.saveStates.prev.drawings = undefined;
			self.saveStates.prev.layers = undefined;
		} else {
			console.log("%c Can't undo ", "color:lightblue;background:gray;");
		}
		lns.ui.update();
	};

	/* i key */
	this.insertFrameBefore = function() {
		self.saveLines();
		for (let i = 0; i < anim.layers.length; i++) {
			anim.layers[i].shiftIndex(anim.currentFrame, 1);
			anim.layers[i].removeIndex(anim.currentFrame);
		}
		lns.ui.update();
	};

	/* shift-i key */
	this.insertFrameAfter = function() {
		self.saveLines();
		for (let i = 0, len = anim.layers.length; i < len; i++) {
			anim.layers[i].shiftIndex(anim.currentFrame + 1, 1);
			anim.layers[i].removeIndex(anim.currentFrame + 1);
		}
		anim.frame = anim.currentFrame + 1;
		lns.ui.update();
	};

	/* m key */
	this.addMultipleCopies = function() {
		self.copyFrame = [];
		self.clearSelected();
		let n = +prompt("Number of copies: ");
		self.copy();
		if (n) {
			for (let i = 0; i < n; i++) {
				lns.ui.nextFrame();
				self.paste();
			}
		}
		lns.ui.update();
	};

	/* q key  */
	this.offsetDrawing = function(offset) {
		self.saveLines();
		const _layers = [];
		for (let i = 0; i < anim.layers.length; i++) {
			if (anim.layers[i].isInFrame(anim.currentFrame)) 
				_layers.push(anim.layers[i]);
		}
		if (_layers) {
			self.saveLines();
			self.saveState();
			if (!offset) offset = new Cool.Vector(+prompt("x"), +prompt("y"));
			if (offset) {
				
				// check to see if layers are selected
				let layers = [];
				if (lns.ui.layers.length > 0) {
					for (let i = 0; i < lns.ui.layers.length; i++) {
						if (lns.ui.layers[i].toggled)
							layers.push(lns.ui.layers[i])
					}
				} else {
					layers = _layers;
				}

				for (let i = 0; i < layers.length; i++) {
					layers[i].x += offset.x;
					layers[i].y += offset.y;
				}
			}
		} else {
			console.log("%c No layers in frame ", "color:yellow; background:black;");
		}
	};

	/* a key */
	this.explode = function(params) {
		self.saveLines();
		const n = +prompt('Number of frames?');
		for (let i = 0; i < anim.layers.length; i++) {
			const layer = anim.layers[i];
			if (layer.isInFrame(anim.currentFrame)) {
				layer.endFrame = layer.startFrame + n;
				if (anim.currentState.end < layer.endFrame) anim.currentState.end = layer.endFrame;
				switch(params.type) {
					case "Explode":
						layer.addTween({
							prop: 'e',
							sf: layer.f.s,
							ef: layer.f.e,
							sv: 0,
							ev: anim.drawings[layer.d].length
						});
					break;
					case "Reverse":
						layer.addTween({
							prop: 's',
							sf: layer.f.s,
							ef: layer.f.e,
							sv: 0,
							ev: anim.drawings[layer.d].length
						});
					break;
					case "ExRev":
						const mid = Math.floor(n / 2);
						layer.addTween({
							prop: 'e',
							sf: layer.f.s,
							ef: layer.f.s + mid,
							sv: 0,
							ev: anim.drawings[layer.d].length
						});
						layer.addTween({
							prop: 's',
							sf: layer.f.s + mid,
							ef: layer.f.e,
							sv: 0,
							ev: anim.drawings[layer.d].length
						});
					break;
				}
				layer.ui.update();
			}
		}
		lns.ui.update();
	};
}
