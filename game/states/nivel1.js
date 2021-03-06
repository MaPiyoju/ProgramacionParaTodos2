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