function animateInterface(ui) {
	const self = ui;

	ui.framesPanel = new UI({ id:"frames" });
	ui.frameElems = new UIList({ class: "frame" });

	ui.rl = new UIToggleButton({
		id: "right-left",
		on: "R/L",
		off: "L/R",
		callback: function() {
			if (this.isOn) lns.canvas.canvas.parentElement.classList.add('right');
			else lns.canvas.canvas.parentElement.classList.remove('right');
		}		
	});

	/* update interface */
	ui.updateInterface = function() {
		self.updateFrameNum();
		self.layers.resetLayers();
		self.drawings.resetDrawings();
		self.layers.drawLayers();
		self.updateFramesPanel();
	};

	/* plus frame is unsaved drawing frame
		do i need a plus frame? */
	ui.plusFrame = new UI({
		id:"current",
		event: "click",
		callback: function() {
			/* make frame ui */
			self.setFrame(lns.numFrames);
		},
		key: "+"
	});
	ui.keys['+'] = ui.plusFrame;

	/* f key */
	ui.setFrame = function(f) {
		if (+f <= lns.numFrames) {
			self.beforeFrame();
			lns.render.setFrame(+f);
			self.afterFrame();
		}
	};

	/* updates the frame panel representation of frames,
		sets current frame,
		sets copy frames */
	ui.updateFramesPanel = function() {

		const numFrames = self.frameElems.getLength() - 1;
		/* this creates frames that don't already exist
			loop from the num of already made html frames to frames.length */
		if (lns.numFrames > numFrames) {
			/* this seems bad ... */
			for (let i = numFrames; i < lns.numFrames; i++) {
				/* should be a ui? */
				const frameElem = document.createElement("div");
				frameElem.classList.add("frame");
				frameElem.textContent = i;
				frameElem.dataset.index = i;

				/* click on frame, set the current frame */
				frameElem.onclick = function(ev) {
					lns.render.setFrame(i);
					self.updateInterface();
				};

				/* right click, add/remove from copy frames */
				frameElem.oncontextmenu = function(ev) {
					ev.preventDefault();
					lns.data.selectFrame(ev.currentTarget);
				};

				/* this is one time un-ui thing */
				// this.framesPanel.el.appendChild(frameElem);
				ui.framesPanel.el.insertBefore(frameElem, self.plusFrame.el);
			}
		} else {
			/* if there are same number of less then frames than frame divs
				delete current frame */
			for (let i = numFrames - 1; i >= lns.numFrames; i--){
				ui.frameElems.remove(i); /* remove html frame */
			}
		}
		ui.updateFrameNum();
	};

	/* update frame display and current frame */
	ui.updateFrameNum = function() {

		if (lns.currentFrame == lns.numFrames && self.layersInFrame(lns.currentFrame)) {
			lns.numFrames++;
		}

		if (document.getElementById("current"))
			document.getElementById("current").removeAttribute("id");
		if (self.frameElems.els[lns.currentFrame]) // also un-ui
			self.frameElems.setId("current", lns.currentFrame);
		else
			self.plusFrame.setId("current");
		self.faces.frameDisplay.set(lns.currentFrame);
	};

	/* call before changing a frame */
	ui.beforeFrame = function() {
		lns.draw.isDrawing = false;
		lns.data.saveLines();

		/* determine if add to num frames */
		if (self.layersInFrame(lns.currentFrame) && lns.numFrames < lns.currentFrame + 1)
			lns.numFrames++;
	};

	ui.layersInFrame = function(n) {
		let inFrame = false;
		for (let i = 0; i < lns.layers.length; i++) {
			if (lns.layers[i].isInFrame(n)) 
				inFrame = true;
		}
		return inFrame;
	};

	/* call after changing a frame */
	ui.afterFrame = function() {
		self.updateInterface();
		self.layers.resetLayers();
		self.drawings.resetDrawings();
	};

	/* e key - go to next frame */
	ui.nextFrame = function() {
		self.beforeFrame();
		if (lns.currentFrame < lns.numFrames) lns.render.setFrame(lns.currentFrame + 1);
		self.afterFrame();
	};

	/* w key - got to previous frame */
	ui.prevFrame = function() {
		self.beforeFrame();
		if (lns.currentFrame > 0) lns.render.setFrame(lns.currentFrame - 1);
		self.afterFrame();
	};

	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(key => {
		self.keys[key] = {
			callback: function() {
				self.setFrame(+key);
			}
		};
	});

	/* external interfaces */
	ui.palette = new Palette();
	
	ui.panels.layers = new Panel('layers-menu', 'Layers');
	ui.layers = new Layers(ui.panels.layers);

	ui.panels.drawings = new Panel("drawing-menu", "Drawings");
	ui.drawings = new Drawings(ui.panels.drawings);

	// ui.panels.settings = new Panel('settings-menu', "Settings");
	// ui.settings = new Settings(ui.panels.settings);

	ui.fio = new FilesInterface(ui);
	ui.capture = new Capture();

	function appSave() {
		console.log(lns.render.lineColor);
		return {
			canvasColor: lns.canvas.bgColor,
			lineWidth: lns.canvas.ctx.lineWidth,
			lineColor: lns.render.lineColor,
			width: lns.canvas.width,
			height: lns.canvas.height,
			fps: lns.render.fps,
			lps: lns.render.lps,
			onionSkinIsVisible: lns.render.onionSkinIsVisible,
			onionSkinNum: lns.render.onionSkinNum,
			mouseInterval: lns.draw.mouseInterval,
			palettes: lns.ui.palette.palettes,
			rl: lns.ui.rl.isOn,
			displayLayers: lns.ui.layers.canvas.canvas.style.display
		};
	}

	function appLoad(settings) {
		lns.canvas.setBGColor(settings.canvasColor);
		lns.canvas.setWidth(settings.width);
		lns.canvas.setHeight(settings.height);
		lns.canvas.setLineWidth(settings.lineWidth);
		lns.render.setFps(settings.fps);
		lns.render.setLps(settings.lps);
		lns.render.lineColor = settings.lineColor;
		lns.render.onionSkinIsVisible = settings.onionSkinIsVisible;
		lns.render.onionSkinNum = settings.onionSkinNum;

		lns.ui.faces.lineColor.setValue(settings.lineColor);
		lns.ui.faces.bgColor.setValue(settings.canvasColor);
		lns.ui.faces.lineWidth.setValue(settings.lineWidth);
		lns.ui.faces.onionSkinNum.setValue(settings.onionSkinNum);

		/* update sets value and calls callback ...*/
		lns.ui.faces.mouseInterval.update(settings.mouseInterval); 

		lns.ui.palette.palettes = settings.palettes;
		if (lns.ui.palette.current) 
			self.loadPalette(lns.palettes.current);
		for (const key in settings.palettes) {
			if (key != 'current') {
				lns.ui.panels.palette.add(new UIButton({
					title: key,
					callback: function() {
						lns.ui.palette.loadPalette(key);
					}
				}));
			}
		}

		if (settings.rl == false) {
			ui.rl.callback();
			ui.rl.toggle();
		}

		if (settings.displayLayers) {
			ui.layers.toggleCanvas.callback();
			ui.layers.toggleCanvas.toggle();
		}
	}

	ui.settings = new Settings(lns, 'lns', appSave, appLoad);

	ui.settings.canvasLoad = function() {
		if (localStorage['settings-lns']) {
			const settings = JSON.parse(localStorage['settings-lns']);
			if (settings) lns.canvas.setLineWidth(settings.lineWidth);
		}
	};

	ui.settings.toggleSaveSettings = function() {
		lns.files.saveSettingsOnUnload = !lns.files.saveSettingsOnUnload;
	};
}
