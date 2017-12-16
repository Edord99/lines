function Interface(app) {
	let self = this;

	this.panels = {};
	this.interfaces = {}; /* better name for interfaces ?? */

	this.framesPanel = new UI({id:"frames"});
	this.plusFrame = new UI({id:"current"}); /* plus frame is unsaved drawing frame */
	this.frameNumDisplay = new UIDisplay({id:"frame"});
	this.frameElems = new UIList({id:"frame"});

	this.interfaces["a"] = new UI("explode", "click", function() {
		app.data.explode(false, false);
	});

	this.interfaces["shift-a"] = new UI({
		id:"follow", 
		event: "click", 
		callback: function() {
			app.data.explode(true, false);
		}
	});

	this.interfaces["ctrl-a"] = new UI({
		id:"explode-over",
		event:"click", 
		callback: function() {
			app.data.explode(false, true);
		}
	});

	this.interfaces["alt-a"] = new UI({
		id:"follow-over", 
		event: "click", 
		callback: function() {
			app.data.explode(true, true);
		}
	});

	/* updates the frame panel representation of frames, sets current frame, sets copy frames */
	this.updateFramesPanel = function() {
		const numFrames = self.frameElems.getLength();
		/* this creates frames that don't already exist
			loop from the num of already made html frames to frames.length */
		if (app.data.frames.length > numFrames) {
			for (let i = numFrames; i < app.data.frames.length; i++) {
				const frmElem = document.createElement("div");
				frmElem.classList.add("frame");
				frmElem.textContent = i;
				/* 
				add drawing nums, do this later after figuring out lines/frames/drawings 
				frmElem.innerHTML = i + "<br>";
				for (let d = 0; d < frames[i].length; d++) {
					frmElem.innerHTML += frames[i][d].d;
				}
				*/
				/* click on frame, set the current frame */
				frmElem.onclick = function(ev) {
					app.draw.currentFrame = app.draw.currentFrameCounter = i;
					self.updateFrameNum();
				};
				/* right click, add/remove from copy frames */
				frmElem.oncontextmenu = function(ev) {
					ev.preventDefault();
					if (!this.classList.toggle("copy")){
						app.data.framesToCopy.splice(app.data.framesToCopy.indexOf(i), 1);
					} else {
						this.classList.add("copy");
						app.data.framesToCopy.push(i);
					}
				};
				/* this is probably only happening here ... */
				this.framesPanel.el.insertBefore(frmElem, self.plusFrame.el);
				/* not updating length of frame elems, shouldnt that reference still work?  */
			}
		} else {
			/* if there are same number of less then frames than frame divs */
			/* this seems to only happen when deleting the current frame so i'm confused.... 
			delete frame should always be the current frame, is there another way to delete frames?  */
			for (let i = numFrames; i > app.data.frames.length; i--){
				/* remove html frame */
				this.frameElems.remove(i-1);
			}
		}
		this.updateFrameNum();
	};

	this.updateFrameNum = function() {
		this.frameNumDisplay.set(app.draw.currentFrame);
		document.getElementById("current").removeAttribute("id"); /* fine for now... */
		if (self.frameElems.els[app.draw.currentFrame])
			self.frameElems.setId("current", app.draw.currentFrame);
		else 
			this.plusFrame.setId("current");
	};
	/* is this interface or drawing... 
		i guess things that reference everything can be interface */
	this.nextFrame = function() {
		app.mouse.isDrawing = false;
		app.data.saveLines();
		if (app.draw.currentFrame < app.data.frames.length) 
			app.draw.currentFrame++;
		self.updateFramesPanel();
	};

	this.prevFrame = function() {
		app.mouse.isDrawing = false;
		app.data.saveLines();
		if (app.draw.currentFrame > 0) 
			app.draw.currentFrame--;
		self.updateFramesPanel();
	};
}