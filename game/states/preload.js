
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
  this.ready2 = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');


    /*Bitmap text*/
    this.load.bitmapFont('font1', 'assets/fonts/font1/font1.png', 'assets/fonts/font1/font1.fnt');
    this.load.bitmapFont('font', 'assets/fonts/font/font.png', 'assets/fonts/font/font.fnt');

    /*Botones generales*/
    this.load.image('btnContinuar','assets/images/Botones/btnContinuar.png');
    this.load.image('alert','assets/images/Botones/alert.png');
    this.load.image('time','assets/images/Botones/time.png');

    /*Imagenes Menu e intro*/
    this.load.image('intro', 'assets/images/Menu/intro.jpg');
    this.load.spritesheet('nivel1', 'assets/images/Menu/nivel1.jpg',800,100);
    this.load.spritesheet('nivel2', 'assets/images/Menu/nivel2.jpg',800,100);
    this.load.spritesheet('nivel3', 'assets/images/Menu/nivel3.jpg',800,100);
    this.load.spritesheet('nivel4', 'assets/images/Menu/nivel4.jpg',800,100);
    this.load.spritesheet('nivel5', 'assets/images/Menu/nivel5.jpg',800,100);
    this.load.spritesheet('nivel6', 'assets/images/Menu/nivel6.jpg',800,100);
    this.load.spritesheet('ayudaGeneral', 'assets/images/Menu/ayuda.jpg',800,601);

    /*Imagenes nivel 1*/
    this.load.image('introN1', 'assets/images/Nivel1/intro.jpg');
    this.load.image('tile_nivel1', 'assets/images/Nivel1/tile.jpg');
    this.load.image('fondoSit', 'assets/images/Nivel1/fondosituacion.png');//Fondo situacion
    this.load.image('fondoAcc', 'assets/images/Nivel1/accion.png');//Fondo accion
    this.load.image('slot', 'assets/images/Nivel1/slot.png');
    this.load.image('fondoSlot', 'assets/images/Nivel1/fondoSlots.png');
    this.load.image('btnConfirmar', 'assets/images/Nivel1/btnConfirmar.png');
    
    this.load.text('data','assets/data/nivel1.json');//Datos nivel 1

    

  },

  create: function() {
    this.asset.cropEnabled = false;
  },
  
  update: function() {
    if(!!this.ready) {

      /*Carga de imagenes para situaciones de acuerdo a documento JSON con datos del nivel 1*/
      this.level1Data = JSON.parse(this.game.cache.getText('data'));//Parseo de datos
      this.cont = 1;//Contador para nombrar imagenes
      var thisTemp = this;
      this.level1Data.dataSitua.forEach(function(data){
        if(data.situaImg){
          var key = 'situa'+thisTemp.cont;
          thisTemp.load.image(key, data.situaImg);
          thisTemp.cont++;
        }
      });
      this.ready2 = true;
      this.game.load.start();//Carga nuevas imagenes

      if(!!this.ready2) {
        this.game.state.start('menu');
      }
    }
  },
  
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
