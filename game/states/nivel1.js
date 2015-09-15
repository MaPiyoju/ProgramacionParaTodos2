  'use strict';
  //var Pausa = require('../prefabs/pause');

  function Nivel1() {
    this.ready = false;
  }

  Nivel1.prototype = {

    //Definición de propiedades
    scoreText: new Array(),
    score: {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0},
    maxtime: 60,
    flagpause: false,
    intro:true,

    //Carga de elementos especificos del nivel
    preload: function() {
      this.load.text('data','assets/data/nivel1.json');
    },

    onLoadComplete: function() {
      this.ready = true;
    },

    init: function(){      
      this.scoreText= new Array();
      this.score= {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0};
      this.maxtime= 60;
      this.flagpause= false; 
      this.intro = true;  
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data'));
      this.situaLength = this.levelData.dataSitua.length;
      console.log(this.situaLength);

      this.game.world.setBounds(0, 0, 800, 600);//Limites de escenario
      this.introImg = this.game.add.tileSprite(0, 0,800,600, 'introN1');//Imagen intro de juego
      this.game.input.onDown.add(this.iniciarJuego,this);
      this.game.add.bitmapText(60, 150, 'font', 'Bienvenido, a lo largo\nde este nivel aprenderás\ncuales son los tipo de\ndato básicos en \nJavascript; estos tipos\nson realmente utiles,\nnos permitirán definir\nel tipo de información\nmanejada y la cual se\nquiere almacenar y\nmanipular (números,\ntextos, etc.)\n\nVamos!', 24);
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

    empezar: function() {
      this.intro = false;//Se deshabilita el intro de juego
      this.introImg.kill();//Se elimina imagen de intro

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel1');//Fondo de juego
      this.game.add.sprite(50,50,'fondoSit');//Fondo de situacion

      this.random = Math.floor(Math.random() * this.situaLength);//Se realiza la carga de una situación de forma aleatoria
      this.crearSitua(this.random);//Crear situacion de acuerdo al parametro aleatorio generado
    },

    update: function() {
      if(!this.intro){
        
      }
    },

    crearSitua: function(nSitua){
      this.game.add.bitmapText(60, 80, 'font', this.levelData.dataSitua[nSitua].situaTxt);//Se agrega texto de situacion
      this.accionGroup = this.game.add.group();//Se realiza creacion de grupo de acciones
      this.slotGroup = this.game.add.group();//Se realiza creacion de grupo de slots

      //Se realiza creación de slots de acuerdo a numero de pasos de situacion
      var col = Math.ceil(this.levelData.dataSitua[nSitua].nPasos/2);//Se define el numero de columnas
      var xIniSl = 500;//Definicion posicion x Inicial para slot
      for(var i=0;i<2;i++){
        var yIniSl = 60;//Definicion posicion y Inicial para slot
        for(var j=0;j<col;j++){
          var slot = this.game.add.sprite(xIniSl,yIniSl,'slot');
          yIniSl += 100;//Aumento y para siguiente slot
        }
        xIniSl += 100;//Aumento x para siguiente slot
      }

      //Se realiza creación de acciones o pasos de acuerdo a la situacion
      var xIniAcc = 60;
      var yIniAcc = 400;
      var thisTemp = this;
      this.levelData.dataSitua[nSitua].accion.forEach(function(data){
        var accion = thisTemp.game.add.sprite(xIniAcc,yIniAcc,'fondoAcc');//Creacion objeto de accion
        accion.texto = thisTemp.game.add.bitmapText(accion.x, accion.y, 'font', data.txt);//Se agrega el texto de la accion

        thisTemp.accionGroup.add(accion);//Se inclutye ele elemento creado en el grupo de acciones
        xIniAcc += accion.width;//Aumento de posicion en X para proximos elementos
      });
    },

    crearItem: function(){
      
    },

    recogerItem: function (jugador, item) {
        
    },

    updateTimer: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){
        this.siguiente = this.game.add.sprite(this.game.width/2, this.game.height/2,'btnContinuar');
        this.siguiente.anchor.setTo(0.5,0.5);
        this.siguiente.inputEnabled = true;
        this.siguiente.events.onInputDown.add(this.clickListener, this);
        this.siguiente.fixedToCamera = true; 

        //Detener metodo de update
        this.tiempo.stop();
        //Eliminar items restantes en el campo
        this.items.forEach(function(item) {
            item.kill();
        });
        this.btnPausa.kill();
      }

      var minutos = 0;
      var segundos = 0;
        
      if(this.maxtime/60 > 0){
        minutos = Math.floor(this.maxtime/60);
        segundos = this.maxtime%60;
      }else{
        minutos = 0;
        segundos = this.maxtime; 
      }
      
      this.maxtime--;
        
      //Se agrega cero a la izquierda en caso de ser de un solo digito   
      if (segundos < 10)
        segundos = '0' + segundos;
   
      if (minutos < 10)
        minutos = '0' + minutos;
   
      this.timer.setText(minutos + ':' +segundos);
    },

    clickListener: function() {
      //Se da paso al seiguiente nivel de juego (Segunda parte del nivel 1)
      this.game.state.start('nivel1_1',true,false,this.score);
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
  
  module.exports = Nivel1;