class ItemEditUI extends EditUI {
	constructor(item, panel) {
		super(item, panel);
	}

	create() {
		const self = this;

		this.uis.xLabel = new UILabel({ text: "x" });
		this.uis.x = new UIText({
			value: this.item.position.x,
			callback: function(value) {
				this.item.position.x = +value;
			}
		});

		this.uis.yLabel = new UILabel({ text: "y" });
		this.uis.y = new UIText({
			value: this.item.position.y,
			callback: function(value) {
				this.item.position.y = +value;
			}
		});

		this.uis.addScene = new UIButton({
			text: "+ scene",
			callback: function() {
				const s = addSceneSelector(Game.scenes[0], this.item.scenes.length);
				this.panel.add(s, this.row);
			}
		});

		this.uis.focus = new UIButton({
			text: "📍",
			callback: function() {
				edi.zoom.view.x = self.item.position.x;
				edi.zoom.view.y = self.item.position.y;
			}
		});


		this.uis.sceneSelectors = [];
		for (let i = 0; i < this.item.scenes.length; i++) {
			this.uis.sceneSelectors[i] = new UISelect({
				options: Game.scenes,
				selected: this.item.scenes[i],
				callback: function(value) {
					this.item.scenes[i] = value;
				}
			});
		}

		super.create(); /* bc super calls ui.add */
	}
}