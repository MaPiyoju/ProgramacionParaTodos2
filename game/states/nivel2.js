  'use strict';
  var Pausa = require('../prefabs/pause');

  function Nivel1() {}
  Nivel1.prototype = {

    //Definición de propiedades
    scoreText: new Array(),
    score: {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0},
    maxtime: 60,
    flagpause: false,
    intro:true,

    init: function(){      
      this.scoreText= new Array();
      this.score= {tipoCadena:0,tipoNumero:0,tipoBool:0,tipoArray:0};
      this.maxtime= 60;
      this.flagpause= false; 
      this.intro = true;  
    },

    create: function(){
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

      this.game.world.setBounds(0, 0, 800, 600);

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego
      this.tiempo.loop(5000, this.crearItem, this);//Creacion de items
      this.tiempo.start();

      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'tile_nivel2');      

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
      //Habilitacion de fisicas sobre el jugador
      this.game.physics.arcade.enable(this.jugador);
      //Propiedades fisicas del jugador (Se agrega un pequeño rebote)
      //this.jugador.body.bounce.y = 0.2;
      this.jugador.body.gravity.y = 550;
      this.jugador.body.collideWorldBounds = true;

      //Se definen las animaciones del jugador
      this.jugador.animations.add('left', [14,13,12,11,10,9,8,7], 15, true);
      this.jugador.animations.add('right', [16,17,18,19,20,21,22,23], 15, true);

      this.jugador.animations.add('jump', [31,32,33,34,35,36,37,38,39], 15, true);
      this.jugador.animations.add('jump_left', [6,5,4,3,2,1,0], 15, true);
      this.jugador.animations.add('jump_right', [24,25,26,27,28,29,30], 15, true);

      this.jugador.esSalto = false;

      //Creacion del grupo de items
      this.items = this.game.add.group();
      //Habilitacion de colisiones 
      this.items.enableBody = true;

      //Control de score
      this.cuadroScore = this.game.add.sprite((this.game.width - 130),(this.game.height - 200),'');
      this.cuadroScore.fixedToCamera = true;
      this.scoreText[0] = this.game.add.bitmapText(this.cuadroScore.x + 90 , this.cuadroScore.y + 28, 'font', '0', 24);
      this.scoreText[0].fixedToCamera = true;
      this.scoreText[1] = this.game.add.bitmapText(this.cuadroScore.x + 90 , this.cuadroScore.y + 68, 'font', '0', 24);
      this.scoreText[1].fixedToCamera = true;
      this.scoreText[2] = this.game.add.bitmapText(this.cuadroScore.x + 90 , this.cuadroScore.y + 106, 'font', '0', 24);
      this.scoreText[2].fixedToCamera = true;
      this.scoreText[3] = this.game.add.bitmapText(this.cuadroScore.x + 90 , this.cuadroScore.y + 145, 'font', '0', 24);
      this.scoreText[3].fixedToCamera = true;
      
      //Imagen de fondo para el tiempo
      this.cuadroTime = this.game.add.sprite(((this.game.width)/2), 5,'time');
      this.cuadroTime.anchor.setTo(0.5, 0);
      this.cuadroTime.fixedToCamera = true;
      //Se setea el texto para el cronometro

      this.timer = this.game.add.bitmapText((this.game.width/2), 20, 'font', '00:00', 28);//this.game.add.text(((this.game.width)/2), 15 , '00:00', { font: '32px calibri', fill: '#000',align:'center' });

      this.timer.anchor.setTo(0.5, 0);
      this.timer.fixedToCamera = true; 

      this.cursors = this.game.input.keyboard.createCursorKeys();

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

    update: function() {
      if(!this.intro){
        this.game.physics.arcade.collide(this.jugador, this.platafGroup);

        this.jugador.body.velocity.x = 0;//Reseteo de velocidad horizontal si no se presentan acciones sobre el jugador
        //Movimiento de jugador
        if (this.cursors.left.isDown){//Movimiento a la izquierda
          this.jugador.body.velocity.x = -150;
          this.jugador.animations.play('jump_left');//Se muestra animacion de salto
        }else if (this.cursors.right.isDown){//Movimiento a la derecha
          this.jugador.body.velocity.x = 150;
          this.jugador.animations.play('jump_right');//Se muestra animacion de salto
        }else{//Idle          
          this.jugador.animations.stop();
          this.jugador.frame = 15;
        }
      }
    },

    crearItem: function(){
      for (var i = 0; i < 5; i++){
        var tipo = Math.floor(Math.random() * 4);//Numero aleatorio entre 0 y 3
        var xItem = Math.floor(Math.random() * (this.game.width - 32)) + 32;
        var yItem = -40;
        var item = this.items.create(xItem, yItem, 'item', tipo);
        item.tipo = tipo;
        item.body.gravity.y = 300;//Se agrega gravedad al objeto
        //item.body.bounce.y = 0.7 + Math.random() * 0.2;//Se agrega rebote al objeto
      }
    },

    recogerItem: function (jugador, item) {
        switch(item.tipo){
          case 0://Tipo cadena
            this.score.tipoCadena += 1;
            this.scoreText[0].setText(this.score.tipoCadena);
            break;
          case 1://Tipo numero
            this.score.tipoNumero += 1;
            this.scoreText[1].setText(this.score.tipoNumero);
            break;
          case 2://Tipo booleano
            this.score.tipoBool += 1;
            this.scoreText[2].setText(this.score.tipoBool);
            break;
          case 3://Tipo array
            this.score.tipoArray += 1;
            this.scoreText[3].setText(this.score.tipoArray);
            break;
        }
        item.kill();
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