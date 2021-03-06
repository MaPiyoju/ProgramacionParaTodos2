'use strict';

// Creacion de panel de alerta extendiendo Phaser.Group
var Entidad = require('../prefabs/entidad');

var Tablero = function(game, x, y ,xCuadros , yCuadros, tablero, tableroMarco, parent){
  Phaser.Group.call(this, game, parent);  //Creacion de objeto de grupo

  /*Definicion de propiedades*/
  this.x = x;
  this.y = y;
  this.xCuadros = xCuadros;//Cuadros de ancho de tablero
  this.yCuadros = yCuadros;//Cuadros de alto del tablero
  this.dimension = 50;//Dimension de cuadros de tablero

  //Fondo de tablero
  this.fondoTableroF = this.game.add.sprite(x,y,tablero);
  this.fondoTablero = this.game.add.sprite(x-30,y-28,tableroMarco);
  this.add(this.fondoTableroF);
  this.add(this.fondoTablero);

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
  //cuadro.beginFill(0x272822, 1);
  cuadro.lineStyle(1, 0xffffff);
  cuadro.bounds = new PIXI.Rectangle(x, y, dimension, dimension);
  cuadro.drawRect(x, y, dimension, dimension);
  this.add(cuadro);
};

Tablero.prototype.setObjCuadro = function(i, j, obj, sprite, frame){
  if(obj != ''){//Creacion objeto nuevo en tablero de juego
    var obj = new Entidad(this.game,this.x+(i*this.dimension)+(this.dimension/2),this.y+(j*this.dimension)+(this.dimension/2),obj,frame);
    obj.anchor.setTo(0.5,0.5);
    obj.i = i;
    obj.j = j;
    this.add(obj);
  }else{//Actualizacion posicion objeto en tablero de juego
    sprite.x = this.x+(i*this.dimension)+(this.dimension/2);
    sprite.i = i;
    sprite.propiedades[0].val = i;//Se actualiza el valor en propiedades
    sprite.y = this.y+(j*this.dimension)+(this.dimension/2);
    sprite.j = j;
    sprite.propiedades[1].val = j;//Se actualiza el valor en propiedades
  }
  return obj;
}

Tablero.prototype.setTexto = function(i, j, txt, obj_) {//Creacion objetos detexto en tablero
  if(obj_){//Actualizacion posicion objeto de texto existente
    obj_.x = this.x+(i*this.dimension)+(this.dimension/2);
    obj_.y = this.y+(j*this.dimension);
  }else{//Nuevo objeto de texto
    var obj = this.game.add.bitmapText(this.x+(i*this.dimension)+(this.dimension/2), this.y+(j*this.dimension), 'fontData', txt, 22);
    obj.align = "center";
    obj.anchor.setTo(0.5,-0.5);
    this.add(obj);
    return obj;
  }
};

Tablero.prototype.destruir = function() {
 
};

module.exports = Tablero;