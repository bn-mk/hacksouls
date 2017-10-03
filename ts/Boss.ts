class Boss extends Phaser.State {
	
	bossMap: Phaser.Tilemap;
	bossBackgroundLayer;
	bossPlatformLayer;
	dragon: Phaser.Sprite;
	dleft: Phaser.Sprite;
	dright: Phaser.Sprite;
	player: Player;
	score: number;
	timeElapsedLeft: boolean;
	timeElapsedRight: boolean;
	rhealth: number;
	lhealth: number;
	ui;
	canDie: boolean;
	fader: Phaser.Sprite;
	bossMusic;
	
	constructor() {
		super();
		this.timeElapsedLeft = false;
		this.timeElapsedRight = false;
		this.rhealth = 10;
		this.lhealth = 10;
		this.canDie = true;
	}
	
	init(score) {
		this.score = score;
		// this.score = 10;
	}	
	
	preload() {
		this.load.image('claw_left', '../images/dragon/dragon_claw_left.png');
		this.load.image('claw_right', '../images/dragon/dragon_claw_right.png');
		this.load.image('dragon', '../images/dragon/dragon_head.png');
		this.load.tilemap('bossMap', '../images/tilemaps/boss_level.json', null, Phaser.Tilemap.TILED_JSON);
	}
	
	create() {
		this.bossMusic = this.game.add.audio('bossMusic');
		this.bossMusic.play();
		
		this.bossMap = this.game.add.tilemap('bossMap');
        this.bossMap.addTilesetImage('texture_sheet_example', 'tiles');
        this.bossBackgroundLayer = this.bossMap.createLayer('background');
        this.bossPlatformLayer = this.bossMap.createLayer('platforms');

        this.bossPlatformLayer.resizeWorld();
        this.bossBackgroundLayer.resizeWorld();
		
		 this.bossMap.setCollisionBetween(1, 100000, true, 'platforms');
		
		this.dragon = this.game.add.sprite(this.game.width/2, this.game.height/2, 'dragon');
		this.dragon.anchor.setTo(.5 ,.5);
		this.dleft = this.game.add.sprite(500, this.game.height - 180, 'claw_left');
		this.dragon.anchor.setTo(.5 ,.5);
		this.dright = this.game.add.sprite(50, this.game.height - 180, 'claw_right');
		this.dragon.anchor.setTo(.5 ,.5);
		
		this.game.physics.enable(this.dleft);
		this.game.physics.enable(this.dright);
		this.dright.body.immovable = true;
		this.dleft.body.immovable = true;
		this.dright.body.setSize(256, 100, 0, 64);
		this.dleft.body.setSize(256, 100, 0, 64);
		
		this.dragon.alpha = 0;
		this.dright.alpha = 0;
		this.dleft.alpha = 0;

		
		
		this.player = new Player(this.game, this.game.width/2, this.game.height - 128, 'player');
		
		var dtween = this.add.tween(this.dragon).to({ alpha: 1 }, 3000, Phaser.Easing.Linear.None, true);
		var dtween2 = this.add.tween(this.dright).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
		var dtween3 = this.add.tween(this.dleft).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
		this.ui = new UiManager(this.game);
	    // LevelOne.UIM = ui;
		this.ui.updateScore(this.score);
		
		var time1 = this.game.time.events.add(Phaser.Timer.SECOND * 3, function(){this.timeElapsedLeft = true;}, this);
		var time2 = this.game.time.events.add(Phaser.Timer.SECOND * 4, function(){this.timeElapsedRight = true;}, this);
	}
	
	update() {
		 this.game.physics.arcade.collide(this.player, this.bossPlatformLayer);
		 this.game.physics.arcade.collide(this.player, this.dleft, this.hitl, null, this);
		 this.game.physics.arcade.collide(this.player, this.dright, this.hitr, null, this); 
		 
		 if(this.timeElapsedRight){
			if(this.dright.body.y >= 524){
				this.dright.body.velocity.y = -300;
			}
			if(this.dright.body.y <= 400){
				this.dright.body.velocity.y = 400;
			}
		 }
		 if(this.timeElapsedLeft){
			if(this.dleft.body.y >= 524){
				this.dleft.body.velocity.y = -300;
			}
			if(this.dleft.body.y <= 400){
				this.dleft.body.velocity.y = 400;
			}
		 }
		 
		 if((this.rhealth <= 0 && this.lhealth <= 0) && this.canDie) {
			    this.canDie = false;
			    this.dragonDead();
		 }
		 if(this.player.body.touching.up){
			 this.bossMusic.fadeOut(500);
			 this.player.die();
			 this.bossMusic.destroy();
        	 this.game.cache.removeSound('bossMusic');
		 }
		 
		 
	}
	
	dragonDead() {
		if(this.dragon.exists){
			this.dragon.kill();
		}
		this.fader = this.game.add.sprite(0,0, 'fader');
		this.fader.alpha = 0;
		var dtween2 = this.add.tween(this.fader).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
		dtween2.onComplete.add(function(){this.game.state.start('credits');}, this);
		this.bossMusic.fadeOut(1000);
		this.bossMusic.destroy();
		this.game.cache.removeSound('bossMusic');
		
	}
	
	hitl(){
		switch(Player.inst.animations.currentAnim.name) {
			case 'plunge' :
				//bounce back
				// this.body.bounce.x = 70;
				this.lhealth -= 1;
				if(this.lhealth <= 0){
					
					this.dleft.body.enable = false;
					this.dleft.kill();
					this.ui.updateScore();
					/**
					 * TODO
					 * destroy sprite if out of bounds
					 * this.destroy();
					 * or this.outOfBoundsKill = true; in constructer?
					*/
					
				}
			break;
		}
	}
	
	hitr(){
		switch(Player.inst.animations.currentAnim.name) {
			case 'plunge' :
				//bounce back
				// this.body.bounce.x = 70;
				this.rhealth -= 1;
				if(this.rhealth <= 0){
					
					this.dright.body.enable = false;
					this.ui.updateScore(200);
					this.dright.kill();
					/**
					 * TODO
					 * destroy sprite if out of bounds
					 * this.destroy();
					 * or this.outOfBoundsKill = true; in constructer?
					*/
					
				}
			break;
		}
	}
	
	// render() {
	// 	 this.game.debug.bodyInfo(this.player, 64, 64);
	// 	//  this.game.debug.body(this.dright);
	// 	//  this.game.debug.body(this.player);
    //     // this.game.debug.renderRectangle(this.dleft.body);
	// }
	
}