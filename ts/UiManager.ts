/// <reference path='../phaser/typescript/phaser.d.ts' />
class UiManager {

	game: Phaser.Game;
	uiContainer: Phaser.Graphics;
	heartSpriteFull: Phaser.Sprite;
	heartSpriteTwo: Phaser.Sprite;
	heartSpriteOne: Phaser.Sprite;
	heartSpriteEmpty: Phaser.Sprite;
	scoreSprite: Phaser.Sprite;
	scoreText: Phaser.Text;
	keySprite: Phaser.Sprite;
	
	constructor(game: Phaser.Game){
		this.game = game;
		this.createUI();
	}
	
	 createUI() {
        this.uiContainer = this.game.add.graphics(0, 0);
        this.uiContainer.beginFill(0x000000, .9);
        this.uiContainer.drawRect(0, 0, 832, 64);
        this.game.world.bringToTop(this.uiContainer);
        
        var lifeSprite = this.game.add.sprite(10, 15, 'ui_life_text');
        this.uiContainer.addChild(lifeSprite);
        
        this.heartSpriteFull = this.game.add.sprite(100, 20, 'ui_heart_full');
        this.heartSpriteTwo = this.game.add.sprite(100, 20, 'ui_heart_two');
        this.heartSpriteOne = this.game.add.sprite(100, 20, 'ui_heart_one');
        this.heartSpriteEmpty = this.game.add.sprite(100, 20, 'ui_heart_empty');
        
        //kill them - we can revive them when hit
        this.heartSpriteTwo.kill();
        this.heartSpriteOne.kill();
       	this.heartSpriteEmpty.kill();

        this.uiContainer.addChild(lifeSprite);
        this.uiContainer.addChild(this.heartSpriteFull);
        this.uiContainer.addChild(this.heartSpriteTwo);
        this.uiContainer.addChild(this.heartSpriteOne);
        this.uiContainer.addChild(this.heartSpriteEmpty);
		
		this.scoreSprite = this.game.add.sprite(280, 15, 'ui_score_text');
		this.uiContainer.addChild(this.scoreSprite);
		
		this.scoreText = this.game.add.text(370, 20, '0', {
			fill: '#FFF',
		});
		this.scoreText.fontSize = 24;
		this.scoreText.font = 'Press Start 2P';
		this.uiContainer.addChild(this.scoreText);
		
		this.keySprite = this.game.add.sprite(200, 18, 'gui_key');
		this.keySprite.kill();
		this.uiContainer.addChild(this.keySprite);
		
        this.uiContainer.fixedToCamera = true;
       
    }
	
	
	updateScore(points) {
		var current = parseInt(this.scoreText.text, 10);
		points += current;
		this.scoreText.setText(points.toString());
	}
	
	getScore() {
		return parseInt(this.scoreText.text, 10);
		// return 400;
	}
	
	fullHealth() {
		this.heartSpriteEmpty.kill();
		this.heartSpriteOne.kill();
		this.heartSpriteTwo.kill();
		this.heartSpriteFull.revive();
	}
	
	noHealth() {
		this.heartSpriteEmpty.revive();
		this.heartSpriteOne.kill();
		this.heartSpriteTwo.kill();
		this.heartSpriteFull.kill();
	}
	
	hitOnce() {
		this.heartSpriteEmpty.kill();
		this.heartSpriteOne.kill();
		this.heartSpriteTwo.revive();
		this.heartSpriteFull.kill();
	}
	
	hitTwice() {
		this.heartSpriteEmpty.kill();
		this.heartSpriteOne.revive();
		this.heartSpriteTwo.kill();
		this.heartSpriteFull.kill();
	}
	
	addKey() {
		this.keySprite.revive();
	}
}