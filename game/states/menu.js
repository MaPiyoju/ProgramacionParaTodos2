
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {    
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'intro');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.bgMusic = this.game.add.audio('menuBgMusic',0.25,true);
    this.bgMusic.play();
  },

  restartGame: function() {
    this.bgMusic.stop();
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
