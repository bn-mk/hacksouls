class Player extends Phaser.Sprite {
	static inst;
	flipped: boolean;
	game: Phaser.Game;
	x: number;
	y: number;
	frame: any;
	fader: Phaser.Sprite;
	gpad;
	hitSound;
	jumpSound;

	
	constructor(game: Phaser.Game, x: number, y: number, key) {
		super(game, x, y, key);
        this.game.physics.arcade.enable(this);
		this.anchor.setTo(.5, .5);
		//health
		this.health = 10;
		//bounding box and physics
		this.body.gravity.y = 1000;
        this.body.collideWorldBounds = true;
		this.body.setSize(32, 32, 0, 16);
		//add to world and add animations
		this.game.add.existing(this);
		this.animations.add('idle', ['idle_anim_1.png', 'idle_anim_2.png'], 4, true);
        this.animations.add('run', ['run_anim_1.png', 'run_anim_2.png', 'run_anim_3.png', 'run_anim_4.png'], 12, true);   
        this.animations.add('jump', ['jump_anim.png'], 1, true);  
        this.animations.add('hit', ['attack.png'], 1, true);  
        this.animations.add('block', ['block.png'], 1, true);  
        this.animations.add('plunge', ['plunge_attack.png'], 1, true);  
        this.animations.add('die', ['death_1.png', 'death_2.png'], 1, true);  
		//static ref - set to null on state change
		Player.inst = this;
		this.gpad = this.game.input.gamepad.pad1;
		
		this.hitSound = this.game.add.audio('hit');
		this.jumpSound = this.game.add.audio('jump');
	}
	
	update() {
		
		if(this.alive)
		{
			//collisions done in Enemy.ts
			this.body.velocity.x = 0;
			this.rotation = 0;
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.gpad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.gpad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
			{
				//move left
				this.body.velocity.x = -150;
				if(!this.flipped){
					this.scale.x *= -1;
					this.flipped = true;
				}
				this.animations.play('run');
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.gpad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.gpad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X))
			{
				//move right
				if(this.flipped){
					this.scale.x *= -1;
					this.flipped = false;
				}
				this.body.velocity.x = 150;
				this.animations.play('run');
			}
			else
			{
				//idle
				this.animations.play('idle');
			}
		
			//jump
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && (this.body.blocked.down || this.body.touching.down) && this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR))
			{
				this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
				this.animations.stop();
				this.body.velocity.y = -400;
				this.jumpSound.play();
			}
			
			//gpad jump
			if(this.gpad.justPressed(Phaser.Gamepad.XBOX360_A) && (this.body.blocked.down || this.body.touching.down)){
				this.animations.stop();
				this.body.velocity.y = -400;	
				this.jumpSound.play();
			}
			
			if(!this.body.blocked.down && !this.body.touching.down)
			{
				this.animations.play('jump');
			}
			//hit 
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.gpad.justPressed(Phaser.Gamepad.XBOX360_X))
			{
				if(this.body.blocked.down || this.body.touching.down){
					this.body.velocity.x = 0;
					this.animations.play('hit');
					this.hitSound.play();
				} else {
					this.animations.play('plunge');
					// this.animations.play('hit');	
					this.hitSound.play();				
				}
			}
			//block
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) || this.gpad.justPressed(Phaser.Gamepad.XBOX360_B))
			{
				if(this.body.blocked.down || this.body.touching.down){
					this.body.velocity.x = 0;
				}
				this.animations.play('block');
			}
			//check for damage or death
			if(this.health <= 0)
			{
				this.die();
				LevelOne.UIM.noHealth();
			}
			if(this.health <= 100 && this.health >= 81) {
				LevelOne.UIM.hitOnce();
			}
			if(this.health <= 80 && this.health >= 41) {
				LevelOne.UIM.hitTwice();
			}
			if(this.health == 120) {
				LevelOne.UIM.fullHealth();
			}

		}

	}
	
	die() {
		this.body.enable = false;
		// this.visible = true;
		this.alive = false;
		this.animations.play('die');
		
		this.fader = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'fader');
        this.game.camera.target = null;

		this.fader.alpha = 0;
		this.game.world.bringToTop(this.fader);
		
		LevelOne.music.fadeOut(500);
		
		var tween1 = this.game.add.tween(this.fader).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
		tween1.onComplete.add(function(){
			this.game.state.start('levelone');
			this.game.add.tween(this.fader).to({ alpha: 0}, 3000, Phaser.Easing.Linear.None, true);
		}, this);
	
	}
	
}