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
    habilMov: true,

    init: function(){
      this.maxtime= 120;
      this.flagpause= false; 
      this.intro = true;
      this.movimiento = 0;
      this.gusanoGroup = [];
      this.cuerpoGroup = [];
      this.itemGroup = [];
      this.pasoActual = 0;
      this.habilMov = true;

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
      this.game.input.onDown.add(this.iniciarJuego,this);
      this.txtIntro = this.game.add.bitmapText(195, 300, 'fontData', 'Hola, con el fin de aprender sobre los diferentes tipos de dato básico, en este nivel deberas relacionar los diferentes datos que van cayendo frente al tipo de dato solicitado.\n\nAdelante!', 24);
      this.txtIntro.anchor.setTo(0.5,0.5);
      this.txtIntro.maxWidth = 250;
    },

    iniciarJuego : function(game){
      var x1 = 115;
      var x2 = 264;
      var y1 = 480;
      var y2 = 550;
      if(game.x > x1 && game.x < x2 && game.y > y1 && game.y < y2 ){
        if(this.intro){
          this.btnSound.play();
          this.empezar();
        }
      }
    },

    empezar: function(){
      this.physics = this.game.physics.startSystem(Phaser.Physics.ARCADE);//Habilitacion de fisicas
      this.intro = false;//Se deshabilita el intro de juego
      this.introImg.kill();//Se elimina imagen de intro

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel3');//Fondo de juego
      this.tablero = new Tablero(this.game, 50, 20 ,12 , 10, 'tablero_3');//Creacion de tablero de movimiento
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
    },

    updateMov: function(){
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
          this.malSound.play();
          continuar = false;
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