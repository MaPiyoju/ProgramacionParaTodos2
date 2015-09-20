  'use strict';

  // Create our pause panel extending Phaser.Group
  var Alert = function(game, parent){
    Phaser.Group.call(this, game, parent);

    //Se define el texto de alerta
    this.txtInfo = this.game.add.bitmapText(this.game.world.centerX,this.game.world.centerY,'font','',30);//Texto para retroalimentacion de nivel
    this.txtInfo.anchor.setTo(0.5,0.5);
    this.txtInfo.maxWidth = 400;
    this.txtInfo.align = "center";
    this.add(this.txtInfo);

    //Se define el boton continuar de alerta
    this.btnContinuar = this.game.add.button(this.game.world.centerX,this.txtInfo.y + 70, 'btnContinuar',this.hide,this);
    this.btnContinuar.anchor.setTo(0.5,0);
    this.add(this.btnContinuar);

    this.visible = false;
  };

  Alert.prototype = Object.create(Phaser.Group.prototype);
  Alert.constructor = Alert;

  Alert.prototype.show = function(texto){//Evento mostrar alerta
    this.txtInfo.text = texto;
    this.visible = true;
  };

  Alert.prototype.hide = function(){//Evento ocultar alerta
    this.txtInfo.text = "";
    this.visible = false;
  };
 
  module.exports = Alert;