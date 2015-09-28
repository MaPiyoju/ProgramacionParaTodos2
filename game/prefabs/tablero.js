'use strict';

var Entidad = require('../prefabs/entidad');

var Tablero = function(game, x, y ,xCuadros , yCuadros, parent){
  Phaser.Group.call(this, game, parent);  

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.xCuadros = xCuadros;
  this.yCuadros = yCuadros;
  this.dimension = 50;

  //Fondo de tablero
  //this.fondoTablero = this.game.add.sprite(x-5,y-4,'fondoTablero');
  //this.add(this.fondoTablero);

  //Se dibuja el tablero con base en los valores de entrada
  for(var i=0;i<xCuadros;i++){
    for(var j=0;j<yCuadros;j++){
      this.dibujarCuadro(x+(i*this.dimension),y+(j*this.dimension),this.dimension);
    }
  }
  this.enableBody = true;//Habilitacion de colisiones en cada elemento del grupo
};

Tablero.prototype = Object.create(Phaser.Group.prototype);
Tablero.constructor = Tablero;

Tablero.prototype.update = function() {
  
};

Tablero.prototype.dibujarCuadro = function(x,y,dimension) {
  var cuadro = this.game.add.graphics( 0, 0 );
  cuadro.beginFill(0x272822, 1);
  cuadro.lineStyle(1, 0xffffff);
  cuadro.bounds = new PIXI.Rectangle(x, y, dimension, dimension);
  cuadro.drawRect(x, y, dimension, dimension);
  this.add(cuadro);
};

Tablero.prototype.setObjCuadro = function(i, j, obj, sprite, frame){
  if(obj != ''){//Creacion objeto nuevo en tablero de juego
    var obj = new Entidad(this.game,this.x+(i*this.dimension),this.y+(j*this.dimension),obj,frame);
    obj.i = i;
    obj.j = j;
    this.add(obj);
  }else{//Actualizacion posicion objeto en tablero de juego
    sprite.x = this.x+(i*this.dimension);
    sprite.i = i;
    sprite.propiedades[0].val = i;//Se actualiza el valor en propiedades
    sprite.y = this.y+(j*this.dimension);
    sprite.j = j;
    sprite.propiedades[1].val = j;//Se actualiza el valor en propiedades
  }
  return obj;
}

Tablero.prototype.destruir = function() {
 
};

module.exports = Tablero;