
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
    this.load.bitmapFont('font_white', 'assets/fonts/font_white/font_white.png', 'assets/fonts/font_white/font_white.fnt');

    /*Botones e imagenes generales*/
    this.load.image('btnContinuar','assets/images/Botones/btnContinuar.png');
    this.load.image('alert','assets/images/Botones/alert.png');
    this.load.image('time','assets/images/Botones/time.png');
    this.load.spritesheet('btnPausa', 'assets/images/Botones/btnPausa.png',45,45);
    this.load.image('btnCerrar', 'assets/images/Botones/btnCerrar.png');
    this.load.image('fondoPausa', 'assets/images/Botones/fondoPausa.png');
    this.load.spritesheet('OpcPausa', 'assets/images/Botones/opcPausa.png',54,49);
    this.load.image('estrella', 'assets/images/Botones/estrella.png');

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
    this.load.image('situacion0', 'assets/images/Nivel1/situacion0.png');//Situacion base
    this.load.image('fondoAcc', 'assets/images/Nivel1/accion.png');//Fondo accion
    this.load.image('slot', 'assets/images/Nivel1/slot.png');
    this.load.image('fondoSlot', 'assets/images/Nivel1/fondoSlots.png');
    this.load.image('btnConfirmar', 'assets/images/Nivel1/btnConfirmar.png');
    this.load.image('final1', 'assets/images/Nivel1/final.png');
    
    this.load.text('data','assets/data/nivel1.json');//Datos nivel 1

    /*Imagenes nivel 2*/
    this.load.image('introN2','assets/images/Nivel2/intro.jpg');
    this.load.image('tile_nivel2','assets/images/Nivel2/tile.jpg');
    this.load.image('piso','assets/images/Nivel2/piso.jpg');
    this.load.spritesheet('personaje','assets/images/Nivel2/personaje.png',48,68);
    this.load.spritesheet('item','assets/images/Nivel2/item.png',85,64);
    this.load.image('fondoVida','assets/images/Nivel2/fondoVida.png');
    this.load.image('vida','assets/images/Nivel2/vida.png');
    this.load.spritesheet('solicitud','assets/images/Nivel2/solicitud.png',107,28);

    this.load.text('data2','assets/data/nivel2.json');//Datos nivel 2

    /*Imagenes nivel 3*/
    this.load.spritesheet('gusano','assets/images/Nivel3/gusano.png',50,50);
    this.load.image('itemGusano','assets/images/Nivel3/item.png');

    /*Audios de juego*/
    this.load.audio('menuBgMusic', ['assets/audio/BgLoop/menu.ogg','assets/audio/BgLoop/menu.mp3']);

    this.load.audio('menuoverSound', ['assets/audio/menuOver.ogg','assets/audio/menuOver.mp3']);
    this.load.audio('errorSound', ['assets/audio/error_0.ogg','assets/audio/error_0.mp3']);
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
