class Credits extends Phaser.State {
	
	bg: Phaser.Sprite;
	go: Phaser.Sprite;
	p1: Phaser.Sprite;
	p2: Phaser.Sprite;
	tu: Phaser.Sprite;
	tt: Phaser.Sprite;
	
	constructor(){
		super();
	}
	
	preload() {
		 this.load.image('bg', '../images/credits/credit_background.png');
		 this.load.image('go', '../images/credits/game_over.png');
		 this.load.image('p1', '../images/credits/people1.png');
		 this.load.image('p2', '../images/credits/people2.png');
		 this.load.image('tu', '../images/credits/thank_you.png');
		 this.load.image('tt', '../images/credits/the_team.png');
		
	}
	
	create() {
		this.bg = this.game.add.sprite(16, 16, 'bg');		
		
		this.tt = this.game.add.sprite(this.game.width/2, 140, 'tt');	
		this.tt.anchor.setTo(.5);
		this.tt.alpha = 0;
		
		this.go = this.game.add.sprite(this.game.width/2, 64, 'go');	
		this.go.anchor.setTo(.5);	
		
		this.p1 = this.game.add.sprite(this.game.width/2, 300, 'p1');	
		this.p1.anchor.setTo(.5);
		this.p1.alpha = 0;
		
		this.p2 = this.game.add.sprite(this.game.width/2, 300, 'p2');	
		this.p2.anchor.setTo(.5);
		this.p2.alpha = 0;
			
		this.tu = this.game.add.sprite(this.game.width/2, 300, 'tu');	
		this.tu.anchor.setTo(.5);
		this.tu.alpha = 0;
		

		
		var tween1 = this.add.tween(this.p1).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
		var tweenTt = this.add.tween(this.tt).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
		
		tween1.onComplete.add(function(){
			this.p1.destroy();
			var tween2 = this.add.tween(this.p2).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
			tween2.onComplete.add(function(){
				this.p2.destroy();
				var tween3 = this.add.tween(this.tu).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
			}, this);
		}, this);
		
	

	}
	
}