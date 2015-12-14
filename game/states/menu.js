
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {    
    //Imagen intro de juego
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'intro');
    this.sprite.anchor.setTo(0.5, 0.5);
    //Audio de fondo de juego en loop
    this.bgMusic = this.game.add.audio('menuBgMusic',0.1,true);
    this.bgMusic.play();
    this.btnSound = this.game.add.audio('btnMenuSound');
  },

  restartGame: function() {
    this.bgMusic.stop();
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.btnSound.play();
      this.game.state.start('play');//Inicio de juego al recibir clic
    }
  }
};

module.exports = Menu;
