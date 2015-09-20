  'use strict';
  var Pausa = require('../prefabs/pause');
  var Alert = require('../prefabs/alert');

  function Nivel1() {}

  Nivel1.prototype = {

    //Definición de propiedades globales de nivel
    maxtime: 60,
    flagpause: false,
    intro:true,

    init: function(){
      this.maxtime= 60;
      this.flagpause= false; 
      this.intro = true;  
    },

    create: function(){
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data'));
      this.situaLength = this.levelData.dataSitua.length;//Cantidad de situaciones de nivel

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

    empezar: function(){
      this.intro = false;//Se deshabilita el intro de juego
      this.introImg.kill();//Se elimina imagen de intro

      this.game.add.tileSprite(0, 0,800,1920, 'tile_nivel1');//Fondo de juego
      this.game.add.sprite(15,50,'fondoSit');//Fondo de situacion
      this.game.add.sprite(345,55,'fondoSlot');//Fondo de slots
      this.random = Math.floor(Math.random() * this.situaLength);//Se realiza la carga de una situación de forma aleatoria
      this.slotGroup = this.game.add.group();//Se realiza creacion de grupo de slots
      this.accionGroup = this.game.add.group();//Se realiza creacion de grupo de acciones
      this.crearSitua(this.random);//Crear situacion de acuerdo al parametro aleatorio generado
      this.btnValidar = this.game.add.button(540,320,'btnConfirmar',this.ejecutar,this);

      this.alert = new Alert(this.game);//Creacion onjeto de alerta
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
      if(this.levelData.dataSitua[nSitua].situaImg){//En caso de contar con imagen para la situacion
        var keySitua = 'situa' + (nSitua+1);//Generacion nombre llave de imagen de acuerdo a situacion
        this.game.add.sprite(70,70,keySitua);//Creacion imagen situacion
      }
      this.txtSitua = this.game.add.bitmapText(35, 80, 'font', this.levelData.dataSitua[nSitua].situaTxt,24);//Se agrega texto de situacion
      this.txtSitua.maxWidth = 280;
      this.txtSitua.align = "center";

      //Se realiza creación de slots de acuerdo a numero de pasos de situacion
      var col = Math.ceil(this.levelData.dataSitua[nSitua].nPasos/2);//Se define el numero de columnas
      var par = (this.levelData.dataSitua[nSitua].nPasos % 2 == 0)?true:false;//Numero par de slots?
      var contSlot = 0;
      var xIniSl = 350;//Definicion posicion x Inicial para slot
      
      for(var i=0;i<2;i++){
        var yIniSl = 60;//Definicion posicion y Inicial para slot
        for(var j=0;j<col;j++){
          if(!par && i == 1 && (j == (col-1))){//En caso de ser numero impar de pasos, no se realiza la creacion del ultimo slot
            break;
          }
          var slot = this.game.add.sprite(xIniSl,yIniSl,'slot');//Creacion slot
          slot.nPaso = contSlot;//Asiganacion de nummero de paso para slot
          slot.txtPaso = this.game.add.bitmapText((slot.x + slot.width - 15), slot.y+5, 'font', (slot.nPaso+1).toString(), 14);
          contSlot++;//Incremento de paso para siguiente slot
          this.slotGroup.add(slot);//Se incluye el elemento creado en el grupo de slots
          //this.slotGroup.add(slot.txtPaso);
          yIniSl += 100;//Aumento y para siguiente slot
        }
        xIniSl += 210;//Aumento x para siguiente slot
      }

      //Se realiza creación de acciones o pasos de acuerdo a la situacion
      var xIniAcc = 150;//Definicion posicion X inicial para acciones
      var yIniAcc = 400;//Definicion posicion Y inicial para acciones
      var thisTemp = this;
      var cont = 0;//Contador para control de creacion de acciones
      this.levelData.dataSitua[nSitua].accion.forEach(function(data){
        var accion = thisTemp.game.add.sprite(xIniAcc,yIniAcc,'fondoAcc');//Creacion objeto de accion
        accion.texto = thisTemp.game.add.bitmapText(accion.x, accion.y, 'font', data.txt);//Se agrega el texto de la accion
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
      this.txtSitua.text = '';
      this.slotGroup.removeAll();
      this.accionGroup.removeAll();
    },

    revolverItems: function(){
      var posiciones = new Array();//Array de control para asignacion de posiciones de elementos
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
              item.newX = 100 + (item.width + 15) * i + 15;
              item.newY = 400 + (item.height + 5) * j;
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

    clickItem: function(item){
      this.itemSelec = true;//Se habilita la seleccion de item para movimiento
      this.textoItem = item.texto;//Se establece el texto del item seleccionado para movimiento
      item.movimiento = true;//Se habilita el movimiento del item
      //Se actualizan las posiciones en Z del grupo de acciones para posicionar el seleccionado sobre todo
      item.anchor.setTo(0.5,0.5);
      item.texto.anchor.setTo(0.5,0.5);
      item.bringToTop(); 
      item.texto.parent.bringToTop(item.texto);           
      this.accionGroup.updateZ();
    },

    releaseItem: function(item){
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
            item.texto.anchor.setTo(-0.5,-0.5);
            item.texto.x = slot.x;//Se establece la posicion en X para el texto sobre el slot
            item.texto.y = slot.y;//Se establece la posicoin en Y para el texto sobre el slot

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
    },

    ejecutar: function () {
      //Se realiza validacion de acciones sobre slots
      var cont = 0;//Conteo de acciones sobre slots
      var thisTemp = this;
      var control = true;//Control para etapas de validacion
      this.slotGroup.forEach(function(slot){//Conteo y control de slots llenos
        if(!slot.hasOwnProperty('accion')){
          control = false;
          thisTemp.alert.show('Creo que aun faltan pasos por completar, sigue intentando!');
          return;
        }
      });
      if(control){//Habilitacion para nueva validacion
        this.slotGroup.forEach(function(slot){//Control de slots con elementos invalidos
          if(!slot.valido){
            control = false;
            thisTemp.alert.show('Ups, algo no anda bien. Intentalo de nuevo!');
            return;
          }
        });
      }
      if(control){//Habilitacion para nueva validacion
        this.slotGroup.forEach(function(slot){//Control de slots con elementos en orden correcto
          if(slot.nPaso != slot.accion){
            control = false;
            thisTemp.alert.show('Estas cerca, comprueba tus opciones. Intentalo de nuevo!');
            return;
          }
        });
      }

      //En caso de superar cada validacion, acciones de situacion correcta
      if(control){
        this.limpiarSitua();
        this.random = Math.floor(Math.random() * this.situaLength);//Se realiza la carga de una situación de forma aleatoria
        this.crearSitua(this.random);
      }
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