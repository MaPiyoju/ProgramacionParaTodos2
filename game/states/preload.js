
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
    this.load.bitmapFont('fontData', 'assets/fonts/fontData/fontData.png', 'assets/fonts/fontData/fontData.fnt');

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
    this.load.spritesheet('item','assets/images/Nivel2/elementos.png',87,48);
    this.load.image('fondoVida','assets/images/Nivel2/fondoVida.png');
    this.load.image('vida','assets/images/Nivel2/vida.png');
    this.load.spritesheet('solicitud','assets/images/Nivel2/solicitud.png',107,28);
    this.load.image('final2', 'assets/images/Nivel2/final.png');
    
    this.load.text('data2','assets/data/nivel2.json');//Datos nivel 2

    /*Imagenes nivel 3*/
    this.load.image('tile_nivel3','assets/images/Nivel3/tile.jpg');
    this.load.spritesheet('gusano','assets/images/Nivel3/gusano.png',50,50);
    this.load.image('itemGusano','assets/images/Nivel3/item.png');
    this.load.image('tablero','assets/images/Nivel3/tablero.png');
    this.load.image('tablero_t','assets/images/Nivel3/tablero_t.png');

    this.load.text('data3','assets/data/nivel3.json');//Datos nivel 3


    /*Imagenes nivel 6*/
    this.load.image('tile_nivel6', 'assets/images/Nivel6/tile.png');
    this.load.image('introN6', 'assets/images/Nivel6/intro.jpg');
    this.load.image('btnfor','assets/images/Nivel6/btnfor.png');
    this.load.image('btnwhile','assets/images/Nivel6/btnwhile.png');
    this.load.image('slotciclo','assets/images/Nivel6/slot.png');    
    this.load.image('accion_large6','assets/images/Nivel6/accion_large.png');
    this.load.image('accion_small6','assets/images/Nivel6/accion_small.png');
    this.load.image('condicion6','assets/images/Nivel6/condicion.png');
    this.load.spritesheet('situacion6.1','assets/images/Nivel6/animSalto.png',401,273);
    this.load.spritesheet('situacion6_1','assets/images/Nivel6/animSaltoBien.png',401,273);
    this.load.spritesheet('situacion6_1_Inv','assets/images/Nivel6/animSaltoMal.png',401,273);
    this.load.image('btnEjecutar6','assets/images/Nivel6/btnEjecutar.png');
    this.load.image('fondoPasos6','assets/images/Nivel6/fondoPasos.png');
    this.load.image('fondosituacion','assets/images/Nivel6/fondosituacion.png');

    this.load.text('data6','assets/data/nivel6.json');//Datos nivel 3

    /*Audios de juego*/
    this.load.audio('menuBgMusic', ['assets/audio/BgLoop/menu.ogg','assets/audio/BgLoop/menu.mp3']);

    this.load.audio('menuoverSound', ['assets/audio/menuOver/menuOver.ogg','assets/audio/menuOver/menuOver.mp3']);
    this.load.audio('btnMenuSound', ['assets/audio/btnMenu/btnMenu.ogg','assets/audio/btnMenu/btnMenu.mp3']);
    this.load.audio('btnSound', ['assets/audio/btn/boton.ogg','assets/audio/btn/boton.mp3']);
    
    this.load.audio('errorSound', ['assets/audio/error/error_0.ogg','assets/audio/error/error_0.mp3']);
    this.load.audio('itemOkSound', ['assets/audio/item/item.ogg','assets/audio/item/item.mp3']);    
    this.load.audio('grabSound', ['assets/audio/grab/grab.ogg','assets/audio/grab/grab.mp3']);
    this.load.audio('soltarSound', ['assets/audio/soltar/soltar.ogg','assets/audio/soltar/soltar.mp3']);
    this.load.audio('feedSound', ['assets/audio/feed/feed.ogg','assets/audio/feed/feed.mp3']);
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

      /*Carga de imagenes para situaciones de acuerdo a documento JSON con datos del nivel 6*/
      this.level6Data = JSON.parse(this.game.cache.getText('data6'));//Parseo de datos
      this.cont = 1;//Contador para nombrar imagenes
      thisTemp = this;
      this.level6Data.dataSitua.forEach(function(data){
        if(data.ImageUrl){
          var key = 'niv6_situa'+thisTemp.cont;
          thisTemp.load.spritesheet(key, data.ImageUrl,401,273);
          thisTemp.load.spritesheet(key+"_Correct", data.ImageCorrect,401,273);
          thisTemp.load.spritesheet(key+"_Error", data.ImageError,401,273);
          
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
