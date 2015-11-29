  'use strict';
  var Pausa = require('../prefabs/pause');
  var Alert = require('../prefabs/alert');

  function Nivel5() {}

  Nivel5.prototype = {

    //Definición de propiedades globales de nivel
    maxtime: 120,
    flagpause: false,
    intro:true,
    introStep:0,
    pasoActual: 0,
    bien: 0,
    countErrors: 0,
    yIni: 150,
    miniH: 20,
    ultMin: 0,
    inicia: false,
    termina: false,

    msjError: ['Recuerda analizar a profundidad  el problema que se te esta presentando','No olvides usar los operadores correspondientes a la solicitud','Existen muchas formas de dar solución a un mismo problema, sin embargo aqui solo podrás seguir un camino'],

    init: function(){
      this.maxtime= 120;
      this.flagpause= false; 
      this.intro = true;
      this.introStep = 0;
      this.pasoActual = 0;
      this.bien = 0;
      this.countErrors = 0;
      this.yIni = 150;
      this.miniH = 20;
      this.ultMin = 0;
      this.inicia = false;
      this.termina = false;

      //Se incluyen audios de juego
      this.btnSound = this.game.add.audio('btnSound');
      this.feedSound = this.game.add.audio('feedSound');
      this.malSound = this.game.add.audio('malSound');
      this.cambioSound = this.game.add.audio('cambioSound');
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data5'));
      this.situaLength = this.levelData.dataSitua.length;//Cantidad de situaciones de nivel

      this.game.world.setBounds(0, 0, 800, 600);//Limites de escenario
      this.introImg = this.game.add.tileSprite(0, 0,800,600, 'introN4');//Imagen intro de juego
      this.introImg2 = null;
      this.game.input.onDown.add(this.iniciarJuego,this);
      this.txtIntro = this.game.add.bitmapText(610, 300, 'fontData', 'En este nivel tendrás la oportunidad de trabajar en la construcción de expresiones, deberás analizar correctamente cada solicitud y conformar pedazo a pedazo una expresión que le de solución.\n\nSuerte!', 24);
      this.txtIntro.anchor.setTo(0.5,0.5);
      this.txtIntro.maxWidth = 250;
    },

    iniciarJuego : function(game){
      var x1 = 531;
      var x2 = 680;
      var y1 = 480;
      var y2 = 550;
      if(this.intro){
        switch(this.introStep){
          case 0:
            if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
              this.btnSound.play();
              this.introStep++;
              this.introImg.kill();//Se elimina imagen de intro
              this.introImg2 = this.game.add.sprite(0,0,'ayudaGeneral',4);
            }          
            break;
          case 1:
            this.btnSound.play();
            this.empezar();
            break;
        }
      }
    },

    empezar: function(){
      this.physics = this.game.physics.startSystem(Phaser.Physics.ARCADE);//Habilitacion de fisicas
      this.intro = false;//Se deshabilita el intro de juego
      this.introImg2.kill();//Se elimina imagen de intro

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel4');//Fondo de juego

      //Graficas para control de arboles
      this.graf = this.game.add.graphics( 570, this.yIni );

      this.txtSitua = this.game.add.bitmapText(200,200,'fontData','',24);
      this.btnSi = this.game.add.button(200,370,'OpcPausa',this.opcCondicionSi,this);
      this.btnNo = this.game.add.button(250,370,'OpcPausa',this.opcCondicionNo,this);
      this.cargaSitua();

      this.tiempo = this.game.time.create(false);
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

    cargaSitua: function(){
      this.random = Math.floor(Math.random()*this.levelData.dataSitua.length);
      this.txtSitua.text = this.levelData.dataSitua[this.random].pasos[this.pasoActual].txt;
      this.miniArbol();
      this.inicia = true;
    },

    opcCondicionSi: function(){
      this.validaCondicion(true);
    },

    opcCondicionNo: function(){
      this.validaCondicion(false);
    },

    validaCondicion: function(opc){
      if(this.levelData.dataSitua[this.random].pasos[this.pasoActual].accion == opc){
        this.pasoActual++;
        if(this.pasoActual < this.levelData.dataSitua[this.random].nPasos){
          this.txtSitua.text = this.levelData.dataSitua[this.random].pasos[this.pasoActual].txt;
        }else{
          this.arbolFinal();
        }
      }else{
        this.arbolFinal();
      }
      this.miniArbol(opc);
    },

    miniArbol: function(opc){
      var botPadd = 10;
      var y = 0;
      if(!this.termina){
        y = ((this.miniH + botPadd) * this.pasoActual);
      }else{
        y = ((this.miniH + botPadd) * (this.pasoActual + 1));
      }
      if(this.pasoActual == 0 && !this.inicia){//Se pinta la condicion inicial
        this.pintar(0x272822, 0, y, this.miniH, this.miniH);
        this.ultMin = 0;
      }else{//Se valida de acuerdo a la condicion
        if(opc === true){
          this.pintar(0x272822, this.ultMin - this.miniH, y, this.miniH, this.miniH);
          this.pintar(0xffffff, this.ultMin + this.miniH, y, this.miniH, this.miniH);
          this.ultMin = this.ultMin - this.miniH;
        }else{
          this.pintar(0xffffff, this.ultMin - this.miniH, y, this.miniH, this.miniH);
          this.pintar(0x272822, this.ultMin + this.miniH, y, this.miniH, this.miniH);
          this.ultMin = this.ultMin + this.miniH;
        }
      }
    },

    pintar: function(fill,x,y,w,h){
      this.graf.beginFill(fill, 1);
      this.graf.lineStyle(1, fill);
      this.graf.lineTo(x,y);
      this.graf.bounds = new PIXI.Rectangle(x, y, w, h);
      this.graf.drawRect(x, y, w, h);
    },

    arbolFinal: function(){
      this.termina = true;
      this.btnSi.destroy();
      this.btnNo.destroy();
    },

    update: function() {
      if(!this.intro){
        
      }
    },

    showStats: function(){
      this.nuevoCuerpo();
      this.btnPausa.kill();//Se retira el boton de pausa
      //this.retirarItems();//Retirar elementos de juego
      this.alert.hide();//REtirar alerta de retroalimentacion
      //Creacion cuadro retroalimentación final
      this.retroFinal = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'final3');
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
      if(this.porcentaje > 24){//2 estrellas
        this.game.add.sprite(348,227,'estrella');
      }
      if(this.porcentaje > 50){//3 estrellas
        this.game.add.sprite(471,227,'estrella');
      }
    },    

    pausaJuego: function(game){
      var x1 = (this.game.width - 81);
      var x2 = (this.game.width - 36);
      var y1 = 10;
      var y2 = 55;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        this.btnSound.play();
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
  
  module.exports = Nivel5;