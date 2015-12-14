'use strict';

// Creacion de elemento Entidad extendiendo Phaser.Sprite
var Entidad = function(game, x, y, key,frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);//Creacion de objeto sprite

  /*Definicion de propiedades*/
  this.posx = 0;//Posicion relativa de x en el tablero
  this.posy = 0;//Posicion relativa de y en el tablero
  this.propiedades = [{nombre:"Posicion X",prop:"posx",val:this.posx},
                {nombre:"Posicion Y",prop:"posy",val:this.posy}];
};

Entidad.prototype = Object.create(Phaser.Sprite.prototype);
Entidad.prototype.constructor = Entidad;

Entidad.prototype.update = function() {
};

module.exports = Entidad;
