class Menu extends Phaser.State {
	
	title: Phaser.Sprite;
	claw: Phaser.Sprite;
	start: Phaser.Sprite;
	timer: Phaser.Timer;
	gpad;
	menuMusic;
	
	constructor() {
		super();
	}

	create(){
		this.claw = this.game.add.sprite(this.game.width/2, 1, 'claw');
		this.claw.anchor.setTo(.5, 0);
		this.title = this.game.add.sprite(this.game.width/2, 230, 'title');
		this.title.anchor.setTo(.5, .5);
		this.start = this.game.add.sprite(this.game.width/2, 500, 'start');
		this.start.anchor.setTo(.5, .5);
		
		this.claw.alpha = 0;
		this.start.alpha = 0;
		this.title.alpha = 0;
		
		this.fadeIn();
		this.pulse();
		
		this.start.inputEnabled = true;
		this.title.inputEnabled = true;
		this.start.events.onInputDown.add(function(){this.fadeOut();}, this);
		this.title.events.onInputDown.add(function(){this.fadeOut();}, this);
		
		this.gpad = this.game.input.gamepad.pad1;
		this.menuMusic = this.game.add.audio('menuMusic');
		this.menuMusic.play();
	}
	
	update(){
		if(this.gpad.justPressed(Phaser.Gamepad.XBOX360_A)){
        	this.fadeOut();
		}
	}
	
	pulse() {
		this.game.time.events.loop(500, this.updateCounter, this);
	}
	
	updateCounter() {
		if(this.start.exists){
			this.start.kill();
		} else {
			this.start.revive();	
		}
	}
	
	fadeIn() {
		var tween1 = this.add.tween(this.claw).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
		tween1.onComplete.add(function(){
			var tween2 = this.add.tween(this.title).to({ alpha: 1 }, 4000, Phaser.Easing.Linear.None, true);
		}, this);
		var tween3 = this.add.tween(this.start).to({ alpha: 1 }, 3000, Phaser.Easing.Linear.None, true);
	}
	
	fadeOut() {
		this.add.tween(this.title).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
		this.add.tween(this.start).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
		var tween = this.add.tween(this.claw).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startGame, this);
		this.menuMusic.fadeOut(500);
	}
	
	startGame() {
		this.menuMusic.destroy();
		this.game.cache.removeSound('menuMusic');
		this.game.state.start('levelone');
		// this.game.state.start('boss');
	}
}