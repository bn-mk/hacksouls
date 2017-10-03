class LevelOne extends Phaser.State {
	
    static UIM: UiManager;
	platforms: Phaser.Group;
    ground: Phaser.Sprite;
    ledge: Phaser.Sprite;
    player: Phaser.Sprite;
    cursors: any;
    souls: Number;
    soulsText: String;
    flipped: Boolean;
    torches: Phaser.Group;
    torch: Phaser.Sprite;
    enemy: Enemy;
    enemies: Phaser.Group;
    enemySpeed: Number;
    map: Phaser.Tilemap;
    bgLayer: any;
    platformLayer: any;
    foreLayer: any;
    bg: Phaser.TileSprite;
    clouds: Phaser.TileSprite;
    mid: Phaser.TileSprite;
    fore: Phaser.TileSprite;
    sunbeam: Phaser.Sprite;
    bossDoor: Phaser.Sprite;
    key: Phaser.Sprite;
    keyCollected: boolean;
    fader: Phaser.Sprite;
    static music;
	
	constructor() {
		super();
		this.flipped = false;
        // if(this.fader.exists) this.fader.kill();
	}
    
  
	 create() {
        LevelOne.music = this.game.add.audio('gameMusic');
        LevelOne.music.play();
        this.game.stage.backgroundColor = '#ffbd55';
        this.keyCollected = false;

        //level
        this.bg = this.game.add.tileSprite(0, 100, 2496, 800, 'londo_bg');
        this.clouds = this.game.add.tileSprite(0, 100, 2496, 800, 'londo_clouds');
        this.mid = this.game.add.tileSprite(0, 100, 2496, 800, 'londo_mid');
        this.fore = this.game.add.tileSprite(0, 100, 2496, 800, 'londo_fore');
        
        //map
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiled_sheet', 'tiles');
        this.bgLayer = this.map.createLayer('background');
        this.platformLayer = this.map.createLayer('platforms');

        this.platformLayer.resizeWorld();
        this.bgLayer.resizeWorld();
        
        //map collisions
        this.map.setCollisionBetween(1, 100000, true, 'platforms');
        
        //get tile index from layer data in json
        // this.map.setCollision(4, , 'Death');
        // this.map.setTileIndexCallback(4, this.spikeDeath, this, 'Death');


        //torches
        //we could add these to the tilemap with a 'type' property and replace them with the sprite group
        //to save placing them numerically
        this.torches = this.game.add.group();
        this.torch = this.torches.create(500, 1080, 'torch');
        this.torch = this.torches.create(1030, 1080, 'torch');
        this.torch = this.torches.create(2134, 800, 'torch');
        this.torch = this.torches.create(1960, 1632, 'torch');
        // this.torch = this.torches.create(650, 300, 'torch');
        this.torches.callAll('animations.add', 'animations', 'torch', ['torch_1.png', 'torch_2.png', 'torch_3.png'], 6, true);
        
        //enemies
        this.enemies = this.game.add.group();
        this.enemy = new Enemy(this.game, 813, 1376, 'enemy');
        this.enemies.add(this.enemy);
        this.enemy = new Enemy(this.game, 433, 1376, 'enemy', 120);
        this.enemies.add(this.enemy);
        this.enemy = new Enemy(this.game, 90, 1760, 'enemy', 5, 'plungable');
        this.enemies.add(this.enemy);
        this.enemy = new Enemy(this.game, 1278, 1504, 'enemy');
        this.enemies.add(this.enemy);
        this.enemy = new Enemy(this.game, 1440, 1824, 'enemy', 120, 'plungable');
        this.enemies.add(this.enemy);
        this.enemy = new Enemy(this.game, 2034, 1248, 'enemy');
        this.enemies.add(this.enemy);
        this.enemy = new Enemy(this.game, 2372, 736, 'enemy');
        this.enemies.add(this.enemy);
       
        //player
        this.player = new Player(this.game, 256, 1152, 'player');
        // this.player = new Player(this.game, 1265, 352, 'player');
        this.game.camera.follow(this.player); 
        
        this.sunbeam = this.game.add.sprite(133, 1038, 'sunbeam');
        this.game.physics.arcade.enable(this.sunbeam);
        
        this.foreLayer = this.map.createLayer('foreground');
        
        this.bossDoor = this.game.add.sprite(1180, 1022, 'bossDoor');
        this.game.physics.arcade.enable(this.bossDoor);
        this.bossDoor.body.immovable = true;
        
        this.key = this.game.add.sprite(1150, 320, 'key');
        this.game.physics.arcade.enable(this.key);
        
        //ui
        var ui = new UiManager(this.game);
        LevelOne.UIM = ui;
    }
    
    update() {

        // console.log('wx',this.game.input.mousePointer.worldX);
        // console.log('wy',this.game.input.mousePointer.worldY);
        
        this.bg.tilePosition.x = (this.camera.x * 0.7);
        this.clouds.tilePosition.x = (this.camera.x * 0.9);
        this.mid.tilePosition.x = (this.camera.x * .6);
        this.fore.tilePosition.x = (this.camera.x * 0.4);
        // torch animations
        this.torches.callAll('play', null, 'torch');
        
        //platform collisions
        this.game.physics.arcade.collide(this.player, this.platformLayer);
        this.game.physics.arcade.collide(this.enemies, this.platformLayer);
        this.game.physics.arcade.overlap(this.sunbeam, this.player, this.healingSunlight);
        this.game.physics.arcade.collide(this.bossDoor, this.player, this.hasKey, null, this);
        this.game.physics.arcade.overlap(this.key, this.player, this.keyCollect, null, this);
        
        //check player pos
        this.checkPlayer(Player.inst.y);      
        
        //check boss trigger
        
        // this.bossTrigger(Player.inst.x, Player.inst.y);
    }
    
    checkPlayer(ypos){
        if(ypos < 832-192) {
            this.game.camera.target = null;
            // this.game.camera.setPosition(Player.inst.x, ypos - 100);
            this.game.camera.focusOnXY(Player.inst.x, ypos - 150);
            // this.healingSunlight();
        } else {
            this.game.camera.follow(this.player); 
        }
    }
    
    healingSunlight(){
        Player.inst.health = 120; 
    }
    
    keyCollect() {
        LevelOne.UIM.addKey();
        this.keyCollected = true;
        this.key.kill();
    }
    
    hasKey() {
        if(this.keyCollected) {
            this.bossDoor.kill();
            var bt = this.game.time.events.add(6000, this.bossTrigger, this);
        }
    }
    
    bossTrigger() {
        // if((x == 1680 && y == 1184)) {
            Player.inst.die();
            this.fader = this.game.add.sprite(this.camera.x, this.camera.y, 'fader');
            this.game.camera.target = null;

            this.fader.alpha = 0;
            this.game.world.bringToTop(this.fader);
            
            var tween1 = this.add.tween(this.fader).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
            tween1.onComplete.add(this.loadBoss, this);
            LevelOne.music.fadeOut(2000);
        // }
    }
    loadBoss(){
        LevelOne.music.destroy();
        this.game.cache.removeSound('music');
        var score =  LevelOne.UIM.getScore();
        this.game.state.start('boss', true, false, score);
    }
       
    // spikeDeath() {
    //     Player.inst.die();
    // }
    // render(){
    //     this.game.debug.bodyInfo(this.player, 64, 64);
    // }
    
}