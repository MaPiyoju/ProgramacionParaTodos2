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

function filterDatosNiv2(textfilter,datos2){
	$.grep(datos2.dataTipo, function(element, index){
  		return element.tipo== textfilter;
	});
}

var miapp = angular.module('miapp',[]);   
miapp.controller('ControllerNiv1', function () {				
	this.Situaciones = DatosJson;
	this.txtDescripcion = "";
	this.acciones = [];
	this.SelectSitua = function(indice){
		this.txtDescripcion = this.Situaciones.dataSitua[indice].situaTxt;
		this.acciones =  this.Situaciones.dataSitua[indice].accion + 1;
	};

	this.AddSituacion = function(){
		if(this.acciones.length >=10){
			this.Situaciones.dataSitua.push({
				"situaImg": "assets/images/Nivel1/" + filename,
				"situaTxt": this.txtDescripcion,
				"nPasos": this.acciones.length,
				"accion": this.acciones
			});						
			
			$.ajax({
				    data: {"JsonString" :  angular.toJson(DatosJson) , "direccion" : "../assets/data/nivel1.json","eliminar" : null},
				    type: "POST",
				    dataType: "json",
				    url: "SaveDocumento.php",
				})
				 .done(function( data, textStatus, jqXHR ) {							 	

				     if ( console && console.log ) {
				         console.log( "La solicitud se ha completado correctamente." );
				     }
				 })
				 .fail(function( jqXHR, textStatus, errorThrown ) {
				     if ( console && console.log ) {
				         console.log( "La solicitud a fallado: " +  textStatus);
				     }
				});

			$.ajax({

					url:"SaveImagen.php",

					type:'POST',

					contentType:false,

					data:data,

					processData:false,

					cache:false});


										
		}else{
			alert("Ingresa por lo menos  un total de 15 acciones");	
		}
	};

	this.RemoveSit = function(indice){

		var urlElim = this.Situaciones.dataSitua[indice];
		this.Situaciones.dataSitua.splice(indice,1);

		$.ajax({
		    data: {"JsonString" :  angular.toJson(DatosJson) , "direccion" : "../assets/data/nivel1.json", "eliminar" : "../"+urlElim.situaImg },
		    type: "POST",
		    dataType: "json",
		    url: "SaveDocumento.php",
		})
		 .done(function( data, textStatus, jqXHR ) {							 	

		     if ( console && console.log ) {
		         console.log( "La solicitud se ha completado correctamente." );
		     }
		 })
		 .fail(function( jqXHR, textStatus, errorThrown ) {
		     if ( console && console.log ) {
		         console.log( "La solicitud a fallado: " +  textStatus);
		     }
		});
	};

	this.AddAccionTrue = function(){
		this.acciones.push({
			"txt": this.textAccionTrue,
			"ok": true,
			"n": this.acciones.length +1 							
		});
	};
	this.AddAccionFalse = function(){
		this.acciones.push({
			"txt": this.textAccionFalse,
			"ok": false					
		});
	};

	this.RemoveAccio = function(name){
		var index = indexElement(this.acciones,name);
		this.acciones.splice(index,1);
	};
});  

miapp.controller('ControllerNiv2',function(){
	this.TiposDatos = DatosNiv2;
	this.Reales = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "reales";	}))[0];
	this.Booleans = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "boolean";	}))[0];
	this.Enteros = ($.grep(this.TiposDatos.dataTipo, function(element, index){  		return element.tipo== "enteros";	}))[0];
	
	this.AddReales = function(){
		this.Reales.exp.push($("#txtExpresionReales").val());
	};

});
