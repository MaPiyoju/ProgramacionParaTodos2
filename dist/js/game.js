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
  game.state.add('nivel2', require('./states/nivel2'));
  game.state.add('nivel3', require('./states/nivel3'));
  game.state.add('nivel4', require('./states/nivel4'));
  game.state.add('nivel5', require('./states/nivel5'));
  game.state.add('nivel6', require('./states/nivel6'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/nivel1":9,"./states/nivel2":10,"./states/nivel3":11,"./states/nivel4":12,"./states/nivel5":13,"./states/nivel6":14,"./states/play":15,"./states/preload":16}],2:[function(require,module,exports){
  'use strict';

  // Create our pause panel extending Phaser.Group
  var Alert = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Fondo de alerta
    this.fondo = this.game.add.sprite(0,0,'alert')
    this.add(this.fondo);

    //Se define el texto de alerta
    this.txtInfo = this.game.add.bitmapText(this.game.world.centerX,this.game.world.centerY-100,'fontData','',30);//Texto para retroalimentacion de nivel
    this.txtInfo.anchor.setTo(0.5,0.5);
    this.txtInfo.maxWidth = 400;
    this.txtInfo.align = "center";
    this.add(this.txtInfo);

    //Se define el boton continuar de alerta
    this.btnContinuar = this.game.add.button(this.game.world.centerX,this.txtInfo.y + 120, 'btnContinuar',this.hide,this);
    this.btnContinuar.anchor.setTo(0.5,0);
    this.add(this.btnContinuar);

    this.visible = false;
  };

  Alert.prototype = Object.create(Phaser.Group.prototype);
  Alert.constructor = Alert;

  Alert.prototype.show = function(texto){//Evento mostrar alerta
    this.txtInfo.text = texto;
    this.visible = true;
    this.fondo.bringToTop();
    this.txtInfo.parent.bringToTop(this.txtInfo);
    this.btnContinuar.bringToTop();
    this.updateZ();
  };

  Alert.prototype.hide = function(){//Evento ocultar alerta
    this.txtInfo.text = "";
    this.visible = false;
  };
 
  module.exports = Alert;
},{}],3:[function(require,module,exports){
'use strict';

var Entidad = function(game, x, y, key,frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);

  /*Definicion de propiedades*/
  this.posx = 0;//Posicion relativa de x en el tablero
  this.posy = 0;//Posicion relativa de y en el tablero
  this.propiedades = [{nombre:"Posicion X",prop:"posx",val:this.posx},
                {nombre:"Posicion Y",prop:"posy",val:this.posy}];
  this.consejos = ["Siempre que abras un parentésis ( recuerda darle cierre )","Fijate siempre en lo que escribes, el mas mínimo error genera fallas en el código","Un error de sintaxis puede deberse a la falta de un paréntesis","Un error de sintaxis puede deberse a puntos(.) repetidos","Si te sientes bloqueado, detente y relajate","Siempre que llames una función o método asegurate de establecer sus propiedades dentro del paréntesis"];
};

Entidad.prototype = Object.create(Phaser.Sprite.prototype);
Entidad.prototype.constructor = Entidad;

Entidad.prototype.update = function() {
};

Entidad.prototype.mostrar = function(msj) {
  if(!this.txtMostrar){//Se realiza la cracion del mensaje
    this.txtFondo = this.game.add.sprite(this.x + (this.width * 3)+10,this.y + 20,'globo1');
    this.txtFondo.anchor.setTo(0.5,0);
    this.txtMostrar = this.game.add.text(this.txtFondo.x,this.txtFondo.y + 8,msj,{ font: '12px consolas', fill: '#000', align:'left'});
    this.txtMostrar.anchor.setTo(0.5,0);
    this.txtMostrar.wordWrap = true;
    this.txtMostrar.wordWrapWidth = 110;
    this.txtMostrar.alpha = 0;
    this.txtFondo.alpha = 0;
  }else{
    this.txtFondo.x = this.x + (this.width * 3)+10;
    this.txtFondo.y = this.y + 40;
    this.txtMostrar.x = this.txtFondo.x;
    this.txtMostrar.y = this.txtFondo.y + 15;
    this.txtMostrar.setText(msj);//Se establece el texto del mensaje
  }
  if(!msj){//Texto por defecto
    this.txtMostrar.setText("Hola");
  }
  console.log('Heigth: '+this.txtMostrar.height);
  if(this.txtMostrar.height < 40){//En caso de contar con una linea
    this.txtFondo.loadTexture('globo1');
    this.txtFondo.y = this.y + 20;
    this.txtMostrar.y = this.txtFondo.y + 8;
  }else if(this.txtMostrar.height < 87){//En caso de contar con dos hasta 4 lineas
    this.txtFondo.loadTexture('globo2');
  }else{//En caso de contrar con mas de 4 lineas
    this.txtFondo.loadTexture('globo3');
  }
  this.msjBandera = true;
  this.game.add.tween(this.txtMostrar).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);//Animacion para mostrar mensaje
  this.game.add.tween(this.txtFondo).to({alpha:1}, 350, Phaser.Easing.Linear.None, true);//Animacion para mostrar mensaje
  setTimeout(this.ocultar,5000,this);//Se realiza el llamado de metodo para ocultar mensaje en 5 segundos
};

Entidad.prototype.ocultar = function(e) {
  //Animacion para ocutar mensaje
  e.game.add.tween(e.txtMostrar).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
  e.game.add.tween(e.txtFondo).to({alpha:0}, 350, Phaser.Easing.Linear.None, true);
  e.msjBandera = false;
  e.propBandera = false;
  e.consBandera = false;
};

Entidad.prototype.prop = function() {
  var retorno = "";
  for(var i=0;i<this.propiedades.length;i++){
    retorno += this.propiedades[i].nombre + ": " + this.propiedades[i].prop + "\n";
  }
  this.propBandera = true;
  return retorno;
};

Entidad.prototype.consejo = function() {
  var random = Math.floor(Math.random() * this.consejos.length);
  this.consBandera = true;
  return this.consejos[random];
};

module.exports = Entidad;

},{}],4:[function(require,module,exports){

  'use strict';

  // Create our pause panel extending Phaser.Group
  var Pause = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Se agrega el panel
    this.panel = this.create(this.game.width/2, 10, 'fondoPausa');
    this.panel.fixedToCamera = true;
    this.panel.anchor.setTo(0.5, 0);

    //this.game.onPause.add(enPausa, this);
    this.mensajeGeneral  = this.game.add.sprite(0, 0,'ayudaGeneral',0);
    this.mensajeGeneral.visible = false;
    this.mensajeGeneral.fixedToCamera = true;
    this.cerrarMensaje = this.game.add.sprite((this.game.width - 81),20,'btnCerrar');
    this.cerrarMensaje.fixedToCamera = true;
    this.cerrarMensaje.visible = false;

    //Boton de play o resume
    this.btnPlay = this.game.add.button((this.game.width - 81), -140, 'btnPausa');
    this.btnPlay.fixedToCamera = true;
    this.btnPlay.frame = 0;
    this.add(this.btnPlay);

    //Boton de reiniciar
    this.btnReiniciar = this.game.add.button((this.game.width/2) - 120, 50, 'OpcPausa');
    this.btnReiniciar.fixedToCamera = true;
    this.btnReiniciar.frame = 0;
    this.add(this.btnReiniciar);   

    //Boton de inicio
    this.btnInicio = this.game.add.button((this.game.width/2) -30 , 50, 'OpcPausa');
    this.btnInicio.fixedToCamera = true;
    this.btnInicio.frame = 2;
    this.add(this.btnInicio);

    
    //Boton de ayuda
    this.btnAyuda = this.game.add.button((this.game.width/2) + 60, 50, 'OpcPausa');
    this.btnAyuda.fixedToCamera = true;
    this.btnAyuda.frame = 1;
    this.add(this.btnAyuda);
    
    //Se establece la posicion fuera de los limites de juego
    this.x = 0;
    this.y = -160;
    this.game.input.onDown.add(this.reset,this);

    //Se incluyen audios de juego
    this.btnSound = this.game.add.audio('btnSound');
  };

  Pause.prototype = Object.create(Phaser.Group.prototype);
  Pause.constructor = Pause;

  Pause.prototype.show = function(){
    var game_ = this.game;
    var tween = this.game.add.tween(this).to({y:150}, 500, Phaser.Easing.Bounce.Out, true);
    tween.onComplete.add(function(){this.game.paused = true;}, this);
  };
  Pause.prototype.hide = function(){
    this.game.add.tween(this).to({y:-160}, 200, Phaser.Easing.Linear.NONE, true);
  }; 

  Pause.prototype.reset = function(game){
     
      var x1 = (this.game.width/2) - 120;
      var x2 = (this.game.width/2) - 75;
      var y1 = 210; 
      var y2 = 255;
     if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
           //Opcion Reiniciar
          if(this.game.paused){
            this.btnSound.play();
            this.game.paused = false;
            this.hide();                  
            this.game.state.clearCurrentState();
            if(game.game.state.current == "nivel1_1"){
              game.game.state.start("nivel1");
            }else{
              game.game.state.start(game.game.state.current);
            }
          }
      }else if(game.x > (this.game.width/2) -30 && game.x < (this.game.width/2) + 15 && game.y > y1 && game.y < y2 ){
          //Opcion Inicio
           if(this.game.paused){
            this.btnSound.play();
            this.game.paused = false;
            this.hide();                  
            this.game.state.clearCurrentState();
            game.game.state.start("play");
          }
      }else if(game.x > (this.game.width/2) + 60 && game.x < (this.game.width/2) + 105 && game.y > y1 && game.y < y2 ){
          //Opcion ayuda
           if(this.game.paused){
            this.btnSound.play();
            var frame  = 0;            
              switch(game.game.state.current){
                case 'nivel1':                 
                  frame = 0;
                break;
                case 'nivel1_1':
                  frame = 1;
                break;
                case 'nivel2':
                  frame = 2;
                break;
                case 'nivel3':
                  frame = 3;
                break;
                case 'nivel4':
                  frame = 4;
                break;
                case 'nivel5':
                  frame = 5;
                break;
                case 'nivel6':
                  frame = 6;
                break;
              }              
              this.mensajeGeneral.frame = frame;
              this.mensajeGeneral.visible = true;
              this.cerrarMensaje.visible = true;
           }
      }else if( this.game.paused == true && this.mensajeGeneral != null && this.mensajeGeneral.visible == true && game.x > (this.game.width - 81) && game.x < (this.game.width - 36) && game.y > 20 && game.y < 65 ){
          this.mensajeGeneral.visible=false;
          this.cerrarMensaje.visible=false;
      }
  }; 


  /*Metodos generales para retorno a menu y repetir nivel para llamado externo*/
  Pause.prototype.menuBtn = function(this_, game) {
    this.btnSound.play();
    this_.game.state.clearCurrentState();
    game.game.state.start("play");
  };
  
  Pause.prototype.repetirBtn = function(this_,game) {
    this.btnSound.play();
    this.game.state.clearCurrentState();    
    game.game.state.start(game.game.state.current);
  };
 
  module.exports = Pause;
},{}],5:[function(require,module,exports){
'use strict';

var Entidad = require('../prefabs/entidad');

var Tablero = function(game, x, y ,xCuadros , yCuadros, tablero, tableroMarco, parent){
  Phaser.Group.call(this, game, parent);  

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.xCuadros = xCuadros;
  this.yCuadros = yCuadros;
  this.dimension = 50;

  //Fondo de tablero
  this.fondoTableroF = this.game.add.sprite(x,y,tablero);
  this.fondoTablero = this.game.add.sprite(x-30,y-28,tableroMarco);
  this.add(this.fondoTableroF);
  this.add(this.fondoTablero);

  //Se dibuja el tablero con base en los valores de entrada
  for(var i=0;i<xCuadros;i++){
    for(var j=0;j<yCuadros;j++){
      this.dibujarCuadro(x+(i*this.dimension),y+(j*this.dimension),this.dimension);
    }
  }
  this.enableBody = true;//Habilitacion de colisiones en cada elemento del grupo
};

Tablero.prototype = Object.create(Phaser.Group.prototype);
Tablero.constructor = Tablero;

Tablero.prototype.update = function() {
  
};

Tablero.prototype.dibujarCuadro = function(x,y,dimension) {
  var cuadro = this.game.add.graphics( 0, 0 );
  //cuadro.beginFill(0x272822, 1);
  cuadro.lineStyle(1, 0xffffff);
  cuadro.bounds = new PIXI.Rectangle(x, y, dimension, dimension);
  cuadro.drawRect(x, y, dimension, dimension);
  this.add(cuadro);
};

Tablero.prototype.setObjCuadro = function(i, j, obj, sprite, frame){
  if(obj != ''){//Creacion objeto nuevo en tablero de juego
    var obj = new Entidad(this.game,this.x+(i*this.dimension)+(this.dimension/2),this.y+(j*this.dimension)+(this.dimension/2),obj,frame);
    obj.anchor.setTo(0.5,0.5);
    obj.i = i;
    obj.j = j;
    this.add(obj);
  }else{//Actualizacion posicion objeto en tablero de juego
    sprite.x = this.x+(i*this.dimension)+(this.dimension/2);
    sprite.i = i;
    sprite.propiedades[0].val = i;//Se actualiza el valor en propiedades
    sprite.y = this.y+(j*this.dimension)+(this.dimension/2);
    sprite.j = j;
    sprite.propiedades[1].val = j;//Se actualiza el valor en propiedades
  }
  return obj;
}

Tablero.prototype.setTexto = function(i, j, txt, obj_) {
  if(obj_){
    obj_.x = this.x+(i*this.dimension)+(this.dimension/2);
    obj_.y = this.y+(j*this.dimension);
  }else{
    var obj = this.game.add.bitmapText(this.x+(i*this.dimension)+(this.dimension/2), this.y+(j*this.dimension), 'fontData', txt, 22);
    obj.align = "center";
    obj.anchor.setTo(0.5,-0.5);
    this.add(obj);
    return obj;
  }
};

Tablero.prototype.destruir = function() {
 
};

module.exports = Tablero;
},{"../prefabs/entidad":3}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {    
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'intro');
    this.sprite.anchor.setTo(0.5, 0.5);

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
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],9:[function(require,module,exports){
  'use strict';
  var Pausa = require('../prefabs/pause');
  var Alert = require('../prefabs/alert');
  function Nivel1() {}

  Nivel1.prototype = {

    //Definición de propiedades globales de nivel
    maxtime: 360,
    flagpause: false,
    intro:true,
    introStep:0,

    //Contadores para stats de nivel
    nSituaciones: 0,
    nCorrectas: 0,
    nIntentos: 0,

    //Mensajes retroalimentacion nivel
    msjVacios: ['Creo que aun faltan pasos por completar, sigue intentando!','Completa tu algoritmo para cumplir con el objetivo','Recuerda que todos los pasos del algoritmo son importantes para cumplir con su objetivo'],
    msjOrden: ['Estas cerca, comprueba tus opciones.','Recuerda, un algoritmo es una serie de pasos correctamente ordenados.','El orden de los pasos no es el correcto, Revisa tu algoritmo y ordenalo correctamente.'],
    msjError: ['Ups, algo no anda bien. Intentalo de nuevo!','Tu algoritmo no cumple con el objetivo solicitado, intentalo de nuevo!','Ups, en tu algoritmo existen pasos que no cumplen o no son necesarios para cumplir con el objetivo'],

    init: function(){
      this.maxtime= 360;
      this.flagpause= false; 
      this.intro = true;  
      this.introStep = 0;
      this.nSituaciones=0;
      this.nCorrectas=0;
      this.nIntentos=0;

      //Se incluyen audios de juego
      this.errorSound = this.game.add.audio('errorSound');
      this.grabSound = this.game.add.audio('grabSound');
      this.soltarSound = this.game.add.audio('soltarSound');
      this.btnSound = this.game.add.audio('btnSound');
      this.bienSound = this.game.add.audio('bienSound');
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data'));
      this.situaLength = this.levelData.dataSitua.length;//Cantidad de situaciones de nivel

      this.game.world.setBounds(0, 0, 800, 600);//Limites de escenario
      this.introImg = this.game.add.tileSprite(0, 0,800,600, 'introN1');//Imagen intro de juego
      this.introImg2 = null;
      this.game.input.onDown.add(this.iniciarJuego,this);
      this.txtIntro = this.game.add.bitmapText(195, 300, 'fontData', 'Bienvenido, en este nivel aprenderás las bases para el manejo de algoritmos. Por medio de diversas situaciones cotidianas o aplicadas a problemas deberás conformar algoritmos que los resuelvan.\n\nSuerte!', 24);
      this.txtIntro.anchor.setTo(0.5,0.5);
      this.txtIntro.maxWidth = 250;
    },

    iniciarJuego : function(game){
      var x1 = 115;
      var x2 = 264;
      var y1 = 480;
      var y2 = 550;
      if(this.intro){
        switch(this.introStep){
          case 0:
            if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
              this.btnSound.play();
              this.introStep++;
              this.introImg.kill();//Se elimina imagen de intro
              this.introImg2 = this.game.add.sprite(0,0,'ayudaGeneral',0);
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
      this.intro = false;//Se deshabilita el intro de juego
      this.introImg2.kill();//Se elimina imagen de intro

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel1');//Fondo de juego
      this.situaGroup = this.game.add.group();//GRupo para control de fondo situacion e img situacion
      this.marcoSitua = this.game.add.sprite(15,50,'fondoSit');//Fondo de situacion
      this.situaGroup.add(this.marcoSitua);
      this.game.add.sprite(345,55,'fondoSlot');//Fondo de slots
      this.random = Math.floor(Math.random() * this.situaLength);//Se realiza la carga de una situación de forma aleatoria
      this.slotGroup = this.game.add.group();//Se realiza creacion de grupo de slots
      this.accionGroup = this.game.add.group();//Se realiza creacion de grupo de acciones
      this.crearSitua(this.random);//Crear situacion de acuerdo al parametro aleatorio generado
      this.btnValidar = this.game.add.button(495,335,'btnConfirmar',this.ejecutar,this);

      this.alert = new Alert(this.game);//Creacion onjeto de alerta

      //Se define el timer de nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.tiempo.start();

      //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(((this.game.width)/2), 2,'time');
      this.cuadroTime.anchor.setTo(0.5, 0);
      this.cuadroTime.fixedToCamera = true;
      //Se setea el texto para el cronometro
      this.timer = this.game.add.bitmapText((this.game.width/2), 20, 'font', '00:00', 28);//this.game.add.text(((this.game.width)/2), 15 , '00:00', { font: '32px calibri', fill: '#000',align:'center' });
      this.timer.anchor.setTo(0.5, 0);

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
        //Se obtienen las posiciones del cursor en el juego
        var mouseX = this.game.input.x;
        var mouseY = this.game.input.y;
        //Se realiza movimiento de item seleccionado
        this.accionGroup.forEach(function(accion) {          
          if(accion.movimiento == true){//Se verifican los items para realizar su movimiento en caso de click
            accion.x = mouseX
            accion.y = mouseY;
          }
        });
        //Se realiza el movimiento del texto en conjunto con el item
        if(this.itemSelec == true){
          this.textoItem.x =  mouseX;
          this.textoItem.y =  mouseY;
        }
      }
    },

    crearSitua: function(nSitua){
      if(this.maxtime >= 3){//En caso de quedar 3 segundos de juego la situacion no es tenida en cuenta
        this.nSituaciones++;//Aumento de conteo situaciones stats
      }
      var keySitua = '';
      if(this.levelData.dataSitua[nSitua].situaImg){//En caso de contar con imagen para la situacion
        keySitua = 'situa' + (nSitua+1);//Generacion nombre llave de imagen de acuerdo a situacion
      }else{
        keySitua = 'situacion0';//Situacion generica en caso de no contar con imagen
      }
      this.imgSitua = this.game.add.sprite(35,70,keySitua);
      this.situaGroup.add(this.imgSitua);//Creacion imagen situacion
      this.marcoSitua.bringToTop();
      this.situaGroup.updateZ();

      this.txtSitua = this.game.add.bitmapText(35, 330, 'font', this.levelData.dataSitua[nSitua].situaTxt,24);//Se agrega texto de situacion
      this.txtSitua.maxWidth = 280;
      this.txtSitua.align = "center";
      this.situaGroup.add(this.txtSitua);

      //Se realiza creación de slots de acuerdo a numero de pasos de situacion
      var fila = Math.ceil(this.levelData.dataSitua[nSitua].nPasos/2);//Se define el numero de columnas
      var par = (this.levelData.dataSitua[nSitua].nPasos % 2 == 0)?true:false;//Numero par de slots?
      var contSlot = 0;
      var yIniSl = 80;//Definicion posicion y Inicial para slot
      
      for(var i=0;i<fila;i++){
        var xIniSl = 350;//Definicion posicion x Inicial para slot
        for(var j=0;j<2;j++){
          if(!par && j == 1 && (i == (fila-1))){//En caso de ser numero impar de pasos, no se realiza la creacion del ultimo slot
            break;
          }
          var slot = this.game.add.sprite(xIniSl,yIniSl,'slot');//Creacion slot
          slot.nPaso = contSlot;//Asiganacion de nummero de paso para slot
          slot.txtPaso = this.game.add.bitmapText((slot.x + slot.width - 15), slot.y+5, 'font', (slot.nPaso+1).toString(), 14);
          contSlot++;//Incremento de paso para siguiente slot
          this.slotGroup.add(slot);//Se incluye el elemento creado en el grupo de slots
          //this.slotGroup.add(slot.txtPaso);
          xIniSl += 220;//Aumento x para siguiente slot          
        }
        yIniSl += 55;//Aumento y para siguiente slot
      }

      //Se realiza creación de acciones o pasos de acuerdo a la situacion
      var xIniAcc = 150;//Definicion posicion X inicial para acciones
      var yIniAcc = 400;//Definicion posicion Y inicial para acciones
      var thisTemp = this;
      var cont = 0;//Contador para control de creacion de acciones
      this.levelData.dataSitua[nSitua].accion.forEach(function(data){
        var accion = thisTemp.game.add.sprite(xIniAcc,yIniAcc,'fondoAcc');//Creacion objeto de accion
        accion.texto = thisTemp.game.add.bitmapText(accion.x, accion.y, 'font', data.txt,18);//Se agrega el texto de la accion
        accion.texto.maxWidth = accion.width - 5;
        accion.texto.anchor.setTo(0.5,0.5);
        accion.xPos = accion.x;//Variable para control de retorno de posicion en X
        accion.yPos = accion.y;//Variable para control de retorno de situacion en Y
        accion.anchor.setTo(0.5,0.5);
        if(data.ok){//La accion es correcta para la situacion?
          accion.ok = true;
          accion.nPaso = data.n;//Se asigna el numero de paso correspondiente a la accion
        }
        accion.inputEnabled = true;//Se habilitan eventos para input
        accion.events.onInputDown.add(thisTemp.clickItem, thisTemp);//Se agrega evento de presionar click
        accion.events.onInputUp.add(thisTemp.releaseItem, thisTemp);//Se agrega evento de soltar click
        thisTemp.accionGroup.add(accion);//Se incluye el elemento creado en el grupo de acciones
        thisTemp.accionGroup.add(accion.texto);//Se incluye el elemento creado en el grupo de acciones
        
        xIniAcc += accion.width + 15;//Aumento de posicion en X para proximos elementos
        cont++;
        if(cont == 3){//Al crear 3 acciones en la misma fila
          cont = 0;
          xIniAcc = 150;
          yIniAcc += accion.height + 15;
        }
      });
      this.revolverItems();
    },

    limpiarSitua: function(){
      if(this.imgSitua){
        this.imgSitua.destroy();
      }
      this.txtSitua.text = '';
      this.slotGroup.removeAll();
      this.accionGroup.removeAll();
    },

    revolverItems: function(){
      var posiciones = [];//Array de control para asignacion de posiciones de elementos
      for(var i=0;i<this.levelData.dataSitua[this.random].accion.length;i++){//LLenado inicial array de control
        posiciones[i] = false;
      }
      var i = 0;//Contador para control i
      var j = 0;//Contador para control j
      this.accionGroup.forEach(function(item){//Asignacion de nuevas posiciones
        if(item.hasOwnProperty('texto')){//Determina si el objeto es principal o texto 
          var continuar = true;
          var posRandom = Math.floor(Math.random()*posiciones.length);//Posicion aleatorio para la accion
          while(continuar){
            if(!posiciones[posRandom]){
              i = posRandom % 3;
              j = Math.floor(posRandom / 3);
              item.newX = 150 + (item.width + 15) * i + 15;
              item.newY = 420 + (item.height + 5) * j;
              posiciones[posRandom] = true;
              continuar = false;
            }else{
              posRandom = Math.floor(Math.random()*posiciones.length);//Posicion aleatorio para la accion
            }
          }
        }
      });
      this.accionGroup.forEach(function(item){//Posicionamiento con animacion
        if(item.hasOwnProperty('texto')){//Determina si el objeto es principal o texto 
          item.game.add.tween(item).to({x:(item.newX),y:(item.newY)}, 350, Phaser.Easing.Linear.None, true);
          item.game.add.tween(item.texto).to({x:(item.newX),y:(item.newY)}, 350, Phaser.Easing.Linear.None, true);
          item.xPos = item.newX;//Variable para control de retorno de posicion en X
          item.yPos = item.newY;//Variable para control de retorno de situacion en Y
        }
      });
    },

    retirarItems: function(){
      var thisTemp = this;
      this.accionGroup.forEach(function(item){
        if(item.hasOwnProperty('texto')){
          item.x = item.xPos;
          item.y = item.yPos;
          thisTemp.releaseItem(item);
        }
      });
    },

    clickItem: function(item){
      if(!this.alert.visible && this.maxtime > 0){
        this.grabSound.play();
        this.itemSelec = true;//Se habilita la seleccion de item para movimiento
        this.textoItem = item.texto;//Se establece el texto del item seleccionado para movimiento
        item.movimiento = true;//Se habilita el movimiento del item
        //Se actualizan las posiciones en Z del grupo de acciones para posicionar el seleccionado sobre todo
        item.anchor.setTo(0.5,0.5);
        item.texto.anchor.setTo(0.5,0.5);
        item.bringToTop(); 
        item.texto.parent.bringToTop(item.texto);
        this.accionGroup.updateZ();
      }
    },

    releaseItem: function(item){
      if(!this.alert.visible){
        this.itemSelec = false;
        this.textoItem = null;
        item.movimiento = false;

        //En caso de retirar elemento de algun slot
        if(item.hasOwnProperty('slot')){
          var oldSlot = this.slotGroup.getAt(item.slot);//Se obtiene el objeto de slot 
          //Se realiza limpieza de variable
          delete oldSlot.valido;
          delete oldSlot.accion;
        }

        var sobreSlot = false;//Variable de control posicion sobre slot
        //Se valida el elemento contra cada slot validando posiciones correctas
        var thisTemp = this;
        this.slotGroup.forEach(function(slot){
          if(item.x > slot.x && item.x < (slot.x + slot.width)){
            if(item.y > slot.y && item.y < (slot.y + slot.height)){              
              if(slot.accion != null){
                //Se realiza una busqueda del item que se encuentra en el slot
                thisTemp.accionGroup.forEach(function(oldAccion){
                  if(item.slot != null){
                    //si el nuevo item viene de un slot anterior
                    var oldSlot = thisTemp.slotGroup.getAt(item.slot);//Se obtiene el objeto de slot 
                    if(oldAccion.slot == slot.nPaso){
                      oldAccion.slot = oldSlot.nPaso;
                      oldAccion.anchor.setTo(0,0);
                      oldAccion.x = oldSlot.x;//Se establece la posicion X del elemento sobre el slot
                      oldAccion.y = oldSlot.y;//Se establece la posicion Y del elemento sobre el slot                    
                      oldAccion.texto.x = oldSlot.x + (oldAccion.width/2);//Se establece la posicion en X para el texto sobre el slot
                      oldAccion.texto.y = oldSlot.y + (oldAccion.height/2);//Se establece la posicoin en Y para el texto sobre el slot                    
                      oldAccion.texto.anchor.setTo(0.5,0.5);
                      
                      oldSlot.valido = oldAccion.ok?true:false;//Se establece el slot como valido o no de acuerdo a la accion relacionada
                      oldSlot.accion = oldAccion.ok?oldAccion.nPaso:0;//Se designa el numero de paso sobre el slot de acuerdo a la accion
                    }
                  }else
                  {
                    if(oldAccion.slot == slot.nPaso){
                      //El item que se encuentra en el slot pasara a la posicion del item nuevo
                      delete oldAccion.slot;
                      oldAccion.anchor.setTo(0.5,0.5);
                      oldAccion.x = oldAccion.xPos;//Se establece la posicion X del elemento sobre el slot
                      oldAccion.y = oldAccion.yPos;//Se establece la posicion Y del elemento sobre el slot                    
                      oldAccion.texto.x = oldAccion.xPos;//Se establece la posicion en X para el texto sobre el slot
                      oldAccion.texto.y = oldAccion.yPos ;//Se establece la posicoin en Y para el texto sobre el slot                    
                      oldAccion.texto.anchor.setTo(0.5,0.5);
                    }
                  }
                });
              }            

              sobreSlot = true;
              item.slot = slot.nPaso;
              item.anchor.setTo(0,0);
              item.x = slot.x;//Se establece la posicion X del elemento sobre el slot
              item.y = slot.y;//Se establece la posicion Y del elemento sobre el slot
              item.texto.anchor.setTo(0.5,0.5);
              item.texto.x = slot.x + (item.width/2);//Se establece la posicion en X para el texto sobre el slot
              item.texto.y = slot.y + (item.height/2);//Se establece la posicoin en Y para el texto sobre el slot

              slot.valido = item.ok?true:false;//Se establece el slot como valido o no de acuerdo a la accion relacionada
              slot.accion = item.ok?item.nPaso:0;//Se designa el numero de paso sobre el slot de acuerdo a la accion
            }
          }
        });

        if(!sobreSlot){//En caso de liberar el item sin posicionarlo sobre ningun slot
          delete item.slot;
          item.anchor.setTo(0.5,0.5);//Eje de objeto retorna al centro
          item.x = item.xPos;//Se retorna la posicion inicial X del elemento
          item.y = item.yPos;//Se retorna la posicion inicial Y del elemento
          item.texto.anchor.setTo(0.5,0.5);
          item.texto.x = item.xPos;//Se retorna la posicion inicial X del texto
          item.texto.y = item.yPos;//Se retorna la posicion inicial Y del elemento
        }else{
          this.soltarSound.play();
        }
      }
    },

    ejecutar: function () {
      if(!this.alert.visible && this.maxtime > 0){
        this.nIntentos++;//Aumento conteo numero de intentos

        //Se realiza validacion de acciones sobre slots
        var cont = 0;//Conteo de acciones sobre slots
        var thisTemp = this;
        var control = true;//Control para etapas de validacion
        this.slotGroup.forEach(function(slot){//Conteo y control de slots llenos
          if(!slot.hasOwnProperty('accion')){
            control = false;
            thisTemp.errorSound.play();
            thisTemp.alert.show(thisTemp.msjVacios[Math.floor(Math.random()*thisTemp.msjVacios.length)]);
            return;
          }
        });
        if(control){//Habilitacion para nueva validacion
          this.slotGroup.forEach(function(slot){//Control de slots con elementos invalidos
            if(!slot.valido){
              control = false;
              thisTemp.retirarItems();
              thisTemp.revolverItems();
              thisTemp.errorSound.play();
              thisTemp.alert.show(thisTemp.msjError[Math.floor(Math.random()*thisTemp.msjError.length)]);
              return;
            }
          });
        }
        if(control){//Habilitacion para nueva validacion
          this.slotGroup.forEach(function(slot){//Control de slots con elementos en orden correcto
            if(slot.nPaso != slot.accion){
              control = false;
              thisTemp.errorSound.play();
              thisTemp.alert.show(thisTemp.msjOrden[Math.floor(Math.random()*thisTemp.msjOrden.length)]);
              return;
            }
          });
        }

        //En caso de superar cada validacion, acciones de situacion correcta
        if(control){
          this.bienSound.play();
          this.nCorrectas++;//Aumento conteo situacion superada

          this.limpiarSitua();
          this.random = Math.floor(Math.random() * this.situaLength);//Se realiza la carga de una situación de forma aleatoria
          this.crearSitua(this.random);
        }
      }
    },

    updateTimer: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){
        this.showStats();
        //Detener metodo de update
        this.tiempo.stop();
        //this.btnPausa.kill();
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
      if (segundos < 10){
        segundos = '0' + segundos;
      }
      if (minutos < 10){
        minutos = '0' + minutos;
      }
      this.timer.setText(minutos + ':' +segundos);
    },

    showStats: function(){
      this.btnPausa.kill();//Se retira el boton de pausa
      this.retirarItems();//Retirar elementos de juego
      this.alert.hide();//REtirar alerta de retroalimentacion
      //Creacion cuadro retroalimentación final
      this.retroFinal = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'final1');
      this.retroFinal.anchor.setTo(0.5,0.5);
      this.btnMenu = this.game.add.button(410,370,'OpcPausa',this.pnlPausa.menuBtn,this,this.game);//Se agrega boton para retornar a menu
      this.btnMenu.frame = 2;
      this.btnRepetir = this.game.add.button(335,370,'OpcPausa',this.pnlPausa.repetirBtn,this,this.game);//Se agrega boton para repetir nivel
      this.btnRepetir.frame = 0;

      this.txtStats = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 170, 'font_white', '# de situaciones: '+this.nSituaciones.toString()+'\n# de intentos: '+this.nIntentos.toString()+'\n# de aciertos: '+this.nCorrectas.toString(), 28);
      this.txtStats.anchor.setTo(0.5,0.5);

      //Asignacion de porcentaje de nivel
      var porcIni = (this.nCorrectas * 100)/this.nIntentos;
      var porcEva = (this.nCorrectas * porcIni)/100;
      if(this.nCorrectas > 0){
        this.porcentaje = Math.ceil((porcEva/this.nIntentos) * 100);
      }else{
        this.porcentaje = 0;
      }
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
  
  module.exports = Nivel1;
},{"../prefabs/alert":2,"../prefabs/pause":4}],10:[function(require,module,exports){
  'use strict';
  var Pausa = require('../prefabs/pause');

  function Nivel2() {}
  Nivel2.prototype = {
    //Definición de propiedades
    maxtime: 120,
    flagpause: false,
    intro:true,
    introStep:0,
    gravedad: {min:10,max:30},
    puntaje: 0,
    vidas: 5,
    intentos:0,
    aciertos:0,
    lastSituacion: -1,

    init: function(){
      this.maxtime= 120;
      this.flagpause= false; 
      this.intro = true; 
      this.introStep = 0; 
      this.puntaje = 0;
      this.vidas = 5;
      this.intentos = 0;
      this.aciertos = 0;
      this.lastSituacion = -1;

      //Audios de nivel
      this.btnSound = this.game.add.audio('btnSound');
      this.cambioSound = this.game.add.audio('cambioSound');
      this.feedSound = this.game.add.audio('feedSound');
      this.malSound = this.game.add.audio('malSound');
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data2'));

      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.introImg = this.game.add.tileSprite(0, 0,800,600, 'introN2');
      this.introImg2 = null;
      this.game.input.onDown.add(this.iniciarJuego,this);
      this.txtIntro = this.game.add.bitmapText(610, 300, 'fontData', 'Hola, con el fin de aprender sobre los diferentes tipos de dato básico, en este nivel deberas relacionar los diferentes datos que van cayendo frente al tipo de dato solicitado.\n\nAdelante!', 24);
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
              this.introImg2 = this.game.add.sprite(0,0,'ayudaGeneral',1);
            }          
            break;
          case 1:
            this.btnSound.play();
            this.empezar();
            break;
        }
      }
    },

    empezar: function() {
      this.intro = false;//Se deshabilita el intro de juego
      this.introImg2.kill();//Se elimina imagen de intro

      //Habilitacion de fisicas
      this.physics = this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.world.setBounds(0, 0, 800, 600);//Limites de escenario
      //Se define el timer de nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.tiempo.loop(3500, this.crearItem, this);//Creacion de items
      this.tiempo.loop(6000,this.crearItemBonus,this);//Creacion de items dorados
      this.tiempo.loop(15000, this.solicitud, this);//Cambio de solicitud cada 15 segundos
      this.tiempo.start();

      this.game.add.tileSprite(0, -40,800,600, 'tile_nivel2');//Fondo de juego
      //Creacion del piso
      this.platafGroup = this.game.add.group();
      this.platafGroup.enableBody = true;
      var ground = this.game.add.tileSprite(0, this.game.world.height - 40, 800, 40, 'piso');
      //Piso objeto de colision
      this.platafGroup.add(ground);
      ground.body.immovable = true;
      ground.desplazamiento = 0;

      //Se realiza creacion del jugador
      this.jugador = this.game.add.sprite(32, 490, 'personaje',15);
      this.game.physics.arcade.enable(this.jugador);//Habilitacion de fisicas sobre el jugador
      this.jugador.body.gravity.y = 550;//Gravedad de jugador
      this.jugador.body.collideWorldBounds = true;//Colisionar contra limites de escenario

      //Se definen las animaciones del jugador
      this.jugador.animations.add('left', [14,13,12,11,10,9,8,7], 15, true);
      this.jugador.animations.add('right', [16,17,18,19,20,21,22,23], 15, true);
      this.jugador.animations.add('jump', [31,32,33,34,35,36,37,38,39], 15, true);
      this.jugador.animations.add('jump_left', [6,5,4,3,2,1,0], 15, true);
      this.jugador.animations.add('jump_right', [24,25,26,27,28,29,30], 15, true);

      //Creacion del grupo de items
      this.itemsGroup = this.game.add.group();
      this.itemsGroup.enableBody = true;//Habilitacion de colisiones 
      
      //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(((this.game.width)/2), 5,'time');
      this.cuadroTime.anchor.setTo(0.5, 0);
      this.cuadroTime.fixedToCamera = true;
      this.timer = this.game.add.bitmapText((this.game.width/2), 20, 'font', '00:00', 28);//Se setea el texto para el cronometro
      this.timer.anchor.setTo(0.5, 0);

      this.cursors = this.game.input.keyboard.createCursorKeys();//Se agregan cursores de control de movimiento

      //Creacion vida de jugador
      this.vidaGroup = this.game.add.group();
      for(var i=0;i<this.vidas;i++){
        var vida = this.game.add.sprite(45+(57*i),23,'vida');
        vida.n = i;
        this.vidaGroup.add(vida);
      }      
      this.vidaGroup.add(this.game.add.sprite(10,10,'fondoVida'));

      //Creacion de solicitud de nivel
      this.txtSolicitud = this.game.add.sprite(680, 450, 'solicitud', 0);
      this.solicitud();   
      this.txtPuntaje = this.game.add.bitmapText(680, 480, 'font', '0', 28);//Creacion texto para puntaje

      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

      //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego,this);
    },

    solicitud: function(){
      var repetido= true;
      while(repetido){        
        this.tipoSolicitud = Math.floor(Math.random()*(this.levelData.dataTipo.length - 1));

        if(this.tipoSolicitud == this.lastSituacion){
          repetido = true;
        }else {
          repetido = false;
        }
      }
      this.lastSituacion = this.tipoSolicitud;
      this.txtSolicitud.frame = this.tipoSolicitud;
      this.cambioSound.play();
    },

    update: function() {
      if(!this.intro){
        this.game.physics.arcade.collide(this.jugador, this.platafGroup);//Colisiones entre jugador y plataforma piso
        this.game.physics.arcade.overlap(this.jugador, this.itemsGroup, this.recogerItem, null, this);//Se define metodo llamado de colision para item - jugador
        this.jugador.body.velocity.x = 0;//Reseteo de velocidad horizontal si no se presentan acciones sobre el jugador
        //Movimiento de jugador
        if (this.cursors.left.isDown){//Movimiento a la izquierda
          this.jugador.body.velocity.x = -200;
          this.jugador.animations.play('jump_left');//Se muestra animacion de salto
        }else if (this.cursors.right.isDown){//Movimiento a la derecha
          this.jugador.body.velocity.x = 200;
          this.jugador.animations.play('jump_right');//Se muestra animacion de salto
        }else{//Idle          
          this.jugador.animations.stop();
          this.jugador.frame = 15;
        }

        this.itemsGroup.forEach(function(item){
          item.texto.x = item.x;
          item.texto.y = item.y - 25;

          if(item.y>item.game.height){
            item.texto.destroy();
            item.destroy();

          }
        });
      }
    },

    crearItem: function(){     
      for (var i = 0; i < 5; i++){
        var random = Math.floor(Math.random()*2);//Probabilidad de creacion de item de 50%
        if(random == 1){//En caso de creacion
          var tipo = Math.floor(Math.random() * this.levelData.dataTipo.length);//Numero aleatorio para determinar tipo de data de juego
          var xItem = Math.floor(Math.random() * (this.game.width - 50)) + 32;//Posiicion de creacion aleatoria en X
          var yItem = -64;//Posicion inicial en Y
          var item = this.itemsGroup.create(xItem, yItem, 'item', 0);//Creacion de item sobre el grupo de items
          item.tipo = tipo;//Asignacion de tipo aleatorio
          
          item.anchor.setTo(0.5,0.5);
          var txtIndex = Math.floor(Math.random()*this.levelData.dataTipo[tipo].exp.length);//Indice texto aleatorio de acuerdo al tipo en data de juego
          item.texto = this.game.add.bitmapText(item.x, item.y, 'fontData',this.levelData.dataTipo[tipo].exp[txtIndex], 16);//Creacion texto
          item.texto.anchor.setTo(0.5,-0.8);

          item.body.gravity.y = Math.floor(Math.random()*this.gravedad.max)+this.gravedad.min;//Se agrega gravedad al objeto
        }
      }
    },

    crearItemBonus: function(){
      var probBonus = 20 * this.vidas;
      if(Math.floor(Math.random()*100) > probBonus){
        var tipo = Math.floor(Math.random() * this.levelData.dataTipo.length);//Numero aleatorio para determinar tipo de data de juego
        var xItem = Math.floor(Math.random() * (this.game.width - 50)) + 32;//Posiicion de creacion aleatoria en X
        var yItem = -64;//Posicion inicial en Y
        var item = this.itemsGroup.create(xItem, yItem, 'item',1);//Creacion de item sobre el grupo de items
        item.tipo = tipo;//Asignacion de tipo aleatorio
        item.bonus = true;
        item.anchor.setTo(0.5,0.5);
        var txtIndex = Math.floor(Math.random()*this.levelData.dataTipo[tipo].exp.length);//Indice texto aleatorio de acuerdo al tipo en data de juego
        item.texto = this.game.add.bitmapText(item.x, item.y, 'fontData',"*" +this.levelData.dataTipo[tipo].exp[txtIndex] +"*"  , 16);//Creacion texto
        item.texto.anchor.setTo(0.5,-0.8);

        item.body.gravity.y = Math.floor(Math.random()*this.gravedad.max)+this.gravedad.min;//Se agrega gravedad al objeto
      }
    },

    recogerItem: function (jugador, item) {      
      this.intentos++;      
      if(this.tipoSolicitud == item.tipo){//Se comprueba que el item seleccionado sea el mismo tipo de la solicitud
        this.aciertos++;
        this.feedSound.play();
        if(item.bonus == true){
          this.vidas++;
          this.updateVidas();//Se actualiza la barra de vida
        }
        this.puntaje+=20;
      }else{//En caso de ser un elemento diferente al tipo solicitad
        this.malSound.play();
        if(item.bonus == true){
          this.vidas--;
        }
        this.vidas--;//Se realiza la eliminacion de una vida
        this.updateVidas();//Se actualiza la barra de vida
      }
      this.txtPuntaje.text = this.puntaje;
      item.texto.destroy();
      item.destroy();
    },

    updateVidas: function(){
      var thisTemp = this;
      this.vidaGroup.forEach(function(vida){//Se realiza recorrido sobre vidas para asignar o no visibilidad de acuerdo a la cantidad de vidas del jugador
        if(vida.hasOwnProperty('n')){
          if(vida.n>thisTemp.vidas-1){            
            vida.visible = false;
          }else{
            vida.visible = true;
          }
        }
      });
      //Se valida si el jugador perdio todas las vidas
      if(this.vidas <= 0){
        this.showStats();
        //Detener metodo de update
        this.tiempo.stop();
        //Eliminar items restantes en el campo
        this.itemsGroup.forEach(function(item) {
          item.texto.destroy();
          item.kill();
        });
      }
    },

    updateTimer: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){

        this.showStats();
        //Detener metodo de update
        this.tiempo.stop();
        //Eliminar items restantes en el campo
        this.itemsGroup.forEach(function(item) {
          item.texto.destroy();
          item.kill();
        });
        //this.btnPausa.kill();
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

    showStats: function(){      
      this.btnPausa.kill();//Se retira el boton de pausa
      //Creacion cuadro retroalimentación final
      this.retroFinal = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'final2');
      this.retroFinal.anchor.setTo(0.5,0.5);
      this.btnMenu = this.game.add.button(410,370,'OpcPausa',this.pnlPausa.menuBtn,this,this.game);//Se agrega boton para retornar a menu
      this.btnMenu.frame = 2;
      this.btnRepetir = this.game.add.button(335,370,'OpcPausa',this.pnlPausa.repetirBtn,this,this.game);//Se agrega boton para repetir nivel
      this.btnRepetir.frame = 0;

      this.txtStats = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 170, 'font_white', '# de intentos: '+this.intentos.toString()+'\n# de aciertos: '+this.aciertos.toString(), 28);
      this.txtStats.anchor.setTo(0.5,0.5);

      //Asignacion de porcentaje de nivel
      var porc = ((this.aciertos/this.intentos) * 100).toFixed();
      
      
      this.txtPorc = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 125, 'font_white', porc.toString() + '%', 40);
      this.txtPorc.anchor.setTo(0.5,0.5);

      //Asignacion de estrellas
      if(porc > 0){//1 estrella
        this.game.add.sprite(221,227,'estrella');
      }
      if(porc > 49){//2 estrellas
        this.game.add.sprite(348,227,'estrella');
      }
      if(porc > 99){//3 estrellas
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
  
  module.exports = Nivel2;

},{"../prefabs/pause":4}],11:[function(require,module,exports){
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
    introStep:0,
    movimiento: 0,
    gusanoGroup: null,
    cuerpoGroup: null,
    itemGroup: null,
    res: 0,
    pasoActual: 0,
    habilMov: true,
    countErrors: 0,

    msjError: ['Ups, recuerda que la prioridad de los operadoes es importante','Recuerda la prioridad de los operadores:\n1. div , mod , * , /\n 2. +, -','Cuando la expresión presenta dos operadores de la misma prioridad se resuelve de izquierda a derecha','Recuerda; en caso de parentesis, estos se deben resolver primero comenzando por el más interno'],
    
    init: function(){
      this.maxtime= 120;
      this.flagpause= false; 
      this.intro = true;
      this.introStep = 0; 
      this.movimiento = 0;
      this.gusanoGroup = [];
      this.cuerpoGroup = [];
      this.itemGroup = [];
      this.pasoActual = 0;
      this.habilMov = true;
      this.countErrors = 0;

      //Se incluyen audios de juego
      this.btnSound = this.game.add.audio('btnSound');
      this.feedSound = this.game.add.audio('feedSound');
      this.malSound = this.game.add.audio('malSound');
      this.cambioSound = this.game.add.audio('cambioSound');
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data3'));
      this.situaLength = this.levelData.dataGusano.length;//Cantidad de situaciones de nivel

      this.game.world.setBounds(0, 0, 800, 600);//Limites de escenario
      this.introImg = this.game.add.tileSprite(0, 0,800,600, 'introN3');//Imagen intro de juego
      this.introImg2 = null;
      this.game.input.onDown.add(this.iniciarJuego,this);      
      this.txtIntro = this.game.add.bitmapText(195, 300, 'fontData', 'Bienvenido, en este nivel empezaremos con el manejo de expresiones, especificamente la evaluación de las mismas, Para ello, deberas evaluar cada expresión presentada de forma correcta.\n\nAdelante!', 24);  
      this.txtIntro.anchor.setTo(0.5,0.5);  
      this.txtIntro.maxWidth = 250;  
    },

    iniciarJuego : function(game){
      var x1 = 115;
      var x2 = 264;
      var y1 = 480;
      var y2 = 550;
      if(this.intro){
        switch(this.introStep){
          case 0:
            if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
              this.btnSound.play();
              this.introStep++;
              this.introImg.kill();//Se elimina imagen de intro
              this.introImg2 = this.game.add.sprite(0,0,'ayudaGeneral',2);
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

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel3');//Fondo de juego
      this.tablero = new Tablero(this.game, 50, 20 ,12 , 10, 'tablero_3', 'tablero');//Creacion de tablero de movimiento
      this.gusano = this.tablero.setObjCuadro(Math.floor(Math.random()*this.tablero.xCuadros), Math.floor(Math.random()*this.tablero.yCuadros), 'gusano', null, 0);
      //this.game.physics.arcade.enable(this.gusano);//Habilitacion de fisicas sobre cabeza de gusano
      this.gusanoGroup.push(this.gusano);//Se incluye la cabeza de gusano en grupo de control
      this.cursors = this.game.input.keyboard.createCursorKeys();//Se agregan cursores de control de movimiento
      this.comerItem();//Creacion bolas iniciales de gusano
      this.comerItem();//Creacion bolas iniciales de gusano

      this.txtExp = this.game.add.bitmapText(this.game.world.centerX, 565, 'font', '', 28);//Texto de expresion
      this.txtExp.anchor.setTo(0.5,0.5);
      this.txtExp.align = "center";
      this.crearExpresion();//Primera expresion a evaluar

      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(/*500*/180, this.updateMov, this);//Actualizacion movimiento jugador
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
        if(!this.alert.visible){
          if(this.habilMov){
            if(this.cursors.right.isDown && this.movimiento != 1){//Movimiento a la derecha
              this.movimiento = 0;
              this.habilMov =false;
            }else if (this.cursors.left.isDown && this.movimiento != 0){//Movimiento a la izquierda
              this.movimiento = 1;
              this.habilMov =false;
            }else if (this.cursors.up.isDown && this.movimiento != 3){//Movimiento hacia arriba
              this.movimiento = 2;
              this.habilMov =false;
            }else if (this.cursors.down.isDown && this.movimiento != 2){//Movimiento hacia abajo
              this.movimiento = 3;
              this.habilMov =false;
            }          
          }
        }
      }
    },

    updateMov: function(){
      if(!this.alert.visible){
        this.nuevaBola = false;
        this.gusano.lasti = this.gusano.i;//Posicion actual X cabeza para siguiente elemento
        this.gusano.lastj = this.gusano.j;//Posicion actual Y cabeza para siguiente elemento
        //Movimiento cabeza de gusano
        switch(this.movimiento){
          case 0://Movimiento hacia la derecha
            if(this.gusano.i == this.tablero.xCuadros - 1){//Limite de tablero
              this.gusano.i = -1;
            }
            this.tablero.setObjCuadro(this.gusano.i+1,this.gusano.j,'',this.gusano,0);
            this.gusano.angle = 180;
            break;
          case 1://Movimiento hacia la izquierda
            if(this.gusano.i == 0){//Limite de tablero
              this.gusano.i = this.tablero.xCuadros;
            }
            this.tablero.setObjCuadro(this.gusano.i-1,this.gusano.j,'',this.gusano,0);
            this.gusano.angle = 0;
            break;
          case 2://Movimiento hacia arriba
            if(this.gusano.j == 0){//Limite de tablero
              this.gusano.j = this.tablero.yCuadros;
            }
            this.tablero.setObjCuadro(this.gusano.i,this.gusano.j-1,'',this.gusano,0);
            this.gusano.angle = 90;
            break;
          case 3://Movimiento hacie abajo
            if(this.gusano.j == this.tablero.yCuadros - 1){//Limite de tablero
              this.gusano.j = -1;
            }
            this.tablero.setObjCuadro(this.gusano.i,this.gusano.j+1,'',this.gusano,0);
            this.gusano.angle = -90;
            break;
        }
        this.habilMov = true;
        this.gusano.lastangle = this.gusano.angle;
        //Movimiento cuerpo gusano
        for(var i=1;i<this.gusanoGroup.length;i++){//Empieza en 1 para omitir la cabeza de gusano
          this.gusanoGroup[i].lasti = this.gusanoGroup[i].i;
          this.gusanoGroup[i].lastj = this.gusanoGroup[i].j;
          if(this.gusanoGroup[i].anguloTemp){//Control de giro a la derecha para control de angulo de animacion
            this.gusanoGroup[i].angle = this.gusanoGroup[i-1].lastangle;  
          }
          this.gusanoGroup[i].lastangle = this.gusanoGroup[i].angle;//Angulo de asignacion siguiente objeto
          this.tablero.setObjCuadro(this.gusanoGroup[i-1].lasti,this.gusanoGroup[i-1].lastj,'',this.gusanoGroup[i],1);//Nueva posicion 
          this.gusanoGroup[i].angle = this.gusanoGroup[i-1].lastangle;//Angulo inicial
          if(this.gusanoGroup[i+1]){//Control de giros y asignacion de codos de giro
            if(this.gusanoGroup[i].angle != this.gusanoGroup[i].lastangle){
              this.gusanoGroup[i].frame = 2;//Frame codo de giro            
              if(this.gusanoGroup[i].angle == -180){
                this.gusanoGroup[i].angleAngle = 180;
              }else{
                this.gusanoGroup[i].angleAngle = undefined;
              }
              if((this.gusanoGroup[i].lastangle+90 == this.gusanoGroup[i].angle) || (this.gusanoGroup[i].lastangle+90 == this.gusanoGroup[i].angleAngle)){//Giros direccion derecha              
                this.gusanoGroup[i].anguloTemp = true;//Control giro derecha
                switch(this.gusanoGroup[i].angle){//Asignacion angulo de giro
                  case 0:
                    this.gusanoGroup[i].angle = 90;
                    break;
                  case 90:
                    this.gusanoGroup[i].angle = 180;
                    break;
                  case -180:
                    this.gusanoGroup[i].angle = -90;
                    break;
                  case -90:
                    this.gusanoGroup[i].angle = 0;
                    break;
                }
              }else{
                this.gusanoGroup[i].anguloTemp = false;
              }
            }else{
              this.gusanoGroup[i].frame = 1;
              this.gusanoGroup[i].anguloTemp = false;
            }
          }else{
            this.gusanoGroup[i].frame = 1;
            this.gusanoGroup[i].anguloTemp = false;
          }
        }
      }
    },

    crearExpresion: function(){
      this.cambioSound.play();
      this.pasoActual = 0;//Reseteo de pasos de evaluacion a 0
      this.random = Math.floor(Math.random()*this.levelData.dataGusano.length);//Expresion aleatoria de data de juego
      this.txtExp.text = this.levelData.dataGusano[this.random].exp[this.pasoActual];//Asignacion texto de expresion
      this.res = eval(this.levelData.dataGusano[this.random].exp);//Resultado de expresion
      this.nuevoPaso();//Creacion primer paso
    },

    nuevoCuerpo: function(){
      this.cuerpoGroup.forEach(function(item){//Se realiza limpieza de bolas de gusano de posibles expresiones anteriores
        item.destroy();
        if(item.hasOwnProperty('txt')){
          item.txt.destroy();
        }
      });
      this.cuerpoGroup = [];
      for(var i=1;i<this.gusanoGroup.length;i++){//Limpieza grupo gusano
        this.gusanoGroup[i].destroy();
        if(this.gusanoGroup[i].hasOwnProperty('txt')){
          this.gusanoGroup[i].txt.destroy();
        }
      }
      this.gusanoGroup = [this.gusano];
      this.comerItem();//Creacion bola inicial de gusano
    },

    nuevoPaso: function(){
      this.itemGroup.forEach(function(item){//Se realiza limpieza de pasos en tablero de juego
        item.destroy();
        item.txt.destroy();
      });
      this.itemGroup = [];
      if(this.pasoActual == this.levelData.dataGusano[this.random].nPasos){//En caso de ser el ultimo paso
        this.crearExpresion();//Se realiza creacion de nueva expresion
      }else{//En caso de ser paso de expresion
        var thisTemp = this;
        var primerosPasos = this.levelData.dataGusano[this.random].pasos.filter(this.filtroPaso,this);//Filtro de pasos de acuerdo a paso actual
        primerosPasos.forEach(function(item){//Creacion de items en tablero de juego
          thisTemp.crearItem(item);
        });
        this.txtExp.text = this.levelData.dataGusano[this.random].exp[this.pasoActual];
      }
    },

    filtroPaso: function(obj){
      if(obj.n == this.pasoActual){
        return true;
      }else{
        return false;
      }
    },

    crearItem: function(obj){
      var xRandom = Math.floor(Math.random()*this.tablero.xCuadros);//Posicion X aleatoria para nuevo elemento
      var yRandom = Math.floor(Math.random()*this.tablero.yCuadros);//Posicion Y aleatoria para nuevo elemento
      var continuar = true;
      while(continuar){
        var sale = true;
        var thisTemp = this;
        this.itemGroup.forEach(function(item){
          if(item.i == xRandom && item.j == yRandom){
            xRandom = Math.floor(Math.random()*thisTemp.tablero.xCuadros);//Posicion X aleatoria para nuevo elemento
            yRandom = Math.floor(Math.random()*thisTemp.tablero.yCuadros);//Posicion Y aleatoria para nuevo elemento
            sale = false;
          }
        });
        if(sale){
          continuar = false;
        }
      }
      var item = this.tablero.setObjCuadro(xRandom, yRandom, 'itemGusano', null, 0);//Creacion item en tablero de juego
      if(obj){//ASignacion de propiedades
        item.ok = obj.ok;
        item.txt = this.tablero.setTexto(xRandom,yRandom, obj.txt);
      }
      this.itemGroup.push(item);
    },

    comerItem: function(cabeza, item){
      var continuar = true;
      if(item){
        if(item.ok){//En caso de item correcto de aceurdo al paso
          this.feedSound.play();
          this.pasoActual++;
          this.nuevoPaso();
        }else{//En caso de error 
          this.countErrors++;
          this.malSound.play();
          continuar = false;
          if((this.countErrors%5) == 0){
            this.alert.show(this.msjError[Math.floor(Math.random()*this.msjError.length)]);
          }          
        }
        item.destroy();//Eliminacion del item de tablero de juego
        item.txt.destroy();
      }
      if(continuar){//En caso de item correcto agrega una bola al cuerpo del gusano
        var bola = this.tablero.setObjCuadro(this.gusanoGroup[this.gusanoGroup.length-1].lasti, this.gusanoGroup[this.gusanoGroup.length-1].lastj, 'gusano', null, 1);
        bola.angle = this.gusanoGroup[this.gusanoGroup.length-1].lastangle;
        this.cuerpoGroup.push(bola);
        this.gusanoGroup.push(bola);
        this.nuevaBola = true;        
      }else{//En caso de item erroneo se remueven items del cuerpo del gusano
        if(this.gusanoGroup.length > 1){//En caso de contar con bolas para destruir
          var bola = this.cuerpoGroup[this.cuerpoGroup.length-1];
          this.cuerpoGroup.pop();
          this.gusanoGroup.pop();
          bola.destroy();
        }else{
          this.chocar();
        }
      }
    },

    chocar: function(cabeza, cuerpo){
      if(!this.nuevaBola){
        this.showStats();//Mostrar estadisticas
        //Detener metodo de update
        this.tiempo.stop();
      }
    },

    showStats: function(){
      this.porcentaje = 0;
      this.total = this.tablero.xCuadros * this.tablero.yCuadros;
      this.porcentaje = Math.floor((this.gusanoGroup.length * 100)/this.total);

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
  
  module.exports = Nivel3;
},{"../prefabs/alert":2,"../prefabs/pause":4,"../prefabs/tablero":5}],12:[function(require,module,exports){
  'use strict';
  var Pausa = require('../prefabs/pause');
  var Alert = require('../prefabs/alert');
  var Tablero = require('../prefabs/tablero');

  function Nivel4() {}

  Nivel4.prototype = {

    //Definición de propiedades globales de nivel
    maxtime: 120,
    flagpause: false,
    intro:true,
    introStep:0,
    movimiento: 0,
    gusanoGroup: null,
    cuerpoGroup: null,
    itemGroup: null,
    res: 0,
    pasoActual: 0,
    habilMov: true,
    bien: 0,
    countErrors: 0,

    msjError: ['Recuerda analizar a profundidad  el problema que se te esta presentando','No olvides usar los operadores correspondientes a la solicitud','Existen muchas formas de dar solución a un mismo problema, sin embargo aqui solo podrás seguir un camino'],

    init: function(){
      this.maxtime= 120;
      this.flagpause= false; 
      this.intro = true;
      this.introStep = 0; 
      this.movimiento = 0;
      this.gusanoGroup = [];
      this.cuerpoGroup = [];
      this.itemGroup = [];
      this.pasoActual = 0;
      this.habilMov = true;
      this.bien = 0;
      this.countErrors = 0;

      //Se incluyen audios de juego
      this.btnSound = this.game.add.audio('btnSound');
      this.feedSound = this.game.add.audio('feedSound');
      this.malSound = this.game.add.audio('malSound');
      this.cambioSound = this.game.add.audio('cambioSound');
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data4'));
      this.situaLength = this.levelData.dataGusano.length;//Cantidad de situaciones de nivel

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
              this.introImg2 = this.game.add.sprite(0,0,'ayudaGeneral',3);
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
      this.tablero = new Tablero(this.game, 50, 20 ,12 , 10, 'tablero_4', 'tablero_');//Creacion de tablero de movimiento
      this.gusano = this.tablero.setObjCuadro(Math.floor(Math.random()*this.tablero.xCuadros), Math.floor(Math.random()*this.tablero.yCuadros), 'gusano_4', null, 0);
      //this.game.physics.arcade.enable(this.gusano);//Habilitacion de fisicas sobre cabeza de gusano
      this.gusanoGroup.push(this.gusano);//Se incluye la cabeza de gusano en grupo de control
      this.cursors = this.game.input.keyboard.createCursorKeys();//Se agregan cursores de control de movimiento

      this.txtExp = this.game.add.bitmapText(this.game.world.centerX, 565, 'font', '', 24);//Texto de expresion
      this.txtExp.anchor.setTo(0.5,0.5);
      this.txtExp.maxWidth = 500;
      this.txtExp.align = "center";
      this.crearExpresion();//Primera expresion a evaluar

      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(/*500*/180, this.updateMov, this);//Actualizacion movimiento jugador
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
        if(!this.alert.visible){
          if(this.habilMov){
            if(this.cursors.right.isDown && this.movimiento != 1){//Movimiento a la derecha
              this.movimiento = 0;
              this.habilMov =false;
            }else if (this.cursors.left.isDown && this.movimiento != 0){//Movimiento a la izquierda
              this.movimiento = 1;
              this.habilMov =false;
            }else if (this.cursors.up.isDown && this.movimiento != 3){//Movimiento hacia arriba
              this.movimiento = 2;
              this.habilMov =false;
            }else if (this.cursors.down.isDown && this.movimiento != 2){//Movimiento hacia abajo
              this.movimiento = 3;
              this.habilMov =false;
            }          
          }
        }
      }
    },

    updateMov: function(){
      if(!this.alert.visible){
        this.nuevaBola = false;
        this.gusano.lasti = this.gusano.i;//Posicion actual X cabeza para siguiente elemento
        this.gusano.lastj = this.gusano.j;//Posicion actual Y cabeza para siguiente elemento
        //Movimiento cabeza de gusano
        switch(this.movimiento){
          case 0://Movimiento hacia la derecha
            if(this.gusano.i == this.tablero.xCuadros - 1){//Limite de tablero
              this.gusano.i = -1;
            }
            this.tablero.setObjCuadro(this.gusano.i+1,this.gusano.j,'',this.gusano,0);
            this.gusano.angle = 180;
            break;
          case 1://Movimiento hacia la izquierda
            if(this.gusano.i == 0){//Limite de tablero
              this.gusano.i = this.tablero.xCuadros;
            }
            this.tablero.setObjCuadro(this.gusano.i-1,this.gusano.j,'',this.gusano,0);
            this.gusano.angle = 0;
            break;
          case 2://Movimiento hacia arriba
            if(this.gusano.j == 0){//Limite de tablero
              this.gusano.j = this.tablero.yCuadros;
            }
            this.tablero.setObjCuadro(this.gusano.i,this.gusano.j-1,'',this.gusano,0);
            this.gusano.angle = 90;
            break;
          case 3://Movimiento hacie abajo
            if(this.gusano.j == this.tablero.yCuadros - 1){//Limite de tablero
              this.gusano.j = -1;
            }
            this.tablero.setObjCuadro(this.gusano.i,this.gusano.j+1,'',this.gusano,0);
            this.gusano.angle = -90;
            break;
        }
        this.habilMov = true;
        this.gusano.lastangle = this.gusano.angle;
        //Movimiento cuerpo gusano
        for(var i=1;i<this.gusanoGroup.length;i++){//Empieza en 1 para omitir la cabeza de gusano
          this.gusanoGroup[i].lasti = this.gusanoGroup[i].i;
          this.gusanoGroup[i].lastj = this.gusanoGroup[i].j;
          if(this.gusanoGroup[i].anguloTemp){//Control de giro a la derecha para control de angulo de animacion
            this.gusanoGroup[i].angle = this.gusanoGroup[i-1].lastangle;  
          }
          this.gusanoGroup[i].lastangle = this.gusanoGroup[i].angle;//Angulo de asignacion siguiente objeto
          if(this.gusanoGroup[i].hasOwnProperty('txt')){
            this.tablero.setObjCuadro(this.gusanoGroup[i-1].lasti,this.gusanoGroup[i-1].lastj,'',this.gusanoGroup[i],3);//Nueva posicion (para texto) 
            this.tablero.setTexto(this.gusanoGroup[i-1].lasti,this.gusanoGroup[i-1].lastj,'',this.gusanoGroup[i].txt);//Nueva posicion 
          }else{
            this.tablero.setObjCuadro(this.gusanoGroup[i-1].lasti,this.gusanoGroup[i-1].lastj,'',this.gusanoGroup[i],1);//Nueva posicion 
          }
          this.gusanoGroup[i].angle = this.gusanoGroup[i-1].lastangle;//Angulo inicial
          if(this.gusanoGroup[i+1]){//Control de giros y asignacion de codos de giro
            if(this.gusanoGroup[i].angle != this.gusanoGroup[i].lastangle){
              if(this.gusanoGroup[i].hasOwnProperty('txt')){
                this.gusanoGroup[i].frame = 4;//Frame codo de giro(para texto)
              }else{
                this.gusanoGroup[i].frame = 2;//Frame codo de giro 
              }
              if(this.gusanoGroup[i].angle == -180){
                this.gusanoGroup[i].angleAngle = 180;
              }else{
                this.gusanoGroup[i].angleAngle = undefined;
              }
              if((this.gusanoGroup[i].lastangle+90 == this.gusanoGroup[i].angle) || (this.gusanoGroup[i].lastangle+90 == this.gusanoGroup[i].angleAngle)){//Giros direccion derecha              
                this.gusanoGroup[i].anguloTemp = true;//Control giro derecha
                switch(this.gusanoGroup[i].angle){//Asignacion angulo de giro
                  case 0:
                    this.gusanoGroup[i].angle = 90;
                    break;
                  case 90:
                    this.gusanoGroup[i].angle = 180;
                    break;
                  case -180:
                    this.gusanoGroup[i].angle = -90;
                    break;
                  case -90:
                    this.gusanoGroup[i].angle = 0;
                    break;
                }
              }else{
                this.gusanoGroup[i].anguloTemp = false;
              }
            }else{
              if(this.gusanoGroup[i].hasOwnProperty('txt')){
                this.gusanoGroup[i].frame = 3;
              }else{
                this.gusanoGroup[i].frame = 1;
              }
              this.gusanoGroup[i].anguloTemp = false;
            }
          }else{
            if(this.gusanoGroup[i].hasOwnProperty('txt')){
              this.gusanoGroup[i].frame = 3;
            }else{
              this.gusanoGroup[i].frame = 1;
            }
            this.gusanoGroup[i].anguloTemp = false;
          }
        }
      }
    },

    crearExpresion: function(){
      this.nuevoCuerpo();
      this.cambioSound.play();
      this.pasoActual = 0;//Reseteo de pasos de evaluacion a 0
      this.random = Math.floor(Math.random()*this.levelData.dataGusano.length);//Expresion aleatoria de data de juego
      this.txtExp.text = this.levelData.dataGusano[this.random].exp[this.pasoActual];//Asignacion texto de expresion
      this.res = eval(this.levelData.dataGusano[this.random].exp);//Resultado de expresion
      this.nuevoPaso();//Creacion primer paso
    },

    nuevoCuerpo: function(){
      this.cuerpoGroup.forEach(function(item){//Se realiza limpieza de bolas de gusano de posibles expresiones anteriores
        item.destroy();
        if(item.hasOwnProperty('txt')){
          item.txt.destroy();
        }
      });
      this.cuerpoGroup = [];
      for(var i=1;i<this.gusanoGroup.length;i++){//Limpieza grupo gusano
        this.gusanoGroup[i].destroy();
        if(this.gusanoGroup[i].hasOwnProperty('txt')){
          this.gusanoGroup[i].txt.destroy();
        }
      }
      this.gusanoGroup = [this.gusano];
      for(var i=0;i<this.bien;i++){
        this.comerItem();//Creacion bola inicial de gusano
      }
    },

    nuevoPaso: function(){
      this.itemGroup.forEach(function(item){//Se realiza limpieza de pasos en tablero de juego
        item.destroy();
        item.txt.destroy();
      });
      this.itemGroup = [];
      if(this.pasoActual == this.levelData.dataGusano[this.random].nPasos){//En caso de ser el ultimo paso
        this.bien++;
        this.crearExpresion();//Se realiza creacion de nueva expresion
      }else{//En caso de ser paso de expresion
        var thisTemp = this;
        var primerosPasos = this.levelData.dataGusano[this.random].pasos.filter(this.filtroPaso,this);//Filtro de pasos de acuerdo a paso actual
        primerosPasos.forEach(function(item){//Creacion de items en tablero de juego
          thisTemp.crearItem(item);
        });
      }
    },

    filtroPaso: function(obj){
      console.log(obj.n,' - ',this.pasoActual);
      for(var i=0;i<obj.n.length;i++){
        if(obj.n[i] == this.pasoActual){
          return true;
        }
      }
      return false;
    },

    crearItem: function(obj){
      var xRandom = Math.floor(Math.random()*this.tablero.xCuadros);//Posicion X aleatoria para nuevo elemento
      var yRandom = Math.floor(Math.random()*this.tablero.yCuadros);//Posicion Y aleatoria para nuevo elemento
      var continuar = true;
      while(continuar){
        var sale = true;
        var thisTemp = this;
        this.itemGroup.forEach(function(item){
          if(item.i == xRandom && item.j == yRandom){
            xRandom = Math.floor(Math.random()*thisTemp.tablero.xCuadros);//Posicion X aleatoria para nuevo elemento
            yRandom = Math.floor(Math.random()*thisTemp.tablero.yCuadros);//Posicion Y aleatoria para nuevo elemento
            sale = false;
          }
        });
        if(sale){
          continuar = false;
        }
      }
      var item = this.tablero.setObjCuadro(xRandom, yRandom, 'itemGusano', null, 0);//Creacion item en tablero de juego
      if(obj){//ASignacion de propiedades
        item.ok = obj.ok;
        item.txt = this.tablero.setTexto(xRandom,yRandom, obj.txt);
      }
      this.itemGroup.push(item);
    },

    comerItem: function(cabeza, item){
      var continuar = true;
      var txtItem = null;
      if(item){
        if(item.ok){//En caso de item correcto de aceurdo al paso
          txtItem = item.txt.text;
        }else{//En caso de error 
          this.countErrors++;
          this.malSound.play();
          continuar = false;
          if((this.countErrors%5) == 0){
            this.alert.show(this.msjError[Math.floor(Math.random()*this.msjError.length)]);
          }  
        }
      }
      if(continuar){//En caso de item correcto agrega una bola al cuerpo del gusano
        var bola = this.tablero.setObjCuadro(this.gusanoGroup[this.gusanoGroup.length-1].lasti, this.gusanoGroup[this.gusanoGroup.length-1].lastj, 'gusano_4', null, 1);
        bola.angle = this.gusanoGroup[this.gusanoGroup.length-1].lastangle;
        if(txtItem != null){
          bola.txt = this.tablero.setTexto(this.gusanoGroup[this.gusanoGroup.length-1].lasti,this.gusanoGroup[this.gusanoGroup.length-1].lastj, txtItem);
        }
        this.cuerpoGroup.push(bola);
        this.gusanoGroup.push(bola);
        this.nuevaBola = true;        
      }else{//En caso de item erroneo se remueven items del cuerpo del gusano
        if(this.gusanoGroup.length > 1){//En caso de contar con bolas para destruir
          /*var bola = this.cuerpoGroup[this.cuerpoGroup.length-1];
          this.cuerpoGroup.pop();
          this.gusanoGroup.pop();
          bola.destroy();*/
        }else{
          //this.chocar();
        }
      }
      if(item){
        if(item.ok){//En caso de item correcto de aceurdo al paso          
          this.feedSound.play();
          this.pasoActual++;
          this.nuevoPaso();
        }
        item.destroy();//Eliminacion del item de tablero de juego
        item.txt.destroy();
      }
    },

    chocar: function(cabeza, cuerpo){
      if(!this.nuevaBola){
        this.showStats();//Mostrar estadisticas
        //Detener metodo de update
        this.tiempo.stop();
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
      this.total = this.tablero.xCuadros * this.tablero.yCuadros;
      this.porcentaje = Math.floor((this.gusanoGroup.length * 100)/this.total);
      
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
  
  module.exports = Nivel4;
},{"../prefabs/alert":2,"../prefabs/pause":4,"../prefabs/tablero":5}],13:[function(require,module,exports){
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

    arbolFinal: function(){
      if(this.pasoActual == this.levelData.dataSitua[this.random].nPasos){//Mensaje final de acuerdo a la ultima eleccion
        this.txtSitua.text = this.levelData.dataSitua[this.random].pasos[this.pasoActual-1].fin;
      }else{
        this.txtSitua.text = this.levelData.dataSitua[this.random].pasos[this.pasoActual].alterno;
      }
      this.termina = true;
      this.btnSi.destroy();
      this.btnNo.destroy();
      console.log(this.pasoActual+1);
      for(var i=0;i<this.pasoActual+1;i++){
        if(i != this.levelData.dataSitua[this.random].nPasos){
          console.log(this.levelData.dataSitua[this.random].pasos[i].txt,' - ',i);
        }
        if(i == this.pasoActual){ 
          if(this.pasoActual == this.levelData.dataSitua[this.random].nPasos){
            console.log(this.levelData.dataSitua[this.random].pasos[i-1].fin);
          }else{
            console.log(this.levelData.dataSitua[this.random].pasos[i].alterno);
          }
        }        
      }
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
},{"../prefabs/alert":2,"../prefabs/pause":4}],14:[function(require,module,exports){
'use strict';
var Pausa = require('../prefabs/pause');
  
  var Alert = require('../prefabs/alert');

  function Nivel6() {}
  Nivel6.prototype = {
    //Definición de propiedades globales de nivel
    maxtime: 180,
    flagpause:false,
    intro:true,
    introStep:0,
    intSituacion:0,
    itemX: 0,
    itemY: 0,
    slotCiclo:false,
    slotAccion_1:false,
    score:0,   
    situaLength:0,
    //Contadores para stats de nivel
    nCorrectas:0,
    nIntentos:0,
    nSituaciones: 0,
    nErrores: 0,

    posSit: [350,390,430,470,510],
    msjError: ['Ups, algo no anda bien. Intentalo de nuevo!','Tu ciclo no cumple con el objetivo solicitado, intentalo de nuevo!','En caso de ciclo para, ten en cuenta el número de iteraciones necesarias de acuerdo a la situación ','En caso de ciclo mientras, recuerda que las acciones dentro del ciclo se repetiran mientras se cumpla la condición '],

    init:function(){
      this.maxtime= 180; 
      this.itemX= 0;
      this.itemY= 0;
      this.flagpause=false;
      this.intro=true;
      this.introStep = 0;
      this.intSituacion=0;
      this.slotCiclo=false;
      this.slotAccion_1=false;
      this.score = 0;
      this.situaLength = 0;
      this.nCorrectas=0;
      this.nIntentos=0;
      this.nSituaciones = 0;
      this.nErrores = 0;
      //Se incluyen audios de juego
      this.errorSound = this.game.add.audio('errorSound');
      this.grabSound = this.game.add.audio('grabSound');
      this.soltarSound = this.game.add.audio('soltarSound');
      this.btnSound = this.game.add.audio('btnSound');
      this.bienSound = this.game.add.audio('bienSound');
    },

    create: function() {
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data6'));
      this.situaLength = this.levelData.dataSitua.length;//Cantidad de situaciones de nivel

      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.introImg = this.game.add.tileSprite(0, 0,800,600, 'introN6');//Imagen intro de juego
      this.introImg2 = null;
      this.game.input.onDown.add(this.iniciarJuego,this);

      this.txtIntro = this.game.add.bitmapText(200, 320, 'fontData', 'Estás preparado? En este nivel aprenderás acerca de estructuras cíclicas, deberás formar ciclos que permitan dar solución a diversas situaciones. Recuerda analizar cuidadosamente y elegir la mejor respuesta para superar cada reto.\n\nComencemos!', 24);
      this.txtIntro.anchor.setTo(0.5,0.5);
      this.txtIntro.maxWidth = 260;
    },

    iniciarJuego : function(game){
      var x1 = 115;
      var x2 = 264;
      var y1 = 480;
      var y2 = 550;
      if(this.intro){
        switch(this.introStep){
          case 0:
            if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
              this.btnSound.play();
              this.introStep++;
              this.introImg.kill();//Se elimina imagen de intro
              this.introImg2 = this.game.add.sprite(0,0,'ayudaGeneral',6);
            }          
            break;
          case 1:
            this.btnSound.play();
            this.empezar();
            break;
        }
      }
    },

    empezar:function () {
       //Habilitacion de fisicas
      this.game.physics.startSystem(Phaser.Physics.ARCADE);      
      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel6');

      //Grupo de items
      this.items = this.game.add.group();
      this.items.enableBody = true;
      this.items.inputEnabled = true;

      this.elemGroup = this.game.add.group();
      this.elemGroup.enableBody = true;
      this.elemGroup.inputEnabled = true;

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego      
      this.tiempo.start();

      //Grupo de Situacion e imagenes
      this.situaGroup = this.game.add.group();
      //Se crea marco de la situacion
      this.marcoSitua = this.game.add.sprite(10,40,'fondosituacion');      
      this.situaGroup.add(this.marcoSitua);

      //Se agrega boton de ejecucion
      this.run = this.game.add.sprite(230, 355,'btnEjecutar6');
      this.run.anchor.setTo(0.5,0.5);
      this.run.inputEnabled = true;
      this.run.events.onInputDown.add(this.correrCondicion, this);
      this.run.visible =false;
           
      //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(230, 40,'time');
      this.cuadroTime.anchor.setTo(0.5, 0.5);
      //Se setea el texto para el cronometro
      this.timer = this.game.add.bitmapText(230, 40 ,'font', '00:00', 32);
      this.timer.anchor.setTo(0.5,0.5);

      //Se crear text para el score
      this.scoretext = this.game.add.bitmapText(20, 25 ,'font', 'Puntaje: 0', 24);
      this.scoretext.anchor.setTo(0,0.5);

      //boton ciclo while
      this.btnwhile = this.game.add.sprite(520, 100,'btnwhile');
      this.btnwhile.inputEnabled = true;
      this.btnwhile.events.onInputDown.add(this.listenerwhile, this);

      //boton ciclo for
      this.btnfor = this.game.add.sprite(520, 222,'btnfor');
      this.btnfor.inputEnabled = true;
      this.btnfor.events.onInputDown.add(this.listenerfor, this);

      //Se agrega el boton de pausa
      this.btnPausa = this.game.add.button((this.game.width - 81), 10, 'btnPausa');
      this.btnPausa.frame = 1;
      this.btnPausa.fixedToCamera = true;

       //Se incluye el panel de pausa al nivel
      this.pnlPausa = new Pausa(this.game);
      this.game.add.existing(this.pnlPausa);
      this.game.input.onDown.add(this.pausaJuego,this);

      //Se crea situacion aleatoria      
      this.crearSitua();
      //Se indica que sale del intro
      this.intro = false;
      this.alert = new Alert(this.game);//Creacion onjeto de alerta
    },

    update:function(){
      if(!this.intro){
        var mouseX = this.game.input.x;
        var mouseY = this.game.input.y;
        this.items.forEach(function(item) {
          //Se verifican los items para realizar su movimiento en caso de click
          if(item.movimiento == true){          
            item.x = mouseX;
            item.y = mouseY;
            item.texto.x = item.x ;
            item.texto.y = item.y ;
          }       
        });
      }
    },

    updateTimer: function() {
      //Se comprueba que el tiempo de juego haya terminado
      if(this.maxtime == 0){
         this.showStats();
        //Detener metodo de update
        this.tiempo.stop();
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

    crearSitua:function(){
      //se ocula boton ejecutar
      this.run.visible =false;
      if(this.maxtime >= 3){//En caso de quedar 3 segundos de juego la situacion no es tenida en cuenta
        this.nSituaciones++;//Aumento de conteo situaciones stats
      }
      this.intSituacion = Math.floor(Math.random() * this.situaLength);//Se realiza la carga de una situación de forma aleatoria
      var keySitua = '';
      if(this.levelData.dataSitua[this.intSituacion].ImageUrl){//En caso de contar con imagen para la situacion
        keySitua = 'niv6_situa' + (this.intSituacion+1);//Generacion nombre llave de imagen de acuerdo a situacion
      }else{
        keySitua = 'situacion0';//Situacion generica en caso de no contar con imagen
      }      
      //Imagen inicial de la sitacion            
      this.situacion = this.game.add.sprite(30,60,keySitua);
      this.situacion.animations.add('jump');
      this.situacion.animations.play('jump', 7, true);
      this.situaGroup.add(this.situacion);//Creacion imagen situacion
      this.marcoSitua.bringToTop();
      this.situaGroup.updateZ();

      //Se eliminan los items de la situacion anterior
      this.items.forEach(function(item) {        
          if(item.texto != null) { item.texto.kill();}       
          item.kill();        
      });;

      //Restauramos botones de ciclos
      this.btnwhile.visible = true;
      this.btnfor.visible = true;

      //Se crea marco de la situacion
      if(this.pasos != null){this.pasos.kill(); this.pasos.texto.kill();}
      this.pasos = this.game.add.sprite(230,460,'fondoPasos6');
      this.pasos.anchor.setTo(0.5,0.5);
      
      this.pasos.texto = this.game.add.bitmapText(this.pasos.x,this.pasos.y,'font','',18);
      this.pasos.texto.anchor.setTo(0.5,0.5);

      //Se establece los pasos de la situacion
      this.pasos.texto.setText(this.levelData.dataSitua[this.intSituacion].texto);
      this.pasos.texto.maxWidth = this.pasos.width - 5;
      this.situaGroup.add(this.pasos);
      this.situaGroup.add(this.pasos.texto);
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
    },

    showStats: function(){
      this.btnPausa.kill();//Se retira el boton de pausa      
      //Creacion cuadro retroalimentación final
      this.retroFinal = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'final1');
      this.retroFinal.anchor.setTo(0.5,0.5);
      this.btnMenu = this.game.add.button(410,370,'OpcPausa',this.pnlPausa.menuBtn,this,this.game);//Se agrega boton para retornar a menu
      this.btnMenu.frame = 2;
      this.btnRepetir = this.game.add.button(335,370,'OpcPausa',this.pnlPausa.repetirBtn,this,this.game);//Se agrega boton para repetir nivel
      this.btnRepetir.frame = 0;

      this.txtStats = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 170, 'font_white', '# de situaciones: '+this.nSituaciones.toString()+'\n# de intentos: '+this.nIntentos.toString()+'\n# de aciertos: '+this.nCorrectas.toString(), 28);
      this.txtStats.anchor.setTo(0.5,0.5);

      //Asignacion de porcentaje de nivel
      var porcIni = (this.nCorrectas * 100)/this.nIntentos;
      var porcEva = (this.nCorrectas * porcIni)/100;
      if(this.nCorrectas > 0){
        this.porcentaje = Math.ceil((porcEva/this.nIntentos) * 100);
      }else{
        this.porcentaje = 0;
      }
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

    correrCondicion: function(){
      this.nIntentos++;
      var condicionCorrecta = true;
      var game = this;
      if(this.slotCiclo && this.slotAccion_1){
        this.items.forEach(function(item) {
            if(item.slotC){ //slot Ciclo
              if(!item.respuesta){
                condicionCorrecta = false;
              }
            }else if(item.slot1){ //slot accion
              if(!item.respuesta){
                condicionCorrecta = false;
              }
            }
        });
       
        //Se valida la condicion de ciclo
        //si la condicion es correcta se pasa a la siguiente situacion
        if(condicionCorrecta){   
          this.bienSound.play();       
          this.nCorrectas++;
          //Se ejecuta la animacion 
          this.situacion.visible = false;
          if(this.SituacionCorrecta != null ){this.SituacionCorrecta.kill();}                 
          //Imagen inicial de la sitacion            
          this.SituacionCorrecta = this.game.add.sprite(30,60,"Image_Correct");
          this.situaGroup.add(this.SituacionCorrecta);//Creacion imagen situacion
          this.marcoSitua.bringToTop();
          this.situaGroup.updateZ();
          var anim = this.SituacionCorrecta.animations.add('anima',[0,1,2,3,4,5,6,7], 8, false); 
          anim.onComplete.add(function(){
            game.slotCiclo = game.slotAccion_1 = false; 
            game.score += 10;
            game.scoretext.setText('Puntaje: ' + game.score);
            game.SituacionCorrecta.kill();
            //Se crea situacion aleatoria
            if(game.textciclo != null ){game.textciclo.kill();}      
            game.crearSitua();  
          });
          this.SituacionCorrecta.animations.play('anima');
        }else{
           this.errorSound.play();
          //Se ejecuta la animacion 
          this.situacion.visible = false;   
          if(this.SituacionCorrecta != null ){this.SituacionCorrecta.kill();}
          //Imagen inicial de la sitacion            
          this.SituacionCorrecta = this.game.add.sprite(30,60,"Image_Error");
          this.situaGroup.add(this.SituacionCorrecta);//Creacion imagen situacion
          this.marcoSitua.bringToTop();
          this.situaGroup.updateZ();
          var anim = this.SituacionCorrecta.animations.add('anima',[0,1,2,3,4,5,6,7], 8, false); 
          anim.onComplete.add(function(){
              
          });
          this.SituacionCorrecta.animations.play('anima'); 

          this.nErrores++;
          if((this.nErrores%3) == 0){
            this.alert.show(this.msjError[Math.floor(Math.random()*this.msjError.length)]);
          }                  
        }        
      }else{
        this.alert.show("Debes completar el ciclo para cumplir con la situación");
        
      }
    },

    listenerwhile:function(){
      this.btnSound.play();
      if(this.levelData.dataSitua[this.intSituacion].Ciwhile == "No implementable"){
        this.alert.show("No es posible solucionar esta situación por medio del ciclo mientras, intenta nuevamente!");
      }else{
        //Ocultamos los botones del ciclo for y while
        this.run.visible =true;
        this.btnwhile.visible = false;
        this.btnfor.visible = false;
        //Creamos el slot de la estructura del ciclo
        this.slot = this.items.create(479,100,'slotciclo');

        //creamos las acciones de la situación
        
        var CItems = this.items;
        var game = this;
        var util  = [];
        if(this.textciclo != null ){this.textciclo.kill();}
        //Se crea texto del ciclo
        this.textciclo = this.game.add.text((this.slot.x +8),(this.slot.y + 29),'Mientras                                           Hacer',{font: '16px calibri', fill: '#fff', align:'center'});
        this.textciclo.anchor.setTo(0,0.5);
        this.textciclo.fontWeight = 'bold';
        this.items.add(this.textciclo);

        this.levelData.dataSitua[this.intSituacion].Ciwhile.SlotAccion.forEach(function(acciontext) {
            var randonpos =  Math.floor(Math.random() * game.levelData.dataSitua[game.intSituacion].Ciwhile.SlotAccion.length);
            while (util.indexOf(randonpos) >= 0){
                randonpos =  Math.floor(Math.random() * game.levelData.dataSitua[game.intSituacion].Ciwhile.SlotAccion.length);
            }
            util.push(randonpos);
            var item = CItems.create(535,game.posSit[randonpos],'accion_small6');
            item.xPos =535;
            item.yPos = game.posSit[randonpos];
            item.tipo = 0;
            item.anchor.setTo(0.5,0.5);          
            item.texto = game.game.add.bitmapText(item.x, item.y, 'fontData',acciontext.texto,13);
            item.texto.maxWidth = item.width -5;
            item.respuesta = acciontext.ok;
            item.texto.anchor.setTo(0.5,0.5);
            item.inputEnabled = true;
            item.events.onInputDown.add(game.clickItem, game);
            item.events.onInputUp.add(game.releaseItem, game);

            game.items.add(item.texto);
           
        });

        //creamos las condiciones de la situación
        util  = [];
        this.levelData.dataSitua[this.intSituacion].Ciwhile.Slot.forEach(function(condiciontext) {
            var randonpos =  Math.floor(Math.random() * game.levelData.dataSitua[game.intSituacion].Ciwhile.Slot.length);
            while (util.indexOf(randonpos) >= 0){
                randonpos =  Math.floor(Math.random() * game.levelData.dataSitua[game.intSituacion].Ciwhile.Slot.length);
            }
            util.push(randonpos);
            var item = CItems.create(690,game.posSit[randonpos],'condicion6');          
            item.xPos =690;
            item.yPos = game.posSit[randonpos];
            item.tipo = 1;
            item.anchor.setTo(0.5,0.5);
            item.texto = game.game.add.bitmapText(item.x, item.y, 'fontData',condiciontext.texto,14);
            item.texto.maxWidth = item.width -5;
            item.respuesta = condiciontext.ok;
            item.texto.anchor.setTo(0.5,0.5);
            item.inputEnabled = true;
            item.events.onInputDown.add(game.clickItem, game);
            item.events.onInputUp.add(game.releaseItem, game);

            game.items.add(item.texto);
            
        });
      }
    },

    listenerfor:function(){
      this.btnSound.play();
      if(this.levelData.dataSitua[this.intSituacion].Cifor == "No implementable"){
        this.alert.show("No es posible solucionar esta situación por medio del ciclo para, intenta nuevamente!");
      }else{
        //Ocultamos los botones del ciclo for y while
        this.run.visible =true;
        this.btnwhile.visible = false;
        this.btnfor.visible = false;
        //Creamos el slot de la estructura del ciclo
        this.slot = this.items.create(479,100,'slotciclo');

        //creamos las acciones de la situación      
        var CItems = this.items;
        var game = this;
        var util  = [];
        if(this.textciclo != null ){this.textciclo.kill();}
        //Se crea texto del ciclo
        this.textciclo = this.game.add.text((this.slot.x +15),(this.slot.y + 29),'Para                                             Hacer',{font: '16px calibri', fill: '#fff', align:'center'});
        this.textciclo.anchor.setTo(0,0.5);
        this.textciclo.fontWeight = 'bold';
        this.items.add(this.textciclo);

        this.levelData.dataSitua[this.intSituacion].Cifor.SlotAccion.forEach(function(acciontext) {
            var randonpos =  Math.floor(Math.random() * game.levelData.dataSitua[game.intSituacion].Cifor.SlotAccion.length);
            while (util.indexOf(randonpos) >= 0){
                randonpos =  Math.floor(Math.random() * game.levelData.dataSitua[game.intSituacion].Cifor.SlotAccion.length);
            }
            util.push(randonpos);
            var item = CItems.create(535,game.posSit[randonpos],'accion_small6');
            item.xPos =535;
            item.yPos = game.posSit[randonpos];
            item.tipo = 0;
            item.anchor.setTo(0.5,0.5);
            item.texto = game.game.add.bitmapText(item.x, item.y, 'fontData',acciontext.texto,14);
            item.texto.maxWidth = item.width -5;
            item.respuesta = acciontext.ok;
            item.texto.anchor.setTo(0.5,0.5);
            item.inputEnabled = true;
            item.events.onInputDown.add(game.clickItem, game);
            item.events.onInputUp.add(game.releaseItem, game);  

            game.items.add(item.texto);        
        });

        //creamos las condiciones de la situación
        util  = [];
        this.levelData.dataSitua[this.intSituacion].Cifor.Slot.forEach(function(condiciontext) {
            var randonpos =  Math.floor(Math.random() * game.levelData.dataSitua[game.intSituacion].Cifor.Slot.length);
            while (util.indexOf(randonpos) >= 0){
                randonpos =  Math.floor(Math.random() * game.levelData.dataSitua[game.intSituacion].Cifor.SlotAccion.length);
            }
            util.push(randonpos);
            var item = CItems.create(690,game.posSit[randonpos],'condicion6');
            item.xPos =690;
            item.yPos = game.posSit[randonpos];          
            item.tipo = 1;
            item.anchor.setTo(0.5,0.5);
            item.texto = game.game.add.bitmapText(item.x, item.y, 'fontData',condiciontext.texto,14);
            item.texto.maxWidth = item.width -5;
            item.respuesta = condiciontext.ok;
            item.texto.anchor.setTo(0.5,0.5);
            item.inputEnabled = true;
            item.events.onInputDown.add(game.clickItem, game);
            item.events.onInputUp.add(game.releaseItem, game);

            game.items.add(item.texto);
        });
      }
    },
    
    clickItem : function(item){
      if(!this.alert.visible){
        this.grabSound.play();
        this.itemX = item.x;
        this.itemY = item.y;
        item.movimiento = true; 
        item.anchor.setTo(0.5,0.5);
        item.bringToTop(); 
        item.texto.parent.bringToTop(item.texto);
        this.items.updateZ();
      }
    },

    releaseItem:function(item){
      if(item.movimiento){
        item.movimiento = false;
        
        //Se define cuadro imaginario para las acciones
        if(item.tipo == 0 && item.body.y >= (this.slot.body.y + 40) && item.body.y <= (this.slot.body.y + 104) && item.body.x >= (this.slot.body.x + 38) && item.body.x <= (this.slot.body.x + 270) ){
          this.soltarSound.play();
            var game = this;
            if(this.slotAccion_1){
              this.items.forEach(function(itemAnt) {
                  if(itemAnt.slot1){
                    var itemNuevo = game.items.create(itemAnt.xPos,itemAnt.yPos,'accion_small6');
                    itemNuevo.xPos =itemAnt.xPos;
                    itemNuevo.yPos = itemAnt.yPos;
                    itemNuevo.tipo = 0;
                    itemNuevo.anchor.setTo(0.5,0.5);
                    itemNuevo.texto = itemAnt.texto;
                    itemNuevo.texto.fontSize = 14;
                    itemNuevo.texto.x = itemNuevo.x;
                    itemNuevo.texto.y = itemNuevo.y;
                    itemNuevo.texto.maxWidth = itemNuevo.width -5;
                    itemNuevo.respuesta = itemAnt.respuesta;
                    itemNuevo.texto.anchor.setTo(0.5,0.5);
                    itemNuevo.inputEnabled = true;
                    itemNuevo.events.onInputDown.add(game.clickItem, game);
                    itemNuevo.events.onInputUp.add(game.releaseItem, game);
                    delete itemAnt.slot1;
                    itemAnt.kill();

                    game.items.add(itemNuevo.texto);
                    itemNuevo.bringToTop(); 
                    itemNuevo.texto.parent.bringToTop(itemNuevo.texto);
                    game.items.updateZ();
                  }
              });
            }     
            //Creamos el item el cual encaja en el slot de la accion          
            var itemEncajado = this.items.create( (this.slot.body.x + 146),(this.slot.body.y + 93),'accion_large6');
            itemEncajado.xPos = item.xPos;
            itemEncajado.yPos = item.yPos;
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.respuesta = item.respuesta;
            itemEncajado.texto.fontSize = 20;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slot1 = true; 
            itemEncajado.inputEnabled = true;
            itemEncajado.events.onInputDown.add(this.clickItem, this);
            itemEncajado.events.onInputUp.add(this.releaseItem, this);         
            item.kill();

            this.items.add(itemEncajado.texto);
            itemEncajado.bringToTop(); 
            itemEncajado.texto.parent.bringToTop(itemEncajado.texto);
            this.items.updateZ();
          
          //indicamos que el primer slot se ha ocupado
          this.slotAccion_1 = true;
        }else if(item.tipo == 1 && item.body.y >= (this.slot.body.y + 7) && item.body.y <= (this.slot.body.y + 40) && item.body.x >= (this.slot.body.x + 38) && item.body.x <= (this.slot.body.x + 220) ){
          this.soltarSound.play();

          if(this.slotCiclo){
            this.items.forEach(function(itemAnt) {
                if(itemAnt.slotC){
                  if(item != itemAnt){
                    delete itemAnt.slotC;
                    itemAnt.x = itemAnt.xPos;
                    itemAnt.y = itemAnt.yPos;
                    itemAnt.texto.x= itemAnt.x;
                    itemAnt.texto.y = itemAnt.y;
                  }                  
                }
            });
          }
          item.x = (this.slot.body.x + 126);
          item.y = (this.slot.body.y + 29);
          item.texto.x= item.x;
          item.texto.y = item.y;
          item.slotC = true;
          //indicamos que el primer slot se ha ocupado
          this.slotCiclo = true;
        }else{
          if(item.slotC){
            this.slotCiclo = false;
            delete item.slotC;
          }
          if(item.slot1){            
            this.slotAccion_1 = false;
            var itemNuevo = this.items.create(item.xPos,item.yPos,'accion_small6');
            itemNuevo.xPos =item.xPos;
            itemNuevo.yPos = item.yPos;
            itemNuevo.tipo = 0;
            itemNuevo.anchor.setTo(0.5,0.5);
            itemNuevo.texto = item.texto;
            itemNuevo.texto.fontSize = 14;
            itemNuevo.texto.x = itemNuevo.x;
            itemNuevo.texto.y = itemNuevo.y;
            itemNuevo.texto.maxWidth = itemNuevo.width -5;
            itemNuevo.respuesta = item.respuesta;
            itemNuevo.texto.anchor.setTo(0.5,0.5);
            itemNuevo.inputEnabled = true;
            itemNuevo.events.onInputDown.add(this.clickItem, this);
            itemNuevo.events.onInputUp.add(this.releaseItem, this);
            delete item.slot1;  
            item.kill();         
          }else{
            item.x = item.xPos
            item.y = item.yPos;
            item.texto.x = item.x;
            item.texto.y = item.y;
          }
        }
      }
    },
    
  };

  module.exports = Nivel6;
},{"../prefabs/alert":2,"../prefabs/pause":4}],15:[function(require,module,exports){
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.btns = this.game.add.group();
      this.crearBoton(0, 0, 'nivel1',205, 50,'Hola, en este nivel aprenderás lo básico frente a algoritmos por medio de diversos ejecicios. Intentalo! ',true);
      this.crearBoton(0,100,'nivel2',205,150,'Necesitas mejorar tus conocimientos sobre tipos de datos?, aquí esta todo lo que necesitas! ',true);
      this.crearBoton(0,200,'nivel3',205,250,'Sumergete en el manejo y evaluación adecuada de expresiones por medio de este divertido juego! ',true);
      this.crearBoton(0,300,'nivel4',205,350,'Ya sabes como evaluar una expresión? Ahora aprende como construirla. Ponte a prueba con este juego! ',true);
      this.crearBoton(0,400,'nivel5',205,450,'',true);
      this.crearBoton(0,500,'nivel6',205,550,'En este nivel aprenderás acerca de estructuras cíclicas, como y en que situaciones podemos usarlas, Atrevete!',true);

      this.overSound = this.game.add.audio('menuoverSound');
      this.btnSound = this.game.add.audio('btnMenuSound');
    },

    update: function() {

    },

    crearBoton: function(x,y,llave,txt_x,txt_y,txt, animOk){
      var boton = this.game.add.sprite(x, y,llave,0);
      boton.nivel = llave;
      var anim = boton.animations.add('over', [0,1,2,3,4,5,6], 10, false);
      if(animOk){
        anim.onComplete.add(function() {
          if(boton.texto){
            boton.texto.revive();
          }else{
            boton.texto = this.game.add.bitmapText(txt_x, txt_y, 'fontData', txt, 20);
            boton.texto.anchor.setTo(0.5,0.5);
            boton.texto.maxWidth = 300;
          }
          boton.texto.anchor.setTo(0,0.5);
        }, this);
        boton.inputEnabled = true;
        boton.events.onInputDown.add(this.clickListener, this);
      }
      boton.events.onInputOver.add(this.over, this);
      boton.events.onInputOut.add(this.out, this);      
      this.btns.add(boton);
    },

    clickListener: function(boton) {
      this.btnSound.play();
      this.game.state.start(boton.nivel);
    },

    over: function(boton){
      boton.animations.play('over');
      this.overSound.play();
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
},{}],16:[function(require,module,exports){

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
    this.load.image('introN3','assets/images/Nivel3/intro.jpg');
    this.load.image('tile_nivel3','assets/images/Nivel3/tile.jpg');
    this.load.spritesheet('gusano','assets/images/Nivel3/gusano.png',50,50);
    this.load.image('itemGusano','assets/images/Nivel3/item.png');
    this.load.image('tablero','assets/images/Nivel3/tablero.png');
    this.load.image('tablero_3','assets/images/Nivel3/tablero_3.png');
    this.load.image('final3','assets/images/Nivel3/final.png');
    this.load.text('data3','assets/data/nivel3.json');//Datos nivel 3
    
    /*Imagenes nivel 4*/
    this.load.image('introN4','assets/images/Nivel4/intro.jpg');
    this.load.image('tile_nivel4','assets/images/Nivel4/tile.jpg');
    this.load.spritesheet('gusano_4','assets/images/Nivel4/gusano.png',50,50);
    this.load.image('tablero_','assets/images/Nivel4/tablero.png');
    this.load.image('tablero_4','assets/images/Nivel4/tablero_4.png');
    this.load.text('data4','assets/data/nivel4.json');//Datos nivel 4

    /*Imagenes nivel 5*/
    this.load.text('data5','assets/data/nivel5.json');//Datos nivel 4

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
    this.load.spritesheet("Image_Correct", "assets/images/Nivel6/animBien.png",401,273);
    this.load.spritesheet("Image_Error", "assets/images/Nivel6/animMal.png",401,273);
    this.load.text('data6','assets/data/nivel6.json');//Datos nivel 3

    /*Audios de juego*/
    this.load.audio('menuBgMusic', ['assets/audio/BgLoop/menu.ogg','assets/audio/BgLoop/menu.mp3']);

    this.load.audio('menuoverSound', ['assets/audio/menuOver/menuOver.ogg','assets/audio/menuOver/menuOver.mp3']);
    this.load.audio('btnMenuSound', ['assets/audio/btnMenu/btnMenu.ogg','assets/audio/btnMenu/btnMenu.mp3']);
    this.load.audio('btnSound', ['assets/audio/btn/boton.ogg','assets/audio/btn/boton.mp3']);
    
    this.load.audio('bienSound', ['assets/audio/bien/bien.ogg','assets/audio/bien/bien.mp3']);
    this.load.audio('errorSound', ['assets/audio/error/error_0.ogg','assets/audio/error/error_0.mp3']);
    this.load.audio('itemOkSound', ['assets/audio/item/item.ogg','assets/audio/item/item.mp3']);    
    this.load.audio('grabSound', ['assets/audio/grab/grab.ogg','assets/audio/grab/grab.mp3']);
    this.load.audio('soltarSound', ['assets/audio/soltar/soltar.ogg','assets/audio/soltar/soltar.mp3']);
    this.load.audio('feedSound', ['assets/audio/feed/feed.ogg','assets/audio/feed/feed.mp3']);
    this.load.audio('malSound', ['assets/audio/mal/mal.ogg','assets/audio/mal/mal.mp3']);
    this.load.audio('cambioSound', ['assets/audio/cambio/cambio.ogg','assets/audio/cambio/cambio.mp3']);
  },

  create: function() {
    this.asset.cropEnabled = false;
  },
  
  update: function() {
    if(!!this.ready2) {
      this.game.state.start('menu');
    }
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
         
          
          thisTemp.cont++;
        }
      });
      
      this.ready2 = true;
      this.game.load.start();//Carga nuevas imagenes
    }
  },
  
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
},{}]},{},[1])