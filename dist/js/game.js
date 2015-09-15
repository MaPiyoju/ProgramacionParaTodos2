(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('nivel1', require('./states/nivel1'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/nivel1":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.btns = this.game.add.group();
      this.crearBoton(0,0,'nivel1',195,50,'Hola, aquí aprenderás sobre\nlos tipos de dato básicos de\njavascript. Intentalo!');
      this.crearBoton(0,100,'nivel2',305,150,'Sumérgete en un juego lleno\nde diversión mientras aprendes\na manipular variables. Vamos!');
      this.crearBoton(0,200,'nivel3',205,250,'Prueba tu agilidad y lógica por\nmedio del uso de operadores\nlógicos. Empecemos!');
      this.crearBoton(0,300,'nivel4',310,350,'Preparado?  Conoce, aprende y\nmanipula las estructuras\ncondicionales. Adelante!');
      this.crearBoton(0,400,'nivel5',205,450,'En esta  ocasión tendrás la\noportunidad de aprender sobre\nestructuras cíclicas. Allá vamos!');
      this.crearBoton(0,500,'nivel6',308,550,'Estas listo para probar todos\ntus conocimientos? Es hora de\nempezar a codificar. Vamos!');
    },

    update: function() {

    },

    crearBoton: function(x,y,llave,txt_x,txt_y,txt){
      var boton = this.game.add.sprite(x, y,llave,0);
      boton.nivel = llave;
      var anim = boton.animations.add('over', [0,1,2,3,4,5,6], 10, false);
      anim.onComplete.add(function() {
        if(boton.texto){
          boton.texto.revive();
        }else{
          boton.texto = this.game.add.bitmapText(txt_x, txt_y, 'font', txt, 20);
        }
        boton.texto.anchor.setTo(0,0.5);
      }, this);
      boton.inputEnabled = true;
      boton.events.onInputDown.add(this.clickListener, this);
      boton.events.onInputOver.add(this.over, this);
      boton.events.onInputOut.add(this.out, this);
      this.btns.add(boton);
    },

    clickListener: function(boton) {
      this.game.state.start(boton.nivel);
    },

    over: function(boton){
      boton.animations.play('over');
    },

    out: function(boton){
      boton.animations.stop('over');
      boton.frame = 0;
      if(boton.texto){
        boton.texto.kill();
      }
    }
  };
  
  module.exports = Play;
},{}],7:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
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

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])