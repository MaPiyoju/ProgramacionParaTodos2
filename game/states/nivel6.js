
  'use strict';
  var Pausa = require('../prefabs/pause');
  var textBox = require('../prefabs/textBox');

  function Nivel6() {}
  Nivel6.prototype = {
    //Definición de propiedades globales de nivel
    maxtime: 60,
    flagpause:false,
    intro:true,
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

    init:function(){
      this.maxtime= 60; 
      this.itemX= 0;
      this.itemY= 0;
      this.flagpause=false;
      this.intro=true;
      this.intSituacion=0;
      this.slotCiclo=false;
      this.slotAccion_1=false;
      this.score = 0;
      this.situaLength = 0;
      this.nCorrectas=0;
      this.nIntentos=0;
      this.nSituaciones = 0;
    },

  	create: function() {
      //Parseo de datos de juego para su uso
      this.levelData = JSON.parse(this.game.cache.getText('data6'));
      this.situaLength = this.levelData.dataSitua.length;//Cantidad de situaciones de nivel

      this.game.world.setBounds(0, 0, 800, 600);
      //Fondo de juego
      this.game.add.tileSprite(0, 0,800,600, 'introN6');
      this.game.input.onDown.add(this.iniciarJuego,this);

      this.game.add.bitmapText(55, 170, 'font', 'Espero que la estes\npasando bien, y estes\npreparado para este\nnivel. En esta ocasión\naprenderemos estructuras\ncíclicas, deberas formar\nciclos que permitan\ndar solución a diversas\nsituaciones. Recuerda\nanalizar cuidadosamente\ncada opción para dar\nla mejor respuesta y\nasí superar cada reto\n\nComencemos!', 24);
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

      //Se define el contador de controlde nivel
      this.tiempo = this.game.time.create(false);
      this.tiempo.loop(1000, this.updateTimer, this);//Contador de juego      

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
      this.btnwhile = this.game.add.sprite(546, 100,'btnwhile');
      this.btnwhile.inputEnabled = true;
      this.btnwhile.events.onInputDown.add(this.listenerwhile, this);

      //boton ciclo for
      this.btnfor = this.game.add.sprite(546, 222,'btnfor');
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
    },

    update:function(){
      if(!this.intro){
        var mouseX = this.game.input.x;
        var mouseY = this.game.input.y;
        this.items.forEach(function(item) {
          //Se verifican los items para realizar su movimiento en caso de click
          if(item.movimiento == true){          
            item.body.x = mouseX
            item.body.y = mouseY;
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
      this.situaGroup.add(this.pasos);
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
          this.nCorrectas++;
          //Se ejecuta la animacion 
          this.situacion.visible = false;
          if(this.SituacionCorrecta != null ){this.SituacionCorrecta.kill();}
          var keySitua = '';
          if(this.levelData.dataSitua[this.intSituacion].ImageUrl){//En caso de contar con imagen para la situacion
            keySitua = 'niv6_situa' + (this.intSituacion+1) +'_Correct';//Generacion nombre llave de imagen de acuerdo a situacion
          }else{
            keySitua = 'situacion0';//Situacion generica en caso de no contar con imagen
          }      
          //Imagen inicial de la sitacion            
          this.SituacionCorrecta = this.game.add.sprite(30,60,keySitua);
          this.situaGroup.add(this.SituacionCorrecta);//Creacion imagen situacion
          this.marcoSitua.bringToTop();
          this.situaGroup.updateZ();
          var anim = this.SituacionCorrecta.animations.add('anima',[0,1,2,3,4,5,6,7], 5, false); 
          anim.onComplete.add(function(){
            game.slotCiclo = game.slotAccion_1 = false; 
            game.score += 10;
            game.scoretext.setText('Puntaje: ' + game.score);
            game.SituacionCorrecta.kill();
            //Se crea situacion aleatoria      
            game.crearSitua();  
          });
          this.SituacionCorrecta.animations.play('anima');
        }else{
          //Se ejecuta la animacion 
          this.situacion.visible = false;   
          if(this.SituacionCorrecta != null ){this.SituacionCorrecta.kill();}
          var keySitua = '';
          if(this.levelData.dataSitua[this.intSituacion].ImageUrl){//En caso de contar con imagen para la situacion
            keySitua = 'niv6_situa' + (this.intSituacion+1) +'_Error';//Generacion nombre llave de imagen de acuerdo a situacion
          }else{
            keySitua = 'situacion0';//Situacion generica en caso de no contar con imagen
          }      
          //Imagen inicial de la sitacion            
          this.SituacionCorrecta = this.game.add.sprite(30,60,keySitua);
          this.situaGroup.add(this.SituacionCorrecta);//Creacion imagen situacion
          this.marcoSitua.bringToTop();
          this.situaGroup.updateZ();
          var anim = this.SituacionCorrecta.animations.add('anima',[0,1,2,3,4,5,6,7], 5, false); 
          anim.onComplete.add(function(){
              
          });
          this.SituacionCorrecta.animations.play('anima');                   
        }        
      }
    },

    listenerwhile:function(){
      //Se restablece el tiempo          
      this.tiempo.start();
      //Ocultamos los botones del ciclo for y while
      this.btnwhile.visible = false;
      this.btnfor.visible = false;
      //Creamos el slot de la estructura del ciclo
      this.slot = this.items.create(479,100,'slotciclo');

      //creamos las acciones de la situación
      var yitem = 350;
      var CItems = this.items;
      var game = this;

      this.levelData.dataSitua[this.intSituacion].Ciwhile.SlotAccion.forEach(function(acciontext) {
          var item = CItems.create(535,yitem,'accion_small6');
          item.tipo = 0;
          item.anchor.setTo(0.5,0.5);          
          item.texto = game.game.add.bitmapText(item.x, item.y, 'fontData',acciontext.texto,13);
          item.texto.maxWidth = 156;
          item.respuesta = acciontext.ok;
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });

      //creamos las condiciones de la situación
      yitem = 350;
      this.levelData.dataSitua[this.intSituacion].Ciwhile.Slot.forEach(function(condiciontext) {
          var item = CItems.create(690,yitem,'condicion6');          
          item.tipo = 1;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.bitmapText(item.x, item.y, 'fontData',condiciontext.texto,14);
          item.texto.maxWidth = 132;
          item.respuesta = condiciontext.ok;
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });
    },

    listenerfor:function(){
      //Se restablece el tiempo     
      this.tiempo.start();
      //Ocultamos los botones del ciclo for y while
      this.btnwhile.visible = false;
      this.btnfor.visible = false;
      //Creamos el slot de la estructura del ciclo
      this.slot = this.items.create(479,100,'slotciclo');

      //creamos las acciones de la situación
      var yitem = 350;
      var CItems = this.items;
      var game = this;

      this.levelData.dataSitua[this.intSituacion].Cifor.SlotAccion.forEach(function(acciontext) {
          var item = CItems.create(535,yitem,'accion_small6');
          item.tipo = 0;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.bitmapText(item.x, item.y, 'fontData',acciontext.texto,14);
          item.texto.maxWidth = 156;
          item.respuesta = acciontext.ok;
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });

      //creamos las condiciones de la situación
      yitem = 350;
      this.levelData.dataSitua[this.intSituacion].Cifor.Slot.forEach(function(condiciontext) {
          var item = CItems.create(690,yitem,'condicion6');          
          item.tipo = 1;
          item.anchor.setTo(0.5,0.5);
          item.texto = game.game.add.bitmapText(item.x, item.y, 'fontData',condiciontext.texto,14);
          item.texto.maxWidth = 132;
          item.respuesta = condiciontext.ok;
          item.texto.anchor.setTo(0.5,0.5);
          item.inputEnabled = true;
          item.events.onInputDown.add(game.clickItem, game);
          item.events.onInputUp.add(game.releaseItem, game);
          yitem+=40;
      });

    },
    
    clickItem : function(item){
      this.itemX = item.x;
      this.itemY = item.y;
      item.movimiento = true;      
    },

    releaseItem:function(item){
      if(item.movimiento){
        item.movimiento = false;
        //Se define cuadro imaginario para las acciones
        if(item.tipo == 0 && item.body.y >= (this.slot.body.y + 40) && item.body.y <= (this.slot.body.y + 104) && item.body.x >= (this.slot.body.x + 38) && item.body.x <= (this.slot.body.x + 270) ){
          if(!this.slotAccion_1){
            //Creamos el item el cual encaja en el slot de la accion          
            var itemEncajado = this.items.create( (this.slot.body.x + 146),(this.slot.body.y + 93),'accion_large6');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.respuesta = item.respuesta;
            itemEncajado.texto.fontSize = 20;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slot1 = true;          
            item.kill();            
          }else{

            this.items.forEach(function(itemslot1) {
              if(itemslot1.slot1){
                var textoAnt = itemslot1.texto;
                var respuesAnt = itemslot1.respuesta;
                itemslot1.texto = item.texto;
                itemslot1.respuesta = item.respuesta;
                itemslot1.texto.fontSize = 20;
                itemslot1.texto.x = itemslot1.x;
                itemslot1.texto.y = itemslot1.y;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                item.respuesta = respuesAnt;
                item.texto.fontSize = 14;
              }
            });
            item.x = this.itemX;
            item.y = this.itemY;
            item.texto.x = item.x;
            item.texto.y = item.y;
          }
          //indicamos que el primer slot se ha ocupado
          this.slotAccion_1 = true;
        }else if(item.tipo == 1 && item.body.y >= (this.slot.body.y + 7) && item.body.y <= (this.slot.body.y + 40) && item.body.x >= (this.slot.body.x + 68) && item.body.x <= (this.slot.body.x + 220) ){
          if(!this.slotCiclo){
            //Creamos el item el cual encaja en el slot de la accion          
            var itemEncajado = this.items.create( (this.slot.body.x + 126),(this.slot.body.y + 29),'condicion6');
            itemEncajado.anchor.setTo(0.5,0.5);
            itemEncajado.texto = item.texto;
            itemEncajado.respuesta = item.respuesta;
            itemEncajado.texto.x = itemEncajado.x;
            itemEncajado.texto.y = itemEncajado.y;
            itemEncajado.slotC = true;          
            item.kill();
            
          }else{

            this.items.forEach(function(itemslot1) {
              if(itemslot1.slotC){
                var textoAnt = itemslot1.texto;
                var respuesAnt = itemslot1.respuesta;
                itemslot1.texto = item.texto;
                itemslot1.respuesta = item.respuesta;
                itemslot1.texto.x = itemslot1.x;
                itemslot1.texto.y = itemslot1.y;
                //actualizamos el item arrastrado con el texto del item en el slot
                item.texto = textoAnt;
                item.respuesta = respuesAnt;
                item.texto.fontSize = 14;
              }
            });
            item.x = this.itemX;
            item.y = this.itemY;
            item.texto.x = item.x;
            item.texto.y = item.y;
          }
          //indicamos que el primer slot se ha ocupado
          this.slotCiclo = true;
        }else{
          item.x = this.itemX
          item.y = this.itemY;
          item.texto.x = item.x;
          item.texto.y = item.y;
        }
      }
    },
    
  };

  module.exports = Nivel6;