function Interface(app) {
	let self = this;

	this.playButton = document.getElementById("play");
	this.playButton.addEventListener("click", function() {
		app.draw.playing = true;
	});

	this.pauseButton = document.getElementById("pause");
	this.pauseButton.addEventListener("click", function() {
		app.draw.playing = false;
		self.updateFrameNum();
	});

	this.framesPanel = document.getElementById("frames");
	this.plusFrame = document.getElementsByClassName("plusframe")[0]; /* plus frame is unsaved drawing frame */
	this.frameNumDisplay = document.getElementById("frame");
	this.frameElems = document.getElementsByClassName("frame");

	/* updates the frame panel representation of frames, sets current frame, sets copy frames */
	this.updateFramesPanel = function() {
		let numFrames = frameElems.length;
		/* this creates frames that don't already exist
		loop from the num of already made html frames to frames.length */
		if (app.data.frames.length > numFrames) {
			for (let i = numFrames; i < app.data.frames.length; i++) {
				const frmElem = document.createElement("div");
				frmElem.classList.add("frame");
				frmElem.id = "fr" + i;
				frmElem.dataset.index = i;
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
					ev.preventDefault();
					app.draw.currentFrame = app.draw.currentFrameCounter = i;
					self.updateFrameNum();
				};
				/* right click, add/remove from copy frames */
				frmElem.oncontextmenu = function(ev) {
					ev.preventDefault();
					if (!this.classList.toggle("copy")){
						app.data.copyFrames.splice(app.data.copyFrames.indexOf(i), 1);
					} else {
						this.classList.add("copy");
						app.data.copyFrames.push(i);
					}
				};
				this.framesPanel.insertBefore(frmElem, plusFrame);
			}
		} else {
			/* if there are same number of less then frames than frame divs */
			/* this seems to only happen when deleting the current frame so i'm confused.... 
			delete frame should always be the current frame, is there another way to delete frames */
			for (let i = numFrames - 1; i > app.data.frames.length; i--){
				/* remove html frame, make the plus frame the current frame */
				let removeFrame = document.getElementById("fr" + i);
				/* check if deleted frame is the current frame */
				if (removeFrame.classList.contains("current")) this.plusFrame.classList.add("current");
				removeFrame.remove();
			}
		}
		this.updateFrameNum();
	};

	this.updateFrameNum = function() {
		this.frameNumDisplay.textContent = app.draw.currentFrame;
		const currentElem = document.querySelector(".current");
		currentElem.classList.remove("current");
		const newElem = document.querySelector('#fr' + app.draw.currentFrame);
		if (newElem != null) newElem.classList.add("current");
		else this.plusFrame.classList.add("current");
	};

	

}