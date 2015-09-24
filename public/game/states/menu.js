
'use strict';

var text;

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    this.background = this.game.add.sprite(-100, -500, 'menuBackground')



    // var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5, 'YOLO', {font: '42px Arial', fill: '#fff', align: 'center'});
    // text.anchor.set(0.5);

    // this.ground = this.game.add.tileSprite(240, 500, 335, 112, 'groundOld');
    this.ground = this.game.add.tileSprite(0, 450, 800, 200, 'menuGround');

    this.player = this.game.add.sprite(170, 260, 'player1');
    this.player.animations.add('run',[60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 60, true);
    this.player.animations.play('run', 60, true);

    this.player = this.game.add.sprite(70, 260, 'player2');
    this.player.animations.add('run',[60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 60, true);
    this.player.animations.play('run', 60, true);

    this.player = this.game.add.sprite(450, 260, 'player3');
    this.player.animations.add('run',[60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 60, true);
    this.player.animations.play('run', 60, true);

    this.player = this.game.add.sprite(550, 260, 'player4');
    this.player.animations.add('run',[60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 60, true);
    this.player.animations.play('run', 60, true);

    this.missile = this.game.add.sprite(-110, 25, 'missile');
    this.missile.scale.setTo(0.95, 0.95);
    this.missile.animations.add('display', [0, 1, 2, 3], 60, true);
    this.missile.animations.play('display', 20, true);

    // this.explosion = this.game.add.sprite(0, 200, 'groundexp')


    this.ground.autoScroll(-1000, 0);


    this.titleGroup = this.game.add.group();
    this.titleGroup.add(this.missile);

    // this.player = this.game.add.sprite(-40, 90, 'player');
    // this.titleGroup.add(this.player);
    // this.player.animations.add('run');
    // this.player.animations.play('run', 32, true);


    this.titleGroup.x = 0;
    this.titleGroup.y = 0;

    //Oscillate
    this.game.add.tween(this.titleGroup).to({y:50}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    // add our start button with a callback
    //this.game.add.button(x, y, key, callback, callbackContext);
    //Every function in Phaser that has a cb also has a cb context parameter. If you fail to pass in the context parameter, Phaser will assume a null context. Generally, you will want to make your cb context `this`, as we want our cb to operate inside of a context that we can access all of our game objects from.
    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);

    this.title = this.game.add.sprite(35, 60, 'titleText');
    // this.title.alpha = 0.5;

    // this.titleGroup.add(this.startButton);

    this.startButton.anchor.setTo(0.5, 0.5);


  },
  startClick: function() {
    this.game.socketFunctions = require('../clientSockets/sockets.js');
    this.game.socketFunctions.startClick(this);  //TODO false == this
    this.game.state.start('play');
  },
  update: function() {
    // if(this.game.input.activePointer.justPressed()) {
      // this.game.state.start('play');
    // }
  }
};

module.exports = Menu;
