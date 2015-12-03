var data ;					
var filename ;

var direccion_nivel1 = "../juego/assets/data/nivel1.json";
var direccion_nivel2 = "../juego/assets/data/nivel2.json";
var direccion_nivel3 = "../juego/assets/data/nivel3.json";
var direccion_nivel4 = "../juego/assets/data/nivel4.json";
var direccion_nivel5 = "../juego/assets/data/nivel5.json";
var direccion_nivel6 = "../juego/assets/data/nivel6.json";

$("#txtfile").change(function(){
	var inputFileImage = document.getElementById("txtfile");

	var file = inputFileImage.files[0];
	filename = file.name;
	data = new FormData();

	data.append('archivo',file);
});	

$("#txtfile6").change(function(){
	var inputFileImage = document.getElementById("txtfile6");

	var file = inputFileImage.files[0];
	filename = file.name;
	data = new FormData();

	data.append('archivo',file);
});		

function indexElement(result,name){
	var indice = 0;
	$.each(result,function(index, value){				    
	   if(value.txt == name){
	   		indice = index;
	   }
	});
	return indice;
}		

function checkExpresion(expression){
	var top = 0;
	for (var i = 0; i < expression.length; i++) {
		if(expression[i] == "("){
			top++;
		}else if(expression[i] == ")"){
			top--;
		}
	};
	return top == 0;
}




var miapp = angular.module('miapp',[]);   
miapp.controller('ControllerNiv1', function () {				
	this.Situaciones = angular.copy(DatosJson);
	this.acciones = [];
	this.txtDescripcion = "";
	for (var i = 0; i < 12; i++) {
		this.acciones.push({
				"txt": ""						
		});
	}
	this.guardar = true;
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

		this.Situaciones.dataSitua.push({
			"situaImg": "assets/images/Nivel1/" + filename,
			"situaTxt": this.txtDescripcion,
			"nPasos": this.txtNPasos,
			"accion": this.acciones
		});						
		
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

		$.ajax({

				url:"SaveImagen.php",

				type:'POST',

				contentType:false,

				data:data,

				processData:false,

				cache:false});


										
		
	};

	this.EditSituacion = function(){
		var game = this;
		this.Situaciones.dataSitua[this.IndiceEdit].situaTxt = this.txtDescripcion;		
		//Si carga una imagen  se guarda en el servidor
		if(filename != null){
			this.Situaciones.dataSitua[this.IndiceEdit].situaImg = "assets/images/Nivel1/" + filename
			$.ajax({

					url:"SaveImagen.php",

					type:'POST',

					contentType:false,

					data:data,

					processData:false,

					cache:false});
		}

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

	this.RemoveSit = function(indice){

		var urlElim = this.Situaciones.dataSitua[indice];
		this.Situaciones.dataSitua.splice(indice,1);
		var game = this;
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

miapp.controller('ControllerNiv2',function(){
	this.TiposDatos = DatosNiv2;
	this.Reales = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "reales";	}))[0];
	this.Logicos = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "boolean";	}))[0];
	this.Enteros = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "enteros";	}))[0];
	this.Error = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "error";	}))[0];
	
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

	this.RemoveExpresion = function(indice,tipo){
		game=this;
		if(tipo == "Reales"){
			this.Reales.exp.splice(indice,1);
		}else if(tipo == "Logicos"){
			this.Logicos.exp.splice(indice,1);
		}else if(tipo == "Enteros"){
			this.Enteros.exp.splice(indice,1);
		}else if(tipo == "Error"){
			this.Error.exp.splice(indice,1);
		}

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

miapp.controller('ControllerNiv3',function(){
	this.indiceSelect = null;
	this.expresiones = DatosNiv3;
	this.txtExpresion = "";	
	this.nPasos = 0;		
	this.exp = [];
	this.pasos = [];	
	this.pasosOpciones = [];
	this.guardar = true;	
	this.Calcularpasos = function(){
		var pasos = 0;
		var regular = /(\*|\/|\+|\-|div|mod)/;
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

	this.cancelar = function(){
		this.txtExpresion = "";	
		this.nPasos = 0;		
		this.exp = [];
		this.pasos = [];	
		this.pasosOpciones = [];
		this.indiceSelect = null;
	}

	this.AddExpresionEva = function(){
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

	this.RemoveExpresionEva = function(indice){
		this.expresiones.dataGusano.splice(indice,1);
		var game = this;
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


miapp.controller('ControllerNiv4',function(){
	this.indiceSelect = null;
	this.expresiones = DatosNiv4;
	this.txtExpresion = "";	
	this.nPasos = 0;
	this.exp = [];
	this.pasos = [];	
	this.pasosOpciones = [];
	this.guardar = true;	
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

	this.cancelar = function(){
		this.txtExpresion = "";	
		this.nPasos = 0;
		this.exp=[];
		this.pasos = [];	
		this.pasosOpciones = [];
		this.indiceSelect = null;
	}

	this.AddExpresionEva = function(){
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

	this.RemoveExpresionEva = function(indice){
		this.expresiones.dataGusano.splice(indice,1);
		var game = this;
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

miapp.controller('ControllerNiv5',function(){	
	this.dataSitua = DatosNiv5;	
	this.nPasos = 0;
	this.pasos  = [];
	this.indiceSelect = null;	
	this.cancelar = function(){
		this.nPasos = 0;
		this.pasos  = [];	
		this.indiceSelect = null;
	}

	this.selectExpre = function(indice){
		this.indiceSelect = indice;			
		this.nPasos = this.dataSitua.dataSitua[indice].nPasos;		
		this.pasos = this.dataSitua.dataSitua[indice].pasos;
	};

	this.AddSituacion = function(){		
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
		
		for (var i = 0; i < this.dataSitua.dataSitua.length; i++) {
			for (var j = 0; j < this.dataSitua.dataSitua[i].pasos.length; j++) {
				if(j != (this.dataSitua.dataSitua[i].pasos.length-1)){
					delete this.dataSitua.dataSitua[i].pasos[j].fin ; 
				}
			};
		};
		
		var game = this;
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

	this.RemoveExpresionEva = function(indice){
		this.dataSitua.dataSitua.splice(indice,1);
		var game = this;
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

function Ciclos(){
	this.Slot = [];
	this.SlotAccion =[];
}

miapp.controller('ControllerNiv6',function(){
	this.dataSitua = DatosNiv6;
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

	this.AddSituacion = function(){
		var game = this;
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

		$.ajax({

				url:"SaveImagen.php",

				type:'POST',

				contentType:false,

				data:data,

				processData:false,

				cache:false});
		this.cancelar();
	};
	
	this.SelectSitua = function(indice){
		this.indexselect = indice;
		this.txttexto = this.dataSitua.dataSitua[indice].texto;	
		this.Cifor = this.dataSitua.dataSitua[indice].Cifor;
		this.Ciwhile = this.dataSitua.dataSitua[indice].Ciwhile;		
	}

	this.RemoveSit = function(indice){
		var urlElim = this.dataSitua.dataSitua[indice];
		this.dataSitua.dataSitua.splice(indice,1);
		var game = this;
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