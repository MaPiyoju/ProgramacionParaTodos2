<?php
// Lee el fichero en una variable,
// y convierte su contenido a una estructura de datos
$str_datos = file_get_contents("../assets/data/nivel1.json");
$str_datos_2 = file_get_contents("../assets/data/nivel2.json");
?>

<!DOCTYPE html>
<html lang="en" ng-app="miapp">
<head>
	<meta charset="UTF-8">
	<title>Inicio</title>
	<link rel="stylesheet" type="text/css" href="Css/admin.css">
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>
	
	<script type="text/javascript" src="Scripts/angular.min.js"></script>	
	<script type="text/javascript" src="Scripts/Nivel1.js"></script>	
	<script type="text/javascript">
		var DatosJson = <?php echo $str_datos; ?>;	
		var DatosNiv2 = <?php echo $str_datos_2; ?>;	
	</script>
</head>
<body>	
		<section >
			<div class="background">
				<div class="inicio">
						<div class="subTitulo">Aprendé a programar con juegos</div>
						<div class="titulo">PROGRAMACIÓN PARA TODOS</div>
						<input type="text" name="Usuario" id="txtUsuario" placeholder="Usuario"><br>
						<input type="password" name="Contraseña" id="txtUsuario" placeholder="Contraseña">
						<div class="botonjugar">Iniciar</div>
				</div>
			</div>
		</section>
		<section>
			<div class="nosotros">
				<div class="header">					
					<div id="niveles">
						<ul>
							<li>
								
							</li><li>
								
							</li><li>
								
							</li><li>
								
							</li>
						</ul>
					</div>
				</div>
				<div class="footer">
					<img src="Images/Cita_inicio.png">
					<p>Everybody in this country should learn how to program a computer… becouse it teaches you how to think.<br><span>Steve Jobs </span>
						</p>
					<img src="Images/Cita_Fin.png">
				</div>
			</div>
		</section>		
		<section id="nivel1" ng-controller="ControllerNiv1 as niv1">
			<div class="subTitulo">Nivel 1</div>
			<div class="titulo">Algoritmos</div>			
			<div id="situaciones" >
				<ul>
					<li ng-repeat="Situacion in niv1.Situaciones.dataSitua" ><div>{{$index+1}} - {{ Situacion.situaTxt }}</div>  <div class="cerrar" ng-click="niv1.RemoveSit($index)">x</div> </li>					
				</ul>				
			</div>
			
				<div id="formSituacion">				
					<div>
						<label>Descripcion de la situacion: </label> <br> <input type="text" name="Text1" ng-model="niv1.txtDescripcion" id="txtDescripcionSit"   ></textarea>
					</div>
					<div>
						<label>Imagen de la Situacion:  </label>   <input type="file" id="txtfile" name="pic" accept="image/*">
					</div>
					<div>
						<label>Acciones Correctas: </label>	
						<div id="accionesCor">
							<div ng-repeat="accion in niv1.acciones | filter:{ok:true}">
							   {{$index+1}}. {{ accion.txt }} <div class="cerrar" ng-click="niv1.RemoveAccio(accion.txt)">x</div>
							</div>						
						</div>
						<input type="text" id="txtaccioncorrect" ng-model="niv1.textAccionTrue"/>
						<input type="button" id="btnGuardarAccion" value="+" ng-click="niv1.AddAccionTrue()" /> 
					</div>
					<div>
						<label>Acciones Incorrectas: </label>
						<div id="accionesIncor">
							<div ng-repeat="accion in niv1.acciones | filter:{ok:false}">
							   {{$index+1}}. {{ accion.txt }} <div class="cerrar" ng-click="niv1.RemoveAccio(accion.txt)">x</div>
							</div>						
						</div>
						<input type="text" id="txtaccionIncorrect"  ng-model="niv1.textAccionFalse" />
						<input type="button" id="btnGuardarAccionIn" value="+" ng-click="niv1.AddAccionFalse()"/> 
					</div>
					<input style="margin-right: 10px;" type="button" id="btnGuardarSituacion" ng-click="niv1.AddSituacion()" value="Guardar"/> 
				</div>
		</section>		
		<section id="nivel1" ng-controller="ControllerNiv2 as niv2">
			<div class="subTitulo">Nivel 2</div>
			<div class="titulo">Datos</div>			
			<div class="TipoDatos">
				<div class="title">
					Reales
				</div>
				<div class="contentExpresiones">
						<ul >
							 <li  ng-repeat="expresion in niv2.Reales.exp"> <div style="display: inline-block;  vertical-align: top;  width: 46%"> {{ expresion }}</div> <div class="cerrar" >x</div></li>
						</ul>
				</div>

				<input type="text" id="txtExpresionReales"   />
				<input type="button" id="btnGuardarExpresionReales" value="+" ng-click="niv2.AddReales()" /> 
			</div>
			<div class="TipoDatos">
				<div class="title">
					Booleanos
				</div>
				<div class="contentExpresiones">
						<ul >
							 <li  ng-repeat="expresion in niv2.Booleans.exp"> <div style="display: inline-block;  vertical-align: top;  width: 46%"> {{ expresion }}</div> <div class="cerrar" >x</div></li>
						</ul>
				</div>
				<input type="text" id="txtExpresionBoleanos"   />
				<input type="button" id="btnGuardarExpresionBoleanos" value="+" /> 
			</div>
			<div class="TipoDatos">
				<div class="title">
					Enteros
				</div>
				<div class="contentExpresiones">
						<ul >
							 <li  ng-repeat="expresion in niv2.Enteros.exp"> <div style="display: inline-block;  vertical-align: top;  width: 46%"> {{ expresion }}</div> <div class="cerrar" >x</div></li>
						</ul>
				</div>
				<input type="text" id="txtExpresionEnteros"   />
				<input type="button" id="btnGuardarExpresionEnteros" value="+" /> 
			</div>
		</section>		
</body>

</html>