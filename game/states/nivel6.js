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