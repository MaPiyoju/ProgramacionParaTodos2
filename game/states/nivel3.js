  'use strict';
  var Pausa = require('../prefabs/pause');
  var Alert = require('../prefabs/alert');
  var Tablero = require('../prefabs/tablero');

  function Nivel3() {}

  Nivel3.prototype = {

    //Definición de propiedades globales de nivel
    maxtime: 120,
    flagpause: false,
    intro:true,
    movimiento: 0,
    gusanoGroup: null,
    cuerpoGroup: null,
    itemGroup: null,

    levelData: [
      {
        "exp": "8+5*3"
      }
    ],
    res: 0,

    init: function(){
      this.maxtime= 120;
      this.flagpause= false; 
      this.intro = true;
      this.movimiento = 0;
      this.gusanoGroup = [];
      this.cuerpoGroup = [];
      this.itemGroup = [];
    },

    create: function(){
      //Parseo de datos de juego para su uso
      //this.levelData = JSON.parse(this.game.cache.getText('data'));
      //this.situaLength = this.levelData.dataSitua.length;//Cantidad de situaciones de nivel

      this.game.world.setBounds(0, 0, 800, 600);//Limites de escenario
      this.introImg = this.game.add.tileSprite(0, 0,800,600, 'introN1');//Imagen intro de juego
      this.game.input.onDown.add(this.iniciarJuego,this);
      this.game.add.bitmapText(60, 150, 'font', 'Bienvenido,', 24);
    },

    iniciarJuego : function(game){
      var x1 = 115;
      var x2 = 264;
      var y1 = 480;
      var y2 = 550;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        if(this.intro){
          this.empezar();
        }
      }
    },

    empezar: function(){
      this.physics = this.game.physics.startSystem(Phaser.Physics.ARCADE);//Habilitacion de fisicas
      this.intro = false;//Se deshabilita el intro de juego
      this.introImg.kill();//Se elimina imagen de intro

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel1');//Fondo de juego
      //this.random = Math.floor(Math.random() * this.situaLength);//Se realiza la carga de una situación de forma aleatoria
      
      this.tablero = new Tablero(this.game, 50, 20 ,12 , 10);//Creacion de tablero de movimiento
      this.gusano = this.tablero.setObjCuadro(Math.floor(Math.random()*this.tablero.xCuadros), Math.floor(Math.random()*this.tablero.yCuadros), 'gusano', null, 0);
      this.game.physics.arcade.enable(this.gusano);//Habilitacion de fisicas sobre cabeza de gusano
      this.gusanoGroup.push(this.gusano);//Se incluye la cabeza de gusano en grupo de control
      this.cursors = this.game.input.keyboard.createCursorKeys();//Se agregan cursores de control de movimiento
      this.comerItem();//Creacion bolas iniciales de gusano
      this.comerItem();//Creacion bolas iniciales de gusano

      this.crearExpresion();

      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(125, this.updateMov, this);//Actualizacion movimiento jugador
      this.tiempo.start();

      this.alert = new Alert(this.game);//Creacion onjeto de alerta
      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

      //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego,this);
    },

    update: function() {
      if(!this.intro){
        this.game.physics.arcade.overlap(this.gusano, this.itemGroup, this.comerItem, null, this);//Se define metodo llamado de colision para item - cabeza
        this.game.physics.arcade.overlap(this.gusano, this.cuerpoGroup, this.chocar, null, this);//Se define metodo llamado de colision para cuerpo - cabeza
        //Definicion movimiento de jugador por medio de cursores de movimiento(Flechas teclado)
        if(this.cursors.right.isDown && this.movimiento != 1){//Movimiento a la derecha
          this.movimiento = 0;
        }else if (this.cursors.left.isDown && this.movimiento != 0){//Movimiento a la izquierda
          this.movimiento = 1;
        }else if (this.cursors.up.isDown && this.movimiento != 3){//Movimiento hacia arriba
          this.movimiento = 2;
        }else if (this.cursors.down.isDown && this.movimiento != 2){//Movimiento hacia abajo
          this.movimiento = 3;
        }
      }
    },

    updateMov: function(){
      this.gusano.lasti = this.gusano.i;//Posicion actual X cabeza para siguiente elemento
      this.gusano.lastj = this.gusano.j;//Posicion actual Y cabeza para siguiente elemento
      //Movimiento cabeza de gusano
      switch(this.movimiento){
        case 0://Movimiento hacia la derecha
          if(this.gusano.i == this.tablero.xCuadros - 1){//Limite de tablero
            this.gusano.i = -1;
          }
          this.tablero.setObjCuadro(this.gusano.i+1,this.gusano.j,'',this.gusano,0);
          break;
        case 1://Movimiento hacia la izquierda
          if(this.gusano.i == 0){//Limite de tablero
            this.gusano.i = this.tablero.xCuadros;
          }
          this.tablero.setObjCuadro(this.gusano.i-1,this.gusano.j,'',this.gusano,0);
          break;
        case 2://Movimiento hacia arriba
          if(this.gusano.j == 0){//Limite de tablero
            this.gusano.j = this.tablero.yCuadros;
          }
          this.tablero.setObjCuadro(this.gusano.i,this.gusano.j-1,'',this.gusano,0);
          break;
        case 3://Movimiento hacie abajo
          if(this.gusano.j == this.tablero.yCuadros - 1){//Limite de tablero
            this.gusano.j = -1;
          }
          this.tablero.setObjCuadro(this.gusano.i,this.gusano.j+1,'',this.gusano,0);
          break;
      }
      //Movimiento cuerpo gusano
      for(var i=1;i<this.gusanoGroup.length;i++){//Empieza en 1 para omitir la cabeza de gusano
        this.gusanoGroup[i].lasti = this.gusanoGroup[i].i;
        this.gusanoGroup[i].lastj = this.gusanoGroup[i].j;
        this.tablero.setObjCuadro(this.gusanoGroup[i-1].lasti,this.gusanoGroup[i-1].lastj,'',this.gusanoGroup[i],1);
      }
    },

    crearExpresion: function(){
      var random = Math.floor(Math.random()*this.levelData.length);
      this.txtExp = this.game.add.bitmapText(this.game.world.centerX, 20, 'font', this.levelData[random].exp, 28);
      this.res = eval(this.levelData[random].exp);
      console.log(this.res);
    },

    crearItem: function(){
      var xRandom = Math.floor(Math.random()*this.tablero.xCuadros);//Posicion X aleatoria para nuevo elemento
      var yRandom = Math.floor(Math.random()*this.tablero.yCuadros);//Posicion Y aleatoria para nuevo elemento
      this.itemGroup.push(this.tablero.setObjCuadro(xRandom, yRandom, 'itemGusano', null, 0));
    },

    comerItem: function(cabeza, item){
      if(item){
        item.destroy();
      }
      var bola = this.tablero.setObjCuadro(this.gusanoGroup[this.gusanoGroup.length-1].i, this.gusanoGroup[this.gusanoGroup.length-1].j, 'gusano', null, 1);
      switch(this.movimiento){
        case 0://En caso de movimiento hacia la derecha
          this.tablero.setObjCuadro(this.gusano.i-1, this.gusano.j, '', bola, 1);
          break;
        case 1://En caso de movimiento hacia la izquierda
          this.tablero.setObjCuadro(this.gusano.i+1, this.gusano.j, '', bola, 1);
          break;
        case 2://En caso de movimiento hacia arriba
          this.tablero.setObjCuadro(this.gusano.i, this.gusano.j+1, '', bola, 1);
          break;
        case 3://En caso de movimiento hacia abajo
          this.tablero.setObjCuadro(this.gusano.i, this.gusano.j-1, '', bola, 1);
          break;
      }
      this.cuerpoGroup.push(bola);
      this.gusanoGroup.push(bola);
      this.crearItem();//Creacion nuevo item
    },

    chocar: function(cabeza, cuerpo){
      this.showStats();//Mostrar estadisticas
      //Detener metodo de update
      this.tiempo.stop();
    },

    showStats: function(){
      this.btnPausa.kill();//Se retira el boton de pausa
      //this.retirarItems();//Retirar elementos de juego
      this.alert.hide();//REtirar alerta de retroalimentacion
      //Creacion cuadro retroalimentación final
      this.retroFinal = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'final1');
      this.retroFinal.anchor.setTo(0.5,0.5);
      this.btnMenu = this.game.add.button(410,370,'OpcPausa',this.pnlPausa.menuBtn,this,this.game);//Se agrega boton para retornar a menu
      this.btnMenu.frame = 2;
      this.btnRepetir = this.game.add.button(335,370,'OpcPausa',this.pnlPausa.repetirBtn,this,this.game);//Se agrega boton para repetir nivel
      this.btnRepetir.frame = 0;

      this.txtStats = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 170, 'font_white', '', 28);
      this.txtStats.anchor.setTo(0.5,0.5);

      this.porcentaje = 0;
      
      this.txtPorc = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 125, 'font_white', this.porcentaje.toString() + '%', 40);
      this.txtPorc.anchor.setTo(0.5,0.5);

      //Asignacion de estrellas
      if(this.porcentaje > 0){//1 estrella
        this.game.add.sprite(221,227,'estrella');
      }
      if(this.porcentaje > 49){//2 estrellas
        this.game.add.sprite(348,227,'estrella');
      }
      if(this.porcentaje > 99){//3 estrellas
        this.game.add.sprite(471,227,'estrella');
      }
    },    

    pausaJuego: function(game){
      var x1 = (this.game.width - 81);
      var x2 = (this.game.width - 36);
      var y1 = 10;
      var y2 = 55;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        if(this.game.paused == false){
          //Se muestra panel de pausa
          if(this.flagpause==false){
            this.pnlPausa.show();   
            this.flagpause = true;
          }            
        }else{
          //Se esconde el panel de pausa
          this.game.paused = false;
          this.pnlPausa.hide();
          this.flagpause = false;
        }
      }
    }
  };
  
  module.exports = Nivel3;