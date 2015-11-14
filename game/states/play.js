  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.btns = this.game.add.group();
      this.crearBoton(0,0,'nivel1',205,50,'Hola, en este nivel aprenderás lo básico frente a algoritmos por medio de diversos ejecicios. Intentalo! ',true);
      this.crearBoton(0,100,'nivel2',205,150,'Necesitas mejorar tus conocimientos sobre tipos de datos?, aquí esta todo lo que necesitas! ',true);
      this.crearBoton(0,200,'nivel3',205,250,'Sumergete en el manejo y evaluación adecuada de expresiones por medio de este divertido juego! ',true);
      this.crearBoton(0,300,'nivel4',205,350,'Ya sabes como evaluar una expresión? Ahora aprende como construirla. Ponte a prueba con este juego! ',true);
      this.crearBoton(0,400,'nivel5',205,450,'',false);
      this.crearBoton(0,500,'nivel6',205,550,'',true);

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