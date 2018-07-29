/* global Lines object */
window.addEventListener("load", function() {
	Lines = {};
	// global parts used everywhere
	Lines.lines = []; // lines currently being drawn
	Lines.frames = [];
	Lines.drawings = []; // saved drawings
	Lines.currentFrame = 0;
	
	// modules 
	Lines.interface = new Interface();
	// width height color, def color is black 000000
	Lines.canvas = new Canvas(512, 512, "ffffff" ); 
	Lines.draw = new Draw();
	Lines.data = new Data();
	Lines.lineColor = new Color("color", "Line Color"); 
	/*Lines.lineColor.setColor("ffffff");*/
	Lines.drawEvents = new DrawEvents();
	Lines.fio = new Files_IO();
	
	// start, for some reason
	Lines.draw.start();
});
