var data ;					
var filename ;
$("#txtfile").change(function(){
	var inputFileImage = document.getElementById("txtfile");

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
			    data: {"JsonString" :  angular.toJson(game.Situaciones) , "direccion" : "../assets/data/nivel1.json","eliminar" : null},
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
			    data: {"JsonString" :  angular.toJson(game.Situaciones) , "direccion" : "../assets/data/nivel1.json","eliminar" : null},
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
		    data: {"JsonString" :  angular.toJson(game.Situaciones) , "direccion" : "../assets/data/nivel1.json", "eliminar" : "../"+urlElim.situaImg },
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
		    data: {"JsonString" :  angular.toJson(game.TiposDatos) , "direccion" : "../assets/data/nivel2.json","eliminar" : null},
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
		    data: {"JsonString" :  angular.toJson(game.TiposDatos) , "direccion" : "../assets/data/nivel2.json","eliminar" : null},
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
			if(regular.exec(this.txtExpresion[i]) != null){
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

	this.AddExpresionEva = function(){
		this.exp.splice(0,0,this.txtExpresion);
		this.expresiones.dataGusano.push({
			"exp": this.exp,
			"nPasos" : this.nPasos,
			"pasos": this.pasosOpciones
		});
		var game = this;
		$.ajax({
			    data: {"JsonString" :  angular.toJson(game.expresiones) , "direccion" : "../assets/data/nivel3.json","eliminar" : null},
			    type: "POST",
			    dataType: "json",
			    url: "SaveDocumento.php",
			    complete: function(resultado){
			    	var result = JSON.parse(resultado.responseText);
			    	if(result.Mensaje == "OK"){
				    	alert("Se ha creado la situación");
				    	DatosNiv3 = result.Json;		
				    	game.txtExpresion = "";	
						game.nPasos = 0;		
						game.exp = [];
						game.pasos = [];	
						game.pasosOpciones = [];
			    	}
			    	else{
		    			alert("Error al realizar la solicitud");
		    		}    	
			    }
			});
	};

	this.selectExpre = function(indice){
		this.pasos = [];
		this.txtExpresion = this.expresiones.dataGusano[indice].exp[0];
		this.exp = this.expresiones.dataGusano[indice].exp.slice(1,this.expresiones.dataGusano[indice].exp.length+1);
		this.nPasos = this.expresiones.dataGusano[indice].nPasos;
		for (var i = 0; i < this.nPasos; i++) {
			this.pasos.push(i);
		}
		this.pasosOpciones = this.expresiones.dataGusano[indice].pasos;
	};

	

});
