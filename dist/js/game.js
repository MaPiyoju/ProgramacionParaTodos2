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
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/nivel1":9,"./states/nivel2":10,"./states/nivel3":11,"./states/play":12,"./states/preload":13}],2:[function(require,module,exports){
  'use strict';

  // Create our pause panel extending Phaser.Group
  var Alert = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Fondo de alerta
    this.fondo = this.game.add.sprite(0,0,'alert')
    this.add(this.fondo);

    //Se define el texto de alerta
    this.txtInfo = this.game.add.bitmapText(this.game.world.centerX,this.game.world.centerY-100,'font','',30);//Texto para retroalimentacion de nivel
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
            this.game.paused = false;
            this.hide();                  
            this.game.state.clearCurrentState();
            game.game.state.start("play");
          }
      }else if(game.x > (this.game.width/2) + 60 && game.x < (this.game.width/2) + 105 && game.y > y1 && game.y < y2 ){
          //Opcion ayuda
           if(this.game.paused){
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
    this_.game.state.clearCurrentState();
    game.game.state.start("play");
  };
  
  Pause.prototype.repetirBtn = function(this_,game) {
    this.game.state.clearCurrentState();    
    game.game.state.start(game.game.state.current);
  };
 
  module.exports = Pause;
},{}],5:[function(require,module,exports){
'use strict';

var Entidad = require('../prefabs/entidad');

var Tablero = function(game, x, y ,xCuadros , yCuadros, parent){
  Phaser.Group.call(this, game, parent);  

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.xCuadros = xCuadros;
  this.yCuadros = yCuadros;
  this.dimension = 50;

  //Fondo de tablero
  //this.fondoTablero = this.game.add.sprite(x-5,y-4,'tablero');
  //this.add(this.fondoTablero);

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
  cuadro.beginFill(0x272822, 1);
  cuadro.lineStyle(1, 0xffffff);
  cuadro.bounds = new PIXI.Rectangle(x, y, dimension, dimension);
  cuadro.drawRect(x, y, dimension, dimension);
  this.add(cuadro);
};

Tablero.prototype.setObjCuadro = function(i, j, obj, sprite, frame){
  if(obj != ''){//Creacion objeto nuevo en tablero de juego
    var obj = new Entidad(this.game,this.x+(i*this.dimension),this.y+(j*this.dimension),obj,frame);
    obj.i = i;
    obj.j = j;
    this.add(obj);
  }else{//Actualizacion posicion objeto en tablero de juego
    sprite.x = this.x+(i*this.dimension);
    sprite.i = i;
    sprite.propiedades[0].val = i;//Se actualiza el valor en propiedades
    sprite.y = this.y+(j*this.dimension);
    sprite.j = j;
    sprite.propiedades[1].val = j;//Se actualiza el valor en propiedades
  }
  return obj;
}

Tablero.prototype.setTexto = function(i, j, txt) {
  var obj = this.game.add.bitmapText(this.x+(i*this.dimension), this.y+(j*this.dimension), 'font', txt, 28);
  obj.anchor.setTo(0,-0.5);
  this.add(obj);
  return obj;
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
  },

  restartGame: function() {
    this.bgMusic.stop();
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
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
    maxtime: 300,
    flagpause: false,
    intro:true,

    //Contadores para stats de nivel
    nSituaciones: 0,
    nCorrectas: 0,
    nIntentos: 0,

    //Mensajes retroalimentacion nivel
    msjVacios: ['Creo que aun faltan pasos por completar, sigue intentando!','Completa tu algoritmo para cumplir con el objetivo','Recuerda que todos los pasos del algoritmo son importantes para cumplir con su objetivo'],
    msjOrden: ['Estas cerca, comprueba tus opciones.','Recuerda, un algoritmo es una serie de pasos correctamente ordenados.','El orden de los pasos no es el correcto, Revisa tu algoritmo y ordenalo correctamente.'],
    msjError: ['Ups, algo no anda bien. Intentalo de nuevo!','Tu algoritmo no cumple con el objetivo solicitado, intentalo de nuevo!','Ups, en tu algoritmo existen pasos que no cumplen o no son necesarios para cumplir con el objetivo'],

    init: function(){
      this.maxtime= 120;
      this.flagpause= false; 
      this.intro = true;  
      this.nSituaciones=0;
      this.nCorrectas=0;
      this.nIntentos=0;

      //Se incluyen audios de juego
      this.errorSound = this.game.add.audio('errorSound');
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data'));
      this.situaLength = this.levelData.dataSitua.length;//Cantidad de situaciones de nivel

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
      this.intro = false;//Se deshabilita el intro de juego
      this.introImg.kill();//Se elimina imagen de intro

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
          if(!par && i == 1 && (j == (fila-1))){//En caso de ser numero impar de pasos, no se realiza la creacion del ultimo slot
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
          delete item.slot;
        }

        var sobreSlot = false;//Variable de control posicion sobre slot
        //Se valida el elemento contra cada slot validando posiciones correctas
        this.slotGroup.forEach(function(slot){
          if(item.x > slot.x && item.x < (slot.x + slot.width)){
            if(item.y > slot.y && item.y < (slot.y + slot.height)){
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
          item.anchor.setTo(0.5,0.5);//Eje de objeto retorna al centro
          item.x = item.xPos;//Se retorna la posicion inicial X del elemento
          item.y = item.yPos;//Se retorna la posicion inicial Y del elemento
          item.texto.anchor.setTo(0.5,0.5);
          item.texto.x = item.xPos;//Se retorna la posicion inicial X del texto
          item.texto.y = item.yPos;//Se retorna la posicion inicial Y del elemento
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
    gravedad: {min:10,max:30},
    puntaje: 0,
    vidas: 5,
    intentos:0,
    aciertos:0,

    init: function(){
      this.maxtime= 60;
      this.flagpause= false; 
      this.intro = true;  
      this.puntaje = 0;
      this.vidas = 5;
      this.intentos = 0;
      this.aciertos = 0;
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data2'));

      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN1');
      this.game.input.onDown.add(this.iniciarJuego,this);
      this.game.add.bitmapText(60, 150, 'font', 'Bienvenido, ', 24);
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
      //Se indica que sale del intro
      this.intro = false;
    },

    solicitud: function(){
      this.tipoSolicitud = Math.floor(Math.random()*this.levelData.dataTipo.length - 1);
      this.txtSolicitud.frame = this.tipoSolicitud;
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
          item.texto = this.game.add.bitmapText(item.x, item.y - 25, 'font',this.levelData.dataTipo[tipo].exp[txtIndex], 24);//Creacion texto
          item.texto.anchor.setTo(0.5,0);

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
        item.texto = this.game.add.bitmapText(item.x, item.y - 25, 'font',"*" +this.levelData.dataTipo[tipo].exp[txtIndex] +"*"  , 24);//Creacion texto
        item.texto.anchor.setTo(0.5,0);

        item.body.gravity.y = Math.floor(Math.random()*this.gravedad.max)+this.gravedad.min;//Se agrega gravedad al objeto
      }
    },

    recogerItem: function (jugador, item) {
      this.intentos++;      
      if(this.tipoSolicitud == item.tipo){//Se comprueba que el item seleccionado sea el mismo tipo de la solicitud
        this.aciertos++;
        if(item.bonus == true){
          this.vidas++;
          this.updateVidas();//Se actualiza la barra de vida
        }
        this.puntaje+=20;
      }else{//En caso de ser un elemento diferente al tipo solicitad
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
      if(this.vidas == 0){
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
      this.retroFinal = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'final1');
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
    movimiento: 0,
    gusanoGroup: null,
    cuerpoGroup: null,
    itemGroup: null,
    res: 0,
    pasoActual: 0,

    init: function(){
      this.maxtime= 120;
      this.flagpause= false; 
      this.intro = true;
      this.movimiento = 0;
      this.gusanoGroup = [];
      this.cuerpoGroup = [];
      this.itemGroup = [];
      this.pasoActual = 0;
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data3'));
      this.situaLength = this.levelData.dataGusano.length;//Cantidad de situaciones de nivel

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

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel3');//Fondo de juego
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
      this.pasoActual = 0;
      this.random = Math.floor(Math.random()*this.levelData.dataGusano.length);
      this.txtExp = this.game.add.bitmapText(this.game.world.centerX, 20, 'font', this.levelData.dataGusano[this.random].exp, 28);
      this.res = eval(this.levelData.dataGusano[this.random].exp);
      this.nuevoPaso();
    },

    nuevoPaso: function(){
      this.itemGroup.forEach(function(item){
        item.destroy();
        item.txt.destroy();
      });
      this.itemGroup = [];
      if(this.pasoActual == this.levelData.dataGusano[this.random].nPasos){
        this.crearExpresion();
      }else{
        var thisTemp = this;
        var primerosPasos = this.levelData.dataGusano[this.random].pasos.filter(this.filtroPaso,this);
        primerosPasos.forEach(function(item){
          thisTemp.crearItem(item);
        });
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
      var item = this.tablero.setObjCuadro(xRandom, yRandom, 'itemGusano', null, 0);
      if(obj){
        item.ok = obj.ok;
        item.txt = this.tablero.setTexto(xRandom,yRandom, obj.txt);
      }
      this.itemGroup.push(item);
    },

    comerItem: function(cabeza, item){
      var continuar = true;
      if(item){
        if(item.ok){
          this.pasoActual++;
          this.nuevoPaso();
        }else{
          continuar = false;
        }
        item.destroy();
        item.txt.destroy();
      }
      if(continuar){//En caso de item correcto agrega una bola al cuerpo del gusano
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
      }else{//En caso de item erroneo se remueven items del cuerpo del gusano
        var bola = this.cuerpoGroup[this.cuerpoGroup.length-1];
        this.cuerpoGroup.pop();
        this.gusanoGroup.pop();
        bola.destroy();
      }
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
},{"../prefabs/alert":2,"../prefabs/pause":4,"../prefabs/tablero":5}],12:[function(require,module,exports){
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.btns = this.game.add.group();
      this.crearBoton(0,0,'nivel1',195,50,'');
      this.crearBoton(0,100,'nivel2',305,150,'');
      this.crearBoton(0,200,'nivel3',205,250,'');
      this.crearBoton(0,300,'nivel4',310,350,'');
      this.crearBoton(0,400,'nivel5',205,450,'');
      this.crearBoton(0,500,'nivel6',308,550,'');

      this.overSound = this.game.add.audio('menuoverSound');
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
},{}],13:[function(require,module,exports){

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
    this.load.spritesheet('item','assets/images/Nivel2/elementos.png',48,87);
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

    this.load.text('data3','assets/data/nivel3.json');//Datos nivel 3

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

},{}]},{},[1])