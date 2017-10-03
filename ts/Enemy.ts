class Enemy extends Phaser.Sprite {
	
	game: Phaser.Game;
	x: number;
	y: number;
	key: any;
	dir: number;
	enemySpeed: number;
	flipped: boolean;
	health: number;
	speed: number;
	enemyType: string;
	
	constructor(game: Phaser.Game, x: number, y: number, key: any, speed?: number, enemyType?: string) {

		super(game, x, y, key);
		this.dir = -1;
		this.enemyType = enemyType || 'normal';
		this.health = 10;
		this.game.physics.arcade.enable(this);
		this.body.gravity.y = 1000;
		this.enemySpeed = speed || 70;
		this.anchor.setTo(.5, .5);
		this.body.collideWorldBounds = true;
		this.body.setSize(50, 50, 0, 10);
		if(this.enemyType != 'plungable'){
			this.body.checkCollision.up = false;
			this.health = 1;
		}
		this.game.add.existing(this);
		this.animations.add('walk', ['enemy_walk1.png', 'enemy_walk2.png', 'enemy_walk2.png', 'enemy_walk4.png'], 8, true);
		this.animations.add('attack', ['enemy_attack_1.png', 'enemy_attack_2.png'], 8, true);
		this.animations.add('die', ['enemy_death_1.png', 'enemy_death_2.png'], 8, false);
		this.playIdleAnims();
		
	}
	
	playIdleAnims(){
		this.animations.play('walk');
	}
	
	update(){
		//follow player
		if(this.alive){
			//attck if close
			this.checkDistanceAndAttack(this.game.physics.arcade.distanceBetween(Player.inst, this));     
			this.body.velocity.x = this.enemySpeed * this.dir;
			if(this.body.x < Player.inst.x-64 && !this.flipped) {
				this.flipped = true;
				this.dir *= -1;
				this.scale.x *= -1; 
			} else {
				if(this.body.x > Player.inst.x && this.flipped) {
					this.flipped = false;
					this.dir *= -1
					this.scale.x *= -1; 	
				}
			}
			//collisions
			this.game.physics.arcade.collide(this, Player.inst, this.hit, null, this);
		} else {
			this.body.velocity.x = 0;
		}
	}
	
	checkDistanceAndAttack(distance) {
		//swap for attack animation if close to player
		if(this.alive){
			if(distance < 70) {
				this.animations.play('attack');
			} else {
				this.animations.play('walk');
				this.body.bounce.x = 0;
			}
		}
	}
	
	hit() {
		//check player animations for block or attack
		switch(Player.inst.animations.currentAnim.name) {
			case 'block'  : this.body.bounce.x = 30;
			break;
			case 'hit' : 
			case 'plunge' :
				//bounce back
				// this.body.bounce.x = 70;
				this.health -= 1;
				if(this.health <= 0){
					this.alive = false;
					this.body.enable = false;
					this.animations.play('die');
					LevelOne.UIM.updateScore(20);
					/**
					 * TODO
					 * destroy sprite if out of bounds
					 * this.destroy();
					 * or this.outOfBoundsKill = true; in constructer?
					*/
					
				}
			break;
			default : 
				this.body.bounce.x = 0;
				//damage player
				Player.inst.health -= 1;
				// this.game.time.events.repeat(250, 3, this.updateCounter, Player.inst);
		}
	}
	
	// updateCounter() {
	// 	if(this.visible){
	// 		this.body.disable;
	// 		this.visible = false;
	// 	} else {
	// 		this.visible = true;	
	// 		this.body.enable;
	// 	}
	// }
	
}

 