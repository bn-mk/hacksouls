/// <reference path='../phaser/typescript/phaser.d.ts' />
/// <reference path='Menu.ts' />
/// <reference path='Boss.ts' />
/// <reference path='Credits.ts' />
/// <reference path='LevelOne.ts' />
/// <reference path='Player.ts' />
/// <reference path='Enemy.ts' />
/// <reference path='UiManager.ts' />

//for google webfonts
declare var WebFontConfig:Object;

WebFontConfig = {
     google: { families: [ 'Press+Start+2P' ] }
}

class Game extends Phaser.Game {
    
    static scoreSaver;
    
    constructor() {
        super(832, 640, Phaser.AUTO, 'content', { preload: this.preload, create: this.create});

        this.state.add('menu', Menu);
        this.state.add('levelone', LevelOne);
        this.state.add('boss', Boss);
        this.state.add('credits', Credits);
    }


    preload() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.load.image('claw', '../images/menu/title_claw.png');
        this.load.image('title', '../images/menu/hack_souls_title.png');
        this.load.image('start', '../images/menu/start_type.png');
        
        this.load.image('fader', '../images/level/black_bg.png');
        
        this.load.image('londo_bg', '../images/londo/bg.png');
        this.load.image('londo_clouds', '../images/londo/clouds.png');
        this.load.image('londo_mid', '../images/londo/midground.png');
        this.load.image('londo_fore', '../images/londo/foreground.png');
        
        this.load.image('sunbeam', '../images/level/tile_sun_beam.png');
        this.load.image('bossDoor', '../images/level/boss_door.png');
        this.load.image('key', '../images/level/key.png');

        this.load.image('ui_life_text', '../images/ui/life_type.png');
        this.load.image('ui_score_text', '../images/ui/score_type.png');        
        this.load.image('ui_boss_text', '../images/ui/boss_type.png');
        
        this.load.image('ui_heart_full', '../images/ui/full_hp.png');
        this.load.image('ui_heart_two', '../images/ui/2_third_hp.png');
        this.load.image('ui_heart_one', '../images/ui/1_third_hp.png');
        this.load.image('ui_heart_empty', '../images/ui/empty_hp.png'); 
        
        this.load.image('gui_key', '../images/ui/gui_key.png');
        
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js')

        this.load.atlasJSONHash('torch', '../images/level/torch_anim.png', '../js/torch_anim.json');
        this.load.atlasJSONHash('player', '../images/player/play_anim2.png', '../js/player_anim2.json');
        this.load.atlasJSONHash('enemy', '../images/level/enemy_anim.png', '../js/enemy_anim.json');
        this.load.tilemap('map', '../images/tilemaps/sprite_sheet.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', '../images/tilemaps/texture_sheet_example.png');
        
        this.load.audio('hit', '../sounds/hit.mp3');
        this.load.audio('jump', '../sounds/jump.mp3');
        /*
            Game music thanks to...
            http://ericskiff.com/music/
        */
        this.load.audio('menuMusic', '../sounds/DigitalNative.mp3');
        this.load.audio('gameMusic', '../sounds/ComeandFindMeB.mp3');
        this.load.audio('bossMusic', '../sounds/JumpShot.mp3');
    }

    create () {
        // this.state.start('menu');
        //render crispy pixels
        this.stage.smoothed = false;
        this.input.gamepad.start();
        this.state.start('menu');
    }
}

window.onload = () => {

   new Game();

};