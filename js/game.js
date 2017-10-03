var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Boss = (function (_super) {
    __extends(Boss, _super);
    function Boss() {
        _super.call(this);
        this.timeElapsedLeft = false;
        this.timeElapsedRight = false;
        this.rhealth = 10;
        this.lhealth = 10;
        this.canDie = true;
    }
    Boss.prototype.init = function (score) {
        this.score = score;
    };

    Boss.prototype.preload = function () {
        this.load.image('claw_left', '../images/dragon/dragon_claw_left.png');
        this.load.image('claw_right', '../images/dragon/dragon_claw_right.png');
        this.load.image('dragon', '../images/dragon/dragon_head.png');
        this.load.tilemap('bossMap', '../images/tilemaps/boss_level.json', null, Phaser.Tilemap.TILED_JSON);
    };

    Boss.prototype.create = function () {
        this.bossMusic = this.game.add.audio('bossMusic');
        this.bossMusic.play();

        this.bossMap = this.game.add.tilemap('bossMap');
        this.bossMap.addTilesetImage('texture_sheet_example', 'tiles');
        this.bossBackgroundLayer = this.bossMap.createLayer('background');
        this.bossPlatformLayer = this.bossMap.createLayer('platforms');

        this.bossPlatformLayer.resizeWorld();
        this.bossBackgroundLayer.resizeWorld();

        this.bossMap.setCollisionBetween(1, 100000, true, 'platforms');

        this.dragon = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'dragon');
        this.dragon.anchor.setTo(.5, .5);
        this.dleft = this.game.add.sprite(500, this.game.height - 180, 'claw_left');
        this.dragon.anchor.setTo(.5, .5);
        this.dright = this.game.add.sprite(50, this.game.height - 180, 'claw_right');
        this.dragon.anchor.setTo(.5, .5);

        this.game.physics.enable(this.dleft);
        this.game.physics.enable(this.dright);
        this.dright.body.immovable = true;
        this.dleft.body.immovable = true;
        this.dright.body.setSize(256, 100, 0, 64);
        this.dleft.body.setSize(256, 100, 0, 64);

        this.dragon.alpha = 0;
        this.dright.alpha = 0;
        this.dleft.alpha = 0;

        this.player = new Player(this.game, this.game.width / 2, this.game.height - 128, 'player');

        var dtween = this.add.tween(this.dragon).to({ alpha: 1 }, 3000, Phaser.Easing.Linear.None, true);
        var dtween2 = this.add.tween(this.dright).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        var dtween3 = this.add.tween(this.dleft).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        this.ui = new UiManager(this.game);

        this.ui.updateScore(this.score);

        var time1 = this.game.time.events.add(Phaser.Timer.SECOND * 3, function () {
            this.timeElapsedLeft = true;
        }, this);
        var time2 = this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
            this.timeElapsedRight = true;
        }, this);
    };

    Boss.prototype.update = function () {
        this.game.physics.arcade.collide(this.player, this.bossPlatformLayer);
        this.game.physics.arcade.collide(this.player, this.dleft, this.hitl, null, this);
        this.game.physics.arcade.collide(this.player, this.dright, this.hitr, null, this);

        if (this.timeElapsedRight) {
            if (this.dright.body.y >= 524) {
                this.dright.body.velocity.y = -300;
            }
            if (this.dright.body.y <= 400) {
                this.dright.body.velocity.y = 400;
            }
        }
        if (this.timeElapsedLeft) {
            if (this.dleft.body.y >= 524) {
                this.dleft.body.velocity.y = -300;
            }
            if (this.dleft.body.y <= 400) {
                this.dleft.body.velocity.y = 400;
            }
        }

        if ((this.rhealth <= 0 && this.lhealth <= 0) && this.canDie) {
            this.canDie = false;
            this.dragonDead();
        }
        if (this.player.body.touching.up) {
            this.bossMusic.fadeOut(500);
            this.player.die();
            this.bossMusic.destroy();
            this.game.cache.removeSound('bossMusic');
        }
    };

    Boss.prototype.dragonDead = function () {
        if (this.dragon.exists) {
            this.dragon.kill();
        }
        this.fader = this.game.add.sprite(0, 0, 'fader');
        this.fader.alpha = 0;
        var dtween2 = this.add.tween(this.fader).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        dtween2.onComplete.add(function () {
            this.game.state.start('credits');
        }, this);
        this.bossMusic.fadeOut(1000);
        this.bossMusic.destroy();
        this.game.cache.removeSound('bossMusic');
    };

    Boss.prototype.hitl = function () {
        switch (Player.inst.animations.currentAnim.name) {
            case 'plunge':
                this.lhealth -= 1;
                if (this.lhealth <= 0) {
                    this.dleft.body.enable = false;
                    this.dleft.kill();
                    this.ui.updateScore();
                }
                break;
        }
    };

    Boss.prototype.hitr = function () {
        switch (Player.inst.animations.currentAnim.name) {
            case 'plunge':
                this.rhealth -= 1;
                if (this.rhealth <= 0) {
                    this.dright.body.enable = false;
                    this.ui.updateScore(200);
                    this.dright.kill();
                }
                break;
        }
    };
    return Boss;
})(Phaser.State);
var Credits = (function (_super) {
    __extends(Credits, _super);
    function Credits() {
        _super.call(this);
    }
    Credits.prototype.preload = function () {
        this.load.image('bg', '../images/credits/credit_background.png');
        this.load.image('go', '../images/credits/game_over.png');
        this.load.image('p1', '../images/credits/people1.png');
        this.load.image('p2', '../images/credits/people2.png');
        this.load.image('tu', '../images/credits/thank_you.png');
        this.load.image('tt', '../images/credits/the_team.png');
    };

    Credits.prototype.create = function () {
        this.bg = this.game.add.sprite(16, 16, 'bg');

        this.tt = this.game.add.sprite(this.game.width / 2, 140, 'tt');
        this.tt.anchor.setTo(.5);
        this.tt.alpha = 0;

        this.go = this.game.add.sprite(this.game.width / 2, 64, 'go');
        this.go.anchor.setTo(.5);

        this.p1 = this.game.add.sprite(this.game.width / 2, 300, 'p1');
        this.p1.anchor.setTo(.5);
        this.p1.alpha = 0;

        this.p2 = this.game.add.sprite(this.game.width / 2, 300, 'p2');
        this.p2.anchor.setTo(.5);
        this.p2.alpha = 0;

        this.tu = this.game.add.sprite(this.game.width / 2, 300, 'tu');
        this.tu.anchor.setTo(.5);
        this.tu.alpha = 0;

        var tween1 = this.add.tween(this.p1).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        var tweenTt = this.add.tween(this.tt).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);

        tween1.onComplete.add(function () {
            this.p1.destroy();
            var tween2 = this.add.tween(this.p2).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
            tween2.onComplete.add(function () {
                this.p2.destroy();
                var tween3 = this.add.tween(this.tu).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
            }, this);
        }, this);
    };
    return Credits;
})(Phaser.State);
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(game, x, y, key, speed, enemyType) {
        _super.call(this, game, x, y, key);
        this.dir = -1;
        this.enemyType = enemyType || 'normal';
        this.health = 10;
        this.game.physics.arcade.enable(this);
        this.body.gravity.y = 1000;
        this.enemySpeed = speed || 70;
        this.anchor.setTo(.5, .5);
        this.body.collideWorldBounds = true;
        this.body.setSize(50, 50, 0, 10);
        if (this.enemyType != 'plungable') {
            this.body.checkCollision.up = false;
            this.health = 1;
        }
        this.game.add.existing(this);
        this.animations.add('walk', ['enemy_walk1.png', 'enemy_walk2.png', 'enemy_walk2.png', 'enemy_walk4.png'], 8, true);
        this.animations.add('attack', ['enemy_attack_1.png', 'enemy_attack_2.png'], 8, true);
        this.animations.add('die', ['enemy_death_1.png', 'enemy_death_2.png'], 8, false);
        this.playIdleAnims();
    }
    Enemy.prototype.playIdleAnims = function () {
        this.animations.play('walk');
    };

    Enemy.prototype.update = function () {
        if (this.alive) {
            this.checkDistanceAndAttack(this.game.physics.arcade.distanceBetween(Player.inst, this));
            this.body.velocity.x = this.enemySpeed * this.dir;
            if (this.body.x < Player.inst.x - 64 && !this.flipped) {
                this.flipped = true;
                this.dir *= -1;
                this.scale.x *= -1;
            } else {
                if (this.body.x > Player.inst.x && this.flipped) {
                    this.flipped = false;
                    this.dir *= -1;
                    this.scale.x *= -1;
                }
            }

            this.game.physics.arcade.collide(this, Player.inst, this.hit, null, this);
        } else {
            this.body.velocity.x = 0;
        }
    };

    Enemy.prototype.checkDistanceAndAttack = function (distance) {
        if (this.alive) {
            if (distance < 70) {
                this.animations.play('attack');
            } else {
                this.animations.play('walk');
                this.body.bounce.x = 0;
            }
        }
    };

    Enemy.prototype.hit = function () {
        switch (Player.inst.animations.currentAnim.name) {
            case 'block':
                this.body.bounce.x = 30;
                break;
            case 'hit':
            case 'plunge':
                this.health -= 1;
                if (this.health <= 0) {
                    this.alive = false;
                    this.body.enable = false;
                    this.animations.play('die');
                    LevelOne.UIM.updateScore(20);
                }
                break;
            default:
                this.body.bounce.x = 0;

                Player.inst.health -= 1;
        }
    };
    return Enemy;
})(Phaser.Sprite);
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        _super.call(this);
    }
    Menu.prototype.create = function () {
        this.claw = this.game.add.sprite(this.game.width / 2, 1, 'claw');
        this.claw.anchor.setTo(.5, 0);
        this.title = this.game.add.sprite(this.game.width / 2, 230, 'title');
        this.title.anchor.setTo(.5, .5);
        this.start = this.game.add.sprite(this.game.width / 2, 500, 'start');
        this.start.anchor.setTo(.5, .5);

        this.claw.alpha = 0;
        this.start.alpha = 0;
        this.title.alpha = 0;

        this.fadeIn();
        this.pulse();

        this.start.inputEnabled = true;
        this.title.inputEnabled = true;
        this.start.events.onInputDown.add(function () {
            this.fadeOut();
        }, this);
        this.title.events.onInputDown.add(function () {
            this.fadeOut();
        }, this);

        this.gpad = this.game.input.gamepad.pad1;
        this.menuMusic = this.game.add.audio('menuMusic');
        this.menuMusic.play();
    };

    Menu.prototype.update = function () {
        if (this.gpad.justPressed(Phaser.Gamepad.XBOX360_A)) {
            this.fadeOut();
        }
    };

    Menu.prototype.pulse = function () {
        this.game.time.events.loop(500, this.updateCounter, this);
    };

    Menu.prototype.updateCounter = function () {
        if (this.start.exists) {
            this.start.kill();
        } else {
            this.start.revive();
        }
    };

    Menu.prototype.fadeIn = function () {
        var tween1 = this.add.tween(this.claw).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        tween1.onComplete.add(function () {
            var tween2 = this.add.tween(this.title).to({ alpha: 1 }, 4000, Phaser.Easing.Linear.None, true);
        }, this);
        var tween3 = this.add.tween(this.start).to({ alpha: 1 }, 3000, Phaser.Easing.Linear.None, true);
    };

    Menu.prototype.fadeOut = function () {
        this.add.tween(this.title).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.start).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        var tween = this.add.tween(this.claw).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startGame, this);
        this.menuMusic.fadeOut(500);
    };

    Menu.prototype.startGame = function () {
        this.menuMusic.destroy();
        this.game.cache.removeSound('menuMusic');
        this.game.state.start('levelone');
    };
    return Menu;
})(Phaser.State);
var LevelOne = (function (_super) {
    __extends(LevelOne, _super);
    function LevelOne() {
        _super.call(this);
        this.flipped = false;
    }
    LevelOne.prototype.create = function () {
        LevelOne.music = this.game.add.audio('gameMusic');
        LevelOne.music.play();
        this.game.stage.backgroundColor = '#ffbd55';
        this.keyCollected = false;

        this.bg = this.game.add.tileSprite(0, 100, 2496, 800, 'londo_bg');
        this.clouds = this.game.add.tileSprite(0, 100, 2496, 800, 'londo_clouds');
        this.mid = this.game.add.tileSprite(0, 100, 2496, 800, 'londo_mid');
        this.fore = this.game.add.tileSprite(0, 100, 2496, 800, 'londo_fore');

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiled_sheet', 'tiles');
        this.bgLayer = this.map.createLayer('background');
        this.platformLayer = this.map.createLayer('platforms');

        this.platformLayer.resizeWorld();
        this.bgLayer.resizeWorld();

        this.map.setCollisionBetween(1, 100000, true, 'platforms');

        this.torches = this.game.add.group();
        this.torch = this.torches.create(500, 1080, 'torch');
        this.torch = this.torches.create(1030, 1080, 'torch');
        this.torch = this.torches.create(2134, 800, 'torch');
        this.torch = this.torches.create(1960, 1632, 'torch');

        this.torches.callAll('animations.add', 'animations', 'torch', ['torch_1.png', 'torch_2.png', 'torch_3.png'], 6, true);

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

        this.player = new Player(this.game, 256, 1152, 'player');

        this.game.camera.follow(this.player);

        this.sunbeam = this.game.add.sprite(133, 1038, 'sunbeam');
        this.game.physics.arcade.enable(this.sunbeam);

        this.foreLayer = this.map.createLayer('foreground');

        this.bossDoor = this.game.add.sprite(1180, 1022, 'bossDoor');
        this.game.physics.arcade.enable(this.bossDoor);
        this.bossDoor.body.immovable = true;

        this.key = this.game.add.sprite(1150, 320, 'key');
        this.game.physics.arcade.enable(this.key);

        var ui = new UiManager(this.game);
        LevelOne.UIM = ui;
    };

    LevelOne.prototype.update = function () {
        this.bg.tilePosition.x = (this.camera.x * 0.7);
        this.clouds.tilePosition.x = (this.camera.x * 0.9);
        this.mid.tilePosition.x = (this.camera.x * .6);
        this.fore.tilePosition.x = (this.camera.x * 0.4);

        this.torches.callAll('play', null, 'torch');

        this.game.physics.arcade.collide(this.player, this.platformLayer);
        this.game.physics.arcade.collide(this.enemies, this.platformLayer);
        this.game.physics.arcade.overlap(this.sunbeam, this.player, this.healingSunlight);
        this.game.physics.arcade.collide(this.bossDoor, this.player, this.hasKey, null, this);
        this.game.physics.arcade.overlap(this.key, this.player, this.keyCollect, null, this);

        this.checkPlayer(Player.inst.y);
    };

    LevelOne.prototype.checkPlayer = function (ypos) {
        if (ypos < 832 - 192) {
            this.game.camera.target = null;

            this.game.camera.focusOnXY(Player.inst.x, ypos - 150);
        } else {
            this.game.camera.follow(this.player);
        }
    };

    LevelOne.prototype.healingSunlight = function () {
        Player.inst.health = 120;
    };

    LevelOne.prototype.keyCollect = function () {
        LevelOne.UIM.addKey();
        this.keyCollected = true;
        this.key.kill();
    };

    LevelOne.prototype.hasKey = function () {
        if (this.keyCollected) {
            this.bossDoor.kill();
            var bt = this.game.time.events.add(6000, this.bossTrigger, this);
        }
    };

    LevelOne.prototype.bossTrigger = function () {
        Player.inst.die();
        this.fader = this.game.add.sprite(this.camera.x, this.camera.y, 'fader');
        this.game.camera.target = null;

        this.fader.alpha = 0;
        this.game.world.bringToTop(this.fader);

        var tween1 = this.add.tween(this.fader).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        tween1.onComplete.add(this.loadBoss, this);
        LevelOne.music.fadeOut(2000);
    };
    LevelOne.prototype.loadBoss = function () {
        LevelOne.music.destroy();
        this.game.cache.removeSound('music');
        var score = LevelOne.UIM.getScore();
        this.game.state.start('boss', true, false, score);
    };
    return LevelOne;
})(Phaser.State);
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(game, x, y, key) {
        _super.call(this, game, x, y, key);
        this.game.physics.arcade.enable(this);
        this.anchor.setTo(.5, .5);

        this.health = 10;

        this.body.gravity.y = 1000;
        this.body.collideWorldBounds = true;
        this.body.setSize(32, 32, 0, 16);

        this.game.add.existing(this);
        this.animations.add('idle', ['idle_anim_1.png', 'idle_anim_2.png'], 4, true);
        this.animations.add('run', ['run_anim_1.png', 'run_anim_2.png', 'run_anim_3.png', 'run_anim_4.png'], 12, true);
        this.animations.add('jump', ['jump_anim.png'], 1, true);
        this.animations.add('hit', ['attack.png'], 1, true);
        this.animations.add('block', ['block.png'], 1, true);
        this.animations.add('plunge', ['plunge_attack.png'], 1, true);
        this.animations.add('die', ['death_1.png', 'death_2.png'], 1, true);

        Player.inst = this;
        this.gpad = this.game.input.gamepad.pad1;

        this.hitSound = this.game.add.audio('hit');
        this.jumpSound = this.game.add.audio('jump');
    }
    Player.prototype.update = function () {
        if (this.alive) {
            this.body.velocity.x = 0;
            this.rotation = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.gpad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.gpad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
                this.body.velocity.x = -150;
                if (!this.flipped) {
                    this.scale.x *= -1;
                    this.flipped = true;
                }
                this.animations.play('run');
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.gpad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.gpad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) {
                if (this.flipped) {
                    this.scale.x *= -1;
                    this.flipped = false;
                }
                this.body.velocity.x = 150;
                this.animations.play('run');
            } else {
                this.animations.play('idle');
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && (this.body.blocked.down || this.body.touching.down) && this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR)) {
                this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
                this.animations.stop();
                this.body.velocity.y = -400;
                this.jumpSound.play();
            }

            if (this.gpad.justPressed(Phaser.Gamepad.XBOX360_A) && (this.body.blocked.down || this.body.touching.down)) {
                this.animations.stop();
                this.body.velocity.y = -400;
                this.jumpSound.play();
            }

            if (!this.body.blocked.down && !this.body.touching.down) {
                this.animations.play('jump');
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.gpad.justPressed(Phaser.Gamepad.XBOX360_X)) {
                if (this.body.blocked.down || this.body.touching.down) {
                    this.body.velocity.x = 0;
                    this.animations.play('hit');
                    this.hitSound.play();
                } else {
                    this.animations.play('plunge');

                    this.hitSound.play();
                }
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) || this.gpad.justPressed(Phaser.Gamepad.XBOX360_B)) {
                if (this.body.blocked.down || this.body.touching.down) {
                    this.body.velocity.x = 0;
                }
                this.animations.play('block');
            }

            if (this.health <= 0) {
                this.die();
                LevelOne.UIM.noHealth();
            }
            if (this.health <= 100 && this.health >= 81) {
                LevelOne.UIM.hitOnce();
            }
            if (this.health <= 80 && this.health >= 41) {
                LevelOne.UIM.hitTwice();
            }
            if (this.health == 120) {
                LevelOne.UIM.fullHealth();
            }
        }
    };

    Player.prototype.die = function () {
        this.body.enable = false;

        this.alive = false;
        this.animations.play('die');

        this.fader = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'fader');
        this.game.camera.target = null;

        this.fader.alpha = 0;
        this.game.world.bringToTop(this.fader);

        LevelOne.music.fadeOut(500);

        var tween1 = this.game.add.tween(this.fader).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        tween1.onComplete.add(function () {
            this.game.state.start('levelone');
            this.game.add.tween(this.fader).to({ alpha: 0 }, 3000, Phaser.Easing.Linear.None, true);
        }, this);
    };
    return Player;
})(Phaser.Sprite);
var UiManager = (function () {
    function UiManager(game) {
        this.game = game;
        this.createUI();
    }
    UiManager.prototype.createUI = function () {
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
            fill: '#FFF'
        });
        this.scoreText.fontSize = 24;
        this.scoreText.font = 'Press Start 2P';
        this.uiContainer.addChild(this.scoreText);

        this.keySprite = this.game.add.sprite(200, 18, 'gui_key');
        this.keySprite.kill();
        this.uiContainer.addChild(this.keySprite);

        this.uiContainer.fixedToCamera = true;
    };

    UiManager.prototype.updateScore = function (points) {
        var current = parseInt(this.scoreText.text, 10);
        points += current;
        this.scoreText.setText(points.toString());
    };

    UiManager.prototype.getScore = function () {
        return parseInt(this.scoreText.text, 10);
    };

    UiManager.prototype.fullHealth = function () {
        this.heartSpriteEmpty.kill();
        this.heartSpriteOne.kill();
        this.heartSpriteTwo.kill();
        this.heartSpriteFull.revive();
    };

    UiManager.prototype.noHealth = function () {
        this.heartSpriteEmpty.revive();
        this.heartSpriteOne.kill();
        this.heartSpriteTwo.kill();
        this.heartSpriteFull.kill();
    };

    UiManager.prototype.hitOnce = function () {
        this.heartSpriteEmpty.kill();
        this.heartSpriteOne.kill();
        this.heartSpriteTwo.revive();
        this.heartSpriteFull.kill();
    };

    UiManager.prototype.hitTwice = function () {
        this.heartSpriteEmpty.kill();
        this.heartSpriteOne.revive();
        this.heartSpriteTwo.kill();
        this.heartSpriteFull.kill();
    };

    UiManager.prototype.addKey = function () {
        this.keySprite.revive();
    };
    return UiManager;
})();

WebFontConfig = {
    google: { families: ['Press+Start+2P'] }
};

var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this, 832, 640, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });

        this.state.add('menu', Menu);
        this.state.add('levelone', LevelOne);
        this.state.add('boss', Boss);
        this.state.add('credits', Credits);
    }
    Game.prototype.preload = function () {
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

        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');

        this.load.atlasJSONHash('torch', '../images/level/torch_anim.png', '../js/torch_anim.json');
        this.load.atlasJSONHash('player', '../images/player/play_anim2.png', '../js/player_anim2.json');
        this.load.atlasJSONHash('enemy', '../images/level/enemy_anim.png', '../js/enemy_anim.json');
        this.load.tilemap('map', '../images/tilemaps/sprite_sheet.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', '../images/tilemaps/texture_sheet_example.png');

        this.load.audio('hit', '../sounds/hit.mp3');
        this.load.audio('jump', '../sounds/jump.mp3');

        this.load.audio('menuMusic', '../sounds/DigitalNative.mp3');
        this.load.audio('gameMusic', '../sounds/ComeandFindMeB.mp3');
        this.load.audio('bossMusic', '../sounds/JumpShot.mp3');
    };

    Game.prototype.create = function () {
        this.stage.smoothed = false;
        this.input.gamepad.start();
        this.state.start('menu');
    };
    return Game;
})(Phaser.Game);

window.onload = function () {
    new Game();
};
