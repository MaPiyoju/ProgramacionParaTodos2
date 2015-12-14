/*Se declara variables globales los cuales contienen las direcciones 
de los json*/
var data ;					
var filename ;

var direccion_nivel1 = "../juego/assets/data/nivel1.json";
var direccion_nivel2 = "../juego/assets/data/nivel2.json";
var direccion_nivel3 = "../juego/assets/data/nivel3.json";
var direccion_nivel4 = "../juego/assets/data/nivel4.json";
var direccion_nivel5 = "../juego/assets/data/nivel5.json";
var direccion_nivel6 = "../juego/assets/data/nivel6.json";
//textchange para cargar las imagenes
$("#txtfile").change(function(){
	var inputFileImage = document.getElementById("txtfile");

	var file = inputFileImage.files[0];
	filename = file.name;
	data = new FormData();

	data.append('archivo',file);
});	
//textchange para cargar las imagenes
$("#txtfile6").change(function(){
	var inputFileImage = document.getElementById("txtfile6");

	var file = inputFileImage.files[0];
	filename = file.name;
	data = new FormData();

	data.append('archivo',file);
});		


//Inicio de estructura angular
var miapp = angular.module('miapp',[]);
//Controlador nivel 1 angular js   
miapp.controller('ControllerNiv1', function () {
	//Declaración de variables				
	this.Situaciones = angular.copy(DatosJson);
	this.acciones = [];
	this.txtDescripcion = "";
	for (var i = 0; i < 12; i++) {
		this.acciones.push({
				"txt": ""						
		});
	}
	this.guardar = true;
	//evento cancelar el cual limpia los controles del nivel 1
	this.cancelar = function(){
		this.Situaciones = angular.copy(DatosJson);
		this.acciones = [];
		this.txtDescripcion = "";
		for (var i = 0; i < 12; i++) {
			this.acciones.push({
					"txt": ""						
			});
		}
		this.guardar = true;
		this.txtNPasos = "";
	};
	//evento para cargar los datos de la situción seleccionada en los controles 
	this.SelectSitua = function(indice){
		this.cancelar();
		this.guardar= false;
		this.IndiceEdit = indice;
		this.txtDescripcion = this.Situaciones.dataSitua[indice].situaTxt;	
		this.txtNPasos = this.Situaciones.dataSitua[indice].nPasos;	

		for (var i = 0; i < 12; i++) {
			this.acciones[i] = this.Situaciones.dataSitua[indice].accion[i];
		}		
	};
	//Evento para guardar la situacion en el json
	this.AddSituacion = function(){
		var game = this;
		
		for(var i=0;i<12;i++){			
			if(i < this.txtNPasos){
				this.acciones[i].ok = true;
				this.acciones[i].n = i;				
			}else{
				this.acciones[i].ok = false;
				delete this.acciones[i].n;
			}						
		}
		// se agrega nueva situación
		this.Situaciones.dataSitua.push({
			"situaImg": "assets/images/Nivel1/" + filename,
			"situaTxt": this.txtDescripcion,
			"nPasos": this.txtNPasos,
			"accion": this.acciones
		});						
		// Se envia por ajax a documento php que guarda el json en carpeta del servidor
		$.ajax({
			    data: {"JsonString" :  angular.toJson(game.Situaciones) , "direccion" : direccion_nivel1,"eliminar" : null},
			    type: "POST",
			    dataType: "json",
			    url: "SaveDocumento.php",
			    complete: function(resultado){
			    	var result = JSON.parse(resultado.responseText);
			    	if(result.Mensaje == "OK"){
				    	alert("Se ha creado la situación");
				    	DatosJson = result.Json;		
			    	}
			    	else{
		    			alert("Error al realizar la solicitud");
		    		}    	
			    }
			});
		//se enviar por ajax el guardado de la imagen
		$.ajax({

				url:"SaveImagen.php",

				type:'POST',

				contentType:false,

				data:data,

				processData:false,

				cache:false});


										
		
	};
	//evento para actualizar la situacion 
	this.EditSituacion = function(){
		var game = this;
		this.Situaciones.dataSitua[this.IndiceEdit].situaTxt = this.txtDescripcion;		
		//Si carga una imagen  se guarda en el servidor
		if(filename != null){
			//Se obtiene nueva ruta de la imagen a guardar
			this.Situaciones.dataSitua[this.IndiceEdit].situaImg = "assets/images/Nivel1/" + filename
			$.ajax({

					url:"SaveImagen.php",

					type:'POST',

					contentType:false,

					data:data,

					processData:false,

					cache:false});
		}
		//Se establecen los pasos del algoritmo
		this.Situaciones.dataSitua[this.IndiceEdit].nPasos = this.txtNPasos;	
		for(var i=0;i<12;i++){			
			if(i < this.txtNPasos){
				this.acciones[i].ok = true;
				this.acciones[i].n = i;				
			}else{
				this.acciones[i].ok = false;
				delete this.acciones[i].n;
			}						
		}

		this.Situaciones.dataSitua[this.IndiceEdit].accion = this.acciones;
		//se envia por ajax el json para guardar en el servidor
		$.ajax({
			    data: {"JsonString" :  angular.toJson(game.Situaciones) , "direccion" : direccion_nivel1,"eliminar" : null},
			    type: "POST",
			    dataType: "json",
			    url: "SaveDocumento.php",
			    complete: function(resultado){
			    	var result = JSON.parse(resultado.responseText);
			    	if(result.Mensaje == "OK"){
				    	alert("Se ha actualizado la situación");
				    	DatosJson = result.Json;		
			    	}else{
		    			alert("Error al realizar la solicitud");
		    		}  	    	
			    }
		});
		 
	};
	//evento para eliminar situaciones del nivel 1
	this.RemoveSit = function(indice){
		//url de la imagen para eliminarla de la carpeta 
		var urlElim = this.Situaciones.dataSitua[indice];
		this.Situaciones.dataSitua.splice(indice,1);
		var game = this;
		//se envia por ajax el json para guardar en el servidor
		$.ajax({
		    data: {"JsonString" :  angular.toJson(game.Situaciones) , "direccion" : direccion_nivel1, "eliminar" : "../"+urlElim.situaImg },
		    type: "POST",
		    dataType: "json",
		    url: "SaveDocumento.php",
		    complete: function(resultado){
		    	var result = JSON.parse(resultado.responseText);
		    	if(result.Mensaje == "OK"){
			    	alert("Se ha eliminado la situación");
			    	DatosJson = result.Json;		
		    	} else{
		    		alert("Error al realizar la solicitud");
		    	}		    	
		    }
		});
	};	
	
});  
//Controlador para el nivel 2
miapp.controller('ControllerNiv2',function(){
	this.TiposDatos = DatosNiv2;
	this.Reales = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "reales";	}))[0];
	this.Logicos = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "boolean";	}))[0];
	this.Enteros = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "enteros";	}))[0];
	this.Error = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "error";	}))[0];
	//Evento para agregar la expresion de datos
	this.AddExpresion = function(tipo){
		game=this;
		if(tipo == "Reales"){
			this.Reales.exp.push(this.txtexpreales);
			this.txtexpreales = "";
		}else if(tipo == "Logicos"){
			this.Logicos.exp.push(this.txtexplogicos);
			this.txtexplogicos = "";
		}else if(tipo == "Enteros"){
			this.Enteros.exp.push(this.txtexpenteros);
			this.txtexpenteros = "";
		}else if(tipo == "Error"){
			this.Error.exp.push(this.txtexperror);
			this.txtexperror ="";
		}
		//se envia por ajax el json para guardarlo en la carpeta del servidor
		$.ajax({
		    data: {"JsonString" :  angular.toJson(game.TiposDatos) , "direccion" : direccion_nivel2,"eliminar" : null},
		    type: "POST",
		    dataType: "json",
		    url: "SaveDocumento.php",
		    complete: function(resultado){
		    	var result = JSON.parse(resultado.responseText);
		    	if(result.Mensaje == "OK"){		    		
		    		DatosNiv2 = result.Json;	
		    	}else{
		    		alert("Error al realizar la solicitud");
		    	}	    	
		    }
		});
	};
	//evento para eliminar la expresion de los tipos de datos
	this.RemoveExpresion = function(indice,tipo){
		game=this;
		//dependiento del tipo se elimina la expresion
		if(tipo == "Reales"){
			this.Reales.exp.splice(indice,1);
		}else if(tipo == "Logicos"){
			this.Logicos.exp.splice(indice,1);
		}else if(tipo == "Enteros"){
			this.Enteros.exp.splice(indice,1);
		}else if(tipo == "Error"){
			this.Error.exp.splice(indice,1);
		}
		//se envia el json por ajax para guardar en la carpeta del servidor
		$.ajax({
		    data: {"JsonString" :  angular.toJson(game.TiposDatos) , "direccion" : direccion_nivel2,"eliminar" : null},
		    type: "POST",
		    dataType: "json",
		    url: "SaveDocumento.php",
		    complete: function(resultado){
		    	var result = JSON.parse(resultado.responseText);
		    	if(result.Mensaje == "OK"){		    		
		    		DatosNiv2 = result.Json;	
		    	}else{
		    		alert("Error al realizar la solicitud");
		    	}	    	
		    }
		});
	};

});
// Controlador del nivel 3
miapp.controller('ControllerNiv3',function(){
	//Declaracion variables globales
	this.indiceSelect = null;
	this.expresiones = DatosNiv3;
	this.txtExpresion = "";	
	this.nPasos = 0;		
	this.exp = [];
	this.pasos = [];	
	this.pasosOpciones = [];
	this.guardar = true;	
	//evento para calcular los pasos de la expresion aritmetica
	this.Calcularpasos = function(){
		var pasos = 0;
		var regular = /(\*|\/|\+|\-|div|mod)/;
		//dependiendo de los operadores se definen la cantidad de pasos
		for (var i = 0; i < this.txtExpresion.length; i++){
			if(this.txtExpresion[i].toUpperCase() == "D"){
				if((this.txtExpresion[i] + this.txtExpresion[i+1] + this.txtExpresion[i+2]).toUpperCase() == "DIV"){
					pasos++;
				}				
			}else if(this.txtExpresion[i].toUpperCase() == "M")	{
				if((this.txtExpresion[i] + this.txtExpresion[i+1] + this.txtExpresion[i+2]).toUpperCase() == "MOD"){
					pasos++;
				}	
			}		
			else if(regular.exec(this.txtExpresion[i]) != null){
				pasos++;
			}
		};
		this.nPasos = pasos;
		this.exp = [];
		this.pasos = [];
		this.pasosOpciones = [];
		for(var i = 0; i < this.nPasos-1; i++){
			this.exp.push("");
		}
		for (var i = 0; i < this.nPasos; i++) {
			this.pasos.push(i);
			for (var j = 0; j < 5; j++) {
				this.pasosOpciones.push({
					"txt":"",
		           	"ok":(j==0?true:false),
		          	"n": i
				});		
			};
		}
	};
	// Evento para cancelar el cual limpia los controles del nivel 3
	this.cancelar = function(){
		this.txtExpresion = "";	
		this.nPasos = 0;		
		this.exp = [];
		this.pasos = [];	
		this.pasosOpciones = [];
		this.indiceSelect = null;
	}
	// evento para agregar la expresion a evaluar
	this.AddExpresionEva = function(){
		//se agrega la primera expresion al conjunto de los siguientes pasos
		this.exp.splice(0,0,this.txtExpresion);
		if(this.indiceSelect != null){
			this.expresiones.dataGusano.splice(this.indiceSelect,1);
			this.expresiones.dataGusano.splice(this.indiceSelect,0,
				{
					"exp": this.exp,
					"nPasos" : this.nPasos,
					"pasos": this.pasosOpciones
				}
			);
		}
		else{
			this.expresiones.dataGusano.push({
			"exp": this.exp,
			"nPasos" : this.nPasos,
			"pasos": this.pasosOpciones
			});
		}
		
		//Se envia por ajax el json para guardarlo en la carpeta del servidor
		var game = this;
		$.ajax({
			    data: {"JsonString" :  angular.toJson(game.expresiones) , "direccion" : direccion_nivel3,"eliminar" : null},
			    type: "POST",
			    dataType: "json",
			    url: "SaveDocumento.php",
			    complete: function(resultado){
			    	var result = JSON.parse(resultado.responseText);
			    	if(result.Mensaje == "OK"){
				    	alert("Se ha creado la situación");
				    	DatosNiv3 = result.Json;
			    	}
			    	else{
		    			alert("Error al realizar la solicitud");
		    		}    	
			    }
			});
		this.cancelar();
	};
	//Evento para selecionar la expresion y cargarla en los controles
	this.selectExpre = function(indice){
		this.indiceSelect = indice;
		this.pasos = [];
		this.txtExpresion = this.expresiones.dataGusano[indice].exp[0];
		this.exp = this.expresiones.dataGusano[indice].exp.slice(1,this.expresiones.dataGusano[indice].exp.length+1);
		//se cargan los pasos de la expresion
		this.nPasos = this.expresiones.dataGusano[indice].nPasos;
		for (var i = 0; i < this.nPasos; i++) {
			this.pasos.push(i);
		}
		this.pasosOpciones = this.expresiones.dataGusano[indice].pasos;
	};
	//Evento para eliminar la expresion del nivel 3 
	this.RemoveExpresionEva = function(indice){
		this.expresiones.dataGusano.splice(indice,1);
		var game = this;
		//Se envia por ajax el json para guardarlo en la carpeta del servirdor
		$.ajax({
		    data: {"JsonString" :  angular.toJson(game.expresiones) , "direccion" : direccion_nivel3, "eliminar" : null },
		    type: "POST",
		    dataType: "json",
		    url: "SaveDocumento.php",
		    complete: function(resultado){
		    	var result = JSON.parse(resultado.responseText);
		    	if(result.Mensaje == "OK"){
			    	alert("Se ha eliminado la expresión");
			    	DatosNiv3 = result.Json;		
		    	} else{
		    		alert("Error al realizar la solicitud");
		    	}		    	
		    }
		});
	}
	

});

//Controlador para nivel 4
miapp.controller('ControllerNiv4',function(){
	//Declaración de las variables globales del controlador
	this.indiceSelect = null;
	this.expresiones = DatosNiv4;
	this.txtExpresion = "";	
	this.nPasos = 0;
	this.exp = [];
	this.pasos = [];	
	this.pasosOpciones = [];
	this.guardar = true;
	//Evento para carlular los pasos de la expresion.	
	this.Calcularpasos = function(){				
		if(this.nPasos >= this.pasos.length){		
			for (var i = this.pasos.length; i < this.nPasos; i++) {
				this.pasos.push(i);
				for (var j = 0; j < 5; j++) {
					this.pasosOpciones.push({
						"txt":"",
			           	"ok":(j==0?true:false),
			          	"n": [i]
					});		
				}
			}
		}else{
			var count = this.pasos.length;
			
			for (var i = count; i > this.nPasos; i--) {
				this.pasos.splice(i-1,1);
				var countop = this.pasosOpciones.length;
				this.pasosOpciones.splice(countop-5,5);
			}
		}	
	};
	//Evento para cancelar y limpiar los controles del nivel 4
	this.cancelar = function(){
		this.txtExpresion = "";	
		this.nPasos = 0;
		this.exp=[];
		this.pasos = [];	
		this.pasosOpciones = [];
		this.indiceSelect = null;
	}
	//Evento para agregar la expresion del nivel 4
	this.AddExpresionEva = function(){
		//en caso de edicion de actualiza el json 
		this.exp.splice(0,0,this.txtExpresion);
		if(this.indiceSelect != null){
			this.expresiones.dataGusano.splice(this.indiceSelect,1);
			this.expresiones.dataGusano.splice(this.indiceSelect,0,
				{
					"exp": this.exp,
					"nPasos" : this.nPasos,
					"pasos": this.pasosOpciones
				}
			);
		}
		else{
			this.expresiones.dataGusano.push({
			"exp": this.exp,
			"nPasos" : this.nPasos,
			"pasos": this.pasosOpciones
			});
		}
		
		
		var game = this;
		//se envia el json por ajax para guardarlo en la carpeta del servidor
		$.ajax({
			    data: {"JsonString" :  angular.toJson(game.expresiones) , "direccion" : direccion_nivel4,"eliminar" : null},
			    type: "POST",
			    dataType: "json",
			    url: "SaveDocumento.php",
			    complete: function(resultado){
			    	var result = JSON.parse(resultado.responseText);
			    	if(result.Mensaje == "OK"){
				    	alert("Se ha creado la situación");
				    	DatosNiv3 = result.Json;
			    	}
			    	else{
		    			alert("Error al realizar la solicitud");
		    		}    	
			    }
			});
		this.cancelar();
	};
	//Se selecciona la expresion y se carga su informacion en los controles
	this.selectExpre = function(indice){
		this.indiceSelect = indice;
		this.pasos = [];
		this.txtExpresion = this.expresiones.dataGusano[indice].exp[0];
		this.exp = this.expresiones.dataGusano[indice].exp.slice(1,this.expresiones.dataGusano[indice].exp.length+1);
		this.nPasos = this.expresiones.dataGusano[indice].nPasos;
		for (var i = 0; i < this.nPasos; i++) {
			this.pasos.push(i);
		}
		this.pasosOpciones = this.expresiones.dataGusano[indice].pasos;
	};
	//Evento para eliminar la expresión a evaluar
	this.RemoveExpresionEva = function(indice){
		this.expresiones.dataGusano.splice(indice,1);
		var game = this;
		//Se envia por ajax el json para guardarlo en la carpeta del servidor
		$.ajax({
		    data: {"JsonString" :  angular.toJson(game.expresiones) , "direccion" : direccion_nivel4, "eliminar" : null },
		    type: "POST",
		    dataType: "json",
		    url: "SaveDocumento.php",
		    complete: function(resultado){
		    	var result = JSON.parse(resultado.responseText);
		    	if(result.Mensaje == "OK"){
			    	alert("Se ha eliminado la expresión");
			    	DatosNiv3 = result.Json;		
		    	} else{
		    		alert("Error al realizar la solicitud");
		    	}		    	
		    }
		});
	}
});
//Controlador del nivel 5
miapp.controller('ControllerNiv5',function(){	
	//Declaracion de variables globales del controlador nivel 5
	this.dataSitua = DatosNiv5;	
	this.nPasos = 0;
	this.pasos  = [];
	this.indiceSelect = null;	
	//Evento para cancelar y limpiar los controles del nivel 5
	this.cancelar = function(){
		this.nPasos = 0;
		this.pasos  = [];	
		this.indiceSelect = null;
	}
	//Evento para seleccionar la situacion y cargar la informacion en los controles
	this.selectExpre = function(indice){
		this.indiceSelect = indice;			
		this.nPasos = this.dataSitua.dataSitua[indice].nPasos;		
		this.pasos = this.dataSitua.dataSitua[indice].pasos;
	};
	//Evento para agregar la situacion
	this.AddSituacion = function(){		
		//en caso de editar se actualiza el json
		if(this.indiceSelect != null){
			this.dataSitua.dataSitua.splice(this.indiceSelect,1);
			this.dataSitua.dataSitua.splice(this.indiceSelect,0,
				{					
					"nPasos" : this.nPasos,
					"pasos": this.pasos
				}
			);
		}
		else{
			this.dataSitua.dataSitua.push({					
				"nPasos" : this.nPasos,
				"pasos": this.pasos
			});
		}
		//ciclo para eliminar la propiedad fin de todos los items excepto el ultimo
		for (var i = 0; i < this.dataSitua.dataSitua.length; i++) {
			for (var j = 0; j < this.dataSitua.dataSitua[i].pasos.length; j++) {
				if(j != (this.dataSitua.dataSitua[i].pasos.length-1)){
					delete this.dataSitua.dataSitua[i].pasos[j].fin ; 
				}
			};
		};
		
		var game = this;
		//Se envia por json el ajax para guardarlo en la carpeta del servidor
		$.ajax({
			    data: {"JsonString" :  angular.toJson(game.dataSitua) , "direccion" : direccion_nivel5,"eliminar" : null},
			    type: "POST",
			    dataType: "json",
			    url: "SaveDocumento.php",
			    complete: function(resultado){
			    	var result = JSON.parse(resultado.responseText);
			    	if(result.Mensaje == "OK"){
				    	alert("Se ha creado la situación");
				    	DatosNiv5 = result.Json;
			    	}
			    	else{
		    			alert("Error al realizar la solicitud");
		    		}    	
			    }
			});
		this.cancelar();
	}
	//Evento para calcular los pasos de la situación 
	this.CrearPasos = function(){
		for (var i = 0; i < this.nPasos; i++) {
			if(this.nPasos >= this.pasos.length){		
				for (var i = this.pasos.length; i < this.nPasos; i++) {
					this.pasos.push(
					{
			      		"txt": "",
			      		"accion": null,
		                "alterno": "",
		                "expAlt": 0,
		                "txtAccion": "",
		                "fin": ""
			      	});
				}
			}else{
				var count = this.pasos.length;
				
				for (var i = count; i > this.nPasos; i--) {
					this.pasos.splice(i-1,1);					
				}
			}	
		};
	}
	//Evento para eliminar la situacion del nivel 5
	this.RemoveExpresionEva = function(indice){
		this.dataSitua.dataSitua.splice(indice,1);
		var game = this;
		//Se envia por ajax el json para guardarla en la carpeta del servidor
		$.ajax({
		    data: {"JsonString" :  angular.toJson(game.dataSitua) , "direccion" : direccion_nivel5, "eliminar" : null },
		    type: "POST",
		    dataType: "json",
		    url: "SaveDocumento.php",
		    complete: function(resultado){
		    	var result = JSON.parse(resultado.responseText);
		    	if(result.Mensaje == "OK"){
			    	alert("Se ha eliminado la expresión");
			    	DatosNiv5 = result.Json;		
		    	} else{
		    		alert("Error al realizar la solicitud");
		    	}		    	
		    }
		});
	}
});
//funcion ciclos con las propiedades para el nivel 6
function Ciclos(){
	this.Slot = [];
	this.SlotAccion =[];
}
//Controlador nivel 6
miapp.controller('ControllerNiv6',function(){
	//declaracion variables globales nivel 6
	this.dataSitua = DatosNiv6;
	this.txttexto = "";
	this.Cifor = new Ciclos;
	this.Ciwhile = new Ciclos;	
	this.indexselect = null;
	//ciclo para establecer los slots de cada estructura ciclica
	for (var i = 0; i < 5; i++) {
		this.Cifor.Slot.push({
			"texto": "",
			"ok": (i == 0 ? true : false)
		});
		this.Cifor.SlotAccion.push({
			"texto": "",
			"ok": (i == 0 ? true : false)
		});		
		this.Ciwhile.Slot.push({
			"texto": "",
			"ok": (i == 0 ? true : false)
		});
		this.Ciwhile.SlotAccion.push({
			"texto": "",
			"ok": (i == 0 ? true : false)
		});		
	};
	//evento para cancelar y limpiar los controles del nivel 6
	this.cancelar = function(){
		this.txttexto = "";
		this.Cifor = new Ciclos;
		this.Ciwhile = new Ciclos;	
		this.indexselect = null;
		for (var i = 0; i < 5; i++) {
			this.Cifor.Slot.push({
				"texto": "",
				"ok": (i == 0 ? true : false)
			});
			this.Cifor.SlotAccion.push({
				"texto": "",
				"ok": (i == 0 ? true : false)
			});		
			this.Ciwhile.Slot.push({
				"texto": "",
				"ok": (i == 0 ? true : false)
			});
			this.Ciwhile.SlotAccion.push({
				"texto": "",
				"ok": (i == 0 ? true : false)
			});		
		};
	};
	//evento para agregar la situacíón del nivel 6
	this.AddSituacion = function(){
		var game = this;
		//en caso de editar se actualiza el json
		if(this.indexselect != null){
			var imageurl = this.dataSitua.dataSitua[this.indexselect].ImageUrl;
			this.dataSitua.dataSitua.splice(this.indexselect,1);
			this.dataSitua.dataSitua.splice(this.indexselect,0,
				{
					"texto":this.txttexto,
					"ImageUrl": (filename == null ? imageurl : "assets/images/Nivel6/" + filename),
					"Cifor": this.Cifor,
					"Ciwhile": this.Ciwhile
				}
			);
		}
		else{		
			this.dataSitua.dataSitua.push({
				"texto":this.txttexto,
				"ImageUrl": (filename == null ? "" : "assets/images/Nivel6/" + filename),
				"Cifor": this.Cifor,
				"Ciwhile": this.Ciwhile
			});		
		}				
		//se envia el json  por ajax para guardar en la carpeta del servidor
		$.ajax({
			    data: {"JsonString" :  angular.toJson(game.dataSitua) , "direccion" : direccion_nivel6,"eliminar" : null},
			    type: "POST",
			    dataType: "json",
			    url: "SaveDocumento.php",
			    complete: function(resultado){
			    	var result = JSON.parse(resultado.responseText);
			    	if(result.Mensaje == "OK"){
				    	alert("Se ha creado la situación");
				    	DatosNiv6 = result.Json;				    			
			    	}
			    	else{
		    			alert("Error al realizar la solicitud");
		    		}    	
			    }
			});
		//se guarda la imagen en el servidor
		$.ajax({

				url:"SaveImagen.php",

				type:'POST',

				contentType:false,

				data:data,

				processData:false,

				cache:false});
		this.cancelar();
	};
	//evento para seleccionar y cargar la información de la situación
	this.SelectSitua = function(indice){
		this.indexselect = indice;
		this.txttexto = this.dataSitua.dataSitua[indice].texto;	
		this.Cifor = this.dataSitua.dataSitua[indice].Cifor;
		this.Ciwhile = this.dataSitua.dataSitua[indice].Ciwhile;		
	}
	//Evento para eliminar la situación
	this.RemoveSit = function(indice){
		var urlElim = this.dataSitua.dataSitua[indice];
		this.dataSitua.dataSitua.splice(indice,1);
		var game = this;
		//se envia por ajax el json para guardarlo en la carpeta del servidor
		$.ajax({
		    data: {"JsonString" :  angular.toJson(game.dataSitua) , "direccion" : direccion_nivel6, "eliminar" : "../"+urlElim.ImageUrl },
		    type: "POST",
		    dataType: "json",
		    url: "SaveDocumento.php",
		    complete: function(resultado){
		    	var result = JSON.parse(resultado.responseText);
		    	if(result.Mensaje == "OK"){
			    	alert("Se ha eliminado la situación");
			    	DatosNiv6 = result.Json;		
		    	} else{
		    		alert("Error al realizar la solicitud");
		    	}		    	
		    }
		});
	};	

});