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