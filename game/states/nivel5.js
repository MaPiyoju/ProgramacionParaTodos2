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
      this.yIni = 60;
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
      this.introImg = this.game.add.tileSprite(0, 0,800,600, 'introN5');//Imagen intro de juego
      this.introImg2 = null;
      this.game.input.onDown.add(this.iniciarJuego,this);
      this.txtIntro = this.game.add.bitmapText(610, 320, 'fontData', 'En este nivel tendrás la oportunidad de entender que es un arbol de decisión, por medio de divertidas e icreibles situaciones tomarás elecciones que te llevarán por diferentes caminos y podrás ver el arbol generado.\n\nIntentalo!', 24);
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

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel6');//Fondo de juego
      this.game.add.sprite(5,5,'marco');//Fondo marcos
      this.reaccion = this.game.add.sprite(400,5,'reacciones',5);//Reacciones del nivel

      //Graficas para control de arboles
      this.graf = this.game.add.graphics( 710, this.yIni );

      this.txtSitua = this.game.add.bitmapText(195,50,'fontData','',24);
      this.txtSitua.anchor.setTo(0.5,0);
      this.txtSitua.maxWidth = 350;
      this.btnSi = this.game.add.button(125,543,'btnSi',this.opcCondicionSi,this);
      this.btnNo = this.game.add.button(210,543,'btnNo',this.opcCondicionNo,this);
      this.cargaSitua();

      this.btnContinuar = this.game.add.button(120,543,'btnContinuar5',this.btnContinuarFn,this);
      this.btnContinuar.visible = false;

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
      this.btnSound.play();
      this.validaCondicion(true);
    },

    opcCondicionNo: function(){
      this.btnSound.play();
      this.validaCondicion(false);
    },

    validaCondicion: function(opc){
      if(this.levelData.dataSitua[this.random].pasos[this.pasoActual].accion == opc){
        this.pasoActual++;
        if(this.pasoActual < this.levelData.dataSitua[this.random].nPasos){
          this.txtSitua.text = this.levelData.dataSitua[this.random].pasos[this.pasoActual].txt;
          this.reaccion.frame = this.levelData.dataSitua[this.random].pasos[this.pasoActual].exp;
        }else{
          this.nodoFinal();
        }
      }else{
        this.nodoFinal();
      }
      this.miniArbol(opc);
    },

    miniArbol: function(opc){
      var botPadd = 10;
      var y = 0;
      if(!this.termina || this.pasoActual == this.levelData.dataSitua[this.random].nPasos){
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
      this.graf.moveTo(this.ultMin+(this.miniH/2),y-(this.miniH/2));
      this.graf.lineStyle(2, 0x000000);
      this.graf.lineTo(x+(this.miniH/2),y);
      this.graf.lineStyle(1, fill);
      this.graf.bounds = new PIXI.Rectangle(x, y, w, h);
      this.graf.drawRect(x, y, w, h);
      this.graf.endFill();
    },

    nodoFinal: function(){
      if(this.pasoActual == this.levelData.dataSitua[this.random].nPasos){//Mensaje final de acuerdo a la ultima eleccion
        this.txtSitua.text = this.levelData.dataSitua[this.random].pasos[this.pasoActual-1].fin;
        this.reaccion.frame = this.levelData.dataSitua[this.random].pasos[this.pasoActual-1].expAlt;
      }else{
        this.txtSitua.text = this.levelData.dataSitua[this.random].pasos[this.pasoActual].alterno;
        this.reaccion.frame = this.levelData.dataSitua[this.random].pasos[this.pasoActual].expAlt;
      }
      this.termina = true;
      this.btnSi.destroy();
      this.btnNo.destroy();
      this.btnContinuar.visible = true;
    },

    btnContinuarFn: function(){
      this.btnSound.play();
      this.showStats();
      this.btnContinuar.visible = false;
    },

    update: function() {
      if(!this.intro){
        
      }
    },

    showStats: function(){
      this.btnPausa.kill();//Se retira el boton de pausa
      //this.retirarItems();//Retirar elementos de juego
      this.alert.hide();//REtirar alerta de retroalimentacion
      //Creacion cuadro retroalimentación final
      this.retroFinal = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'final5');
      this.retroFinal.anchor.setTo(0.5,0.5);
      this.btnMenu = this.game.add.button(410,458,'OpcPausa',this.pnlPausa.menuBtn,this,this.game);//Se agrega boton para retornar a menu
      this.btnMenu.frame = 2;
      this.btnRepetir = this.game.add.button(335,458,'OpcPausa',this.pnlPausa.repetirBtn,this,this.game);//Se agrega boton para repetir nivel
      this.btnRepetir.frame = 0;

      //Botones para desplazamiento
      this.btnArriba = this.game.add.button(580,120,'flechas',this.desplazamiento,this);//Se agrega boton para desplazamiento arriba
      this.btnArriba.frame = 0;
      this.btnArriba.visible = false;
      this.btnAbajo = this.game.add.button(580,450,'flechas',this.desplazamiento,this);//Se agrega boton para desplazamiento abajo
      this.btnAbajo.frame = 1;

      this.pasoMostrarActual = 0;

      if(this.pasoActual<3){
        this.btnAbajo.visible = false;
      }

      this.cajasGroup = [];
      this.mostrarUltArbol();
    },

    mostrarUltArbol: function(){
      for(var i = 0;i<this.cajasGroup.length;i++){//Limpieza de elementos antes de nueva impresion
        this.cajasGroup[i].destroy();
      }
      this.cajasGroup = [];

      var ultY = 115;
      var xIni = (this.retroFinal.x - (this.retroFinal.width/3)) + 150;

      var lim = 0;
      if(this.pasoActual < 4){
        lim = this.pasoActual + 1;
      }else{
        lim = 4;
      }
      for(var i=this.pasoMostrarActual;i<lim+this.pasoMostrarActual;i++){
        console.log("faltan cajas");
        if(i != this.levelData.dataSitua[this.random].nPasos){
          var x1 = xIni;
          var x2 = xIni;
          if(i>0){
            if(this.levelData.dataSitua[this.random].pasos[i-1].accion == true){
              x1 = xIni;
              x2 = xIni + 185;
            }else{
              x1 = xIni + 185;
              x2 = xIni;
            }
          }
          var box = this.crearCaja(x1,ultY + 5,0,this.levelData.dataSitua[this.random].pasos[i].txtAccion,20);
          if(i>0){
            var box2 = this.crearCaja(x2,ultY + 5,1,'?',30);          
          }
          ultY += 90;

        }
        if(i == this.pasoActual){
          if(this.pasoActual == this.levelData.dataSitua[this.random].nPasos){//Final de la situacion en su totalidad
            var x1 = xIni;
            var x2 = xIni;
            if(this.levelData.dataSitua[this.random].pasos[i-1].accion == true){
              x2 = xIni + 185;
            }else{
              x1 = xIni + 185;
            }
            var box = this.crearCaja(x1,ultY + 5,0,this.levelData.dataSitua[this.random].pasos[i-1].fin,20);
            if(i>0){
              var box2 = this.crearCaja(x2,ultY + 5,1,'?',30);
            }
          }else{//Final de cada paso
            if(!(this.pasoMostrarActual == 0 && this.pasoActual == 3)){
              var x1 = xIni;
              var x2 = xIni;
              if(this.levelData.dataSitua[this.random].pasos[i-1].accion == true){
                x1 = xIni + 185;
              }else{
                x2 = xIni + 185;
              }
              var box = this.crearCaja(x1,ultY + 5,0,this.levelData.dataSitua[this.random].pasos[i].txtAlterno,20);
              var box2 = this.crearCaja(x2,ultY + 5,1,'?',30);
            }
          }
        }
      }
    },

    crearCaja: function(x,y,frame,txt,size){
      var box = this.game.add.sprite(x,y,'arbol',frame);
      box.anchor.setTo(0.5,0.5);
      this.cajasGroup.push(box);
      box.texto = this.game.add.bitmapText(box.x,box.y,'fontData',txt,size);
      box.texto.anchor.setTo(0.5,0.5);
      box.texto.maxWidth = box.width - 10;
      this.cajasGroup.push(box.texto);
      return box;          
    },

    desplazamiento: function(btn){
      if(btn.frame == 0){//Opcion flecha rriba, paso atras
        this.pasoMostrarActual-=1;
        this.btnAbajo.visible = true;
        if(this.pasoMostrarActual == 0){
          this.btnArriba.visible = false;
        }
      }else{//Opcion flecha abajo, paso adelante
        this.pasoMostrarActual+=1;
        this.btnArriba.visible = true;
        if(this.pasoActual - this.pasoMostrarActual < 4){
          this.btnAbajo.visible = false;
        }
      }
      this.mostrarUltArbol();
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