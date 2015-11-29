<?php
// Lee el fichero en una variable,
// y convierte su contenido a una estructura de datos
$str_datos = file_get_contents("../juego/assets/data/nivel1.json");
$str_datos_2 = file_get_contents("../juego/assets/data/nivel2.json");
$str_datos_3 = file_get_contents("../juego/assets/data/nivel3.json");
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
		var DatosNiv3 = <?php echo $str_datos_3; ?>;			
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
					<li ng-repeat="Situacion in niv1.Situaciones.dataSitua" ng-click ="niv1.SelectSitua($index)"><div>{{$index+1}} - {{ Situacion.situaTxt }}</div>  <div class="cerrar" ng-click="niv1.RemoveSit($index)">x</div> </li>					
				</ul>				
			</div>
			
				<div id="formSituacion">				
					<div>
						<label>Descripcion de la situacion: </label> <br> <input type="text" name="Text1" ng-model="niv1.txtDescripcion" id="txtDescripcionSit" />
					</div>
					<div>
						<label>Imagen: </label>  <input type="file" id="txtfile" name="pic" accept="image/*">
					</div>
					<div>
						<label>Numero de Pasos: </label>	<br>
						<input type="text" name="txtNPasos" ng-model="niv1.txtNPasos" id="txtNPasos" >
					</div>
					<div>
						<label>Acciones: </label>
						<div id="Pasos">
							<ol style="margin:0px;">
								<li ng-repeat="Accion in niv1.acciones"><input type="text" maxlength ="40" name="txtPaso1" id="txtPaso1" ng-model="Accion.txt"><div ng-show="$index < niv1.txtNPasos"><img src="Images/Ok.png" width="16"></div></li>							
							</ol>
						</div>
					</div>
					<input style="margin-right: 10px;" ng-show="niv1.guardar" type="button" id="btnGuardarSituacion" ng-click="niv1.AddSituacion()" value="Guardar"/>
					<input style="margin-right: 10px;" ng-hide="niv1.guardar" type="button" id="btnActualizarSituacion" ng-click="niv1.EditSituacion()" value="Actualizar"/> 
					<input type="button" class="btnCancelar" value="Cancelar" ng-click="niv1.cancelar()"/> 
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
							 <li  ng-repeat="expresion in niv2.Reales.exp track by $index"> <div style="display: inline-block;  vertical-align: top;  width: 46%"> {{ expresion }}</div> <div class="cerrar" ng-click="niv2.RemoveExpresion($index,'Reales')">x</div></li>
						</ul>
				</div>

				<input type="text" id="txtExpresionReales" ng-model="niv2.txtexpreales"  />
				<input type="button" id="btnGuardarExpresionReales" value="+" ng-click="niv2.AddExpresion('Reales')" /> 
			</div>
			<div class="TipoDatos">
				<div class="title">
					Logicos
				</div>
				<div class="contentExpresiones">
						<ul >
							 <li  ng-repeat="expresion in niv2.Logicos.exp track by $index"> <div style="display: inline-block;  vertical-align: top;  width: 46%"> {{ expresion }}</div> <div class="cerrar" ng-click="niv2.RemoveExpresion($index,'Logicos')">x</div></li>
						</ul>
				</div>
				<input type="text" id="txtExpresionBoleanos"  ng-model="niv2.txtexplogicos" />
				<input type="button" id="btnGuardarExpresionBoleanos" value="+" ng-click="niv2.AddExpresion('Logicos')"/> 
			</div>
			<div class="TipoDatos">
				<div class="title">
					Enteros
				</div>
				<div class="contentExpresiones">
						<ul >
							 <li  ng-repeat="expresion in niv2.Enteros.exp track by $index"> <div style="display: inline-block;  vertical-align: top;  width: 46%"> {{ expresion }}</div> <div class="cerrar" ng-click="niv2.RemoveExpresion($index,'Enteros')" >x</div></li>
						</ul>
				</div>
				<input type="text" id="txtExpresionEnteros"  ng-model="niv2.txtexpenteros" />
				<input type="button" id="btnGuardarExpresionEnteros" value="+" ng-click="niv2.AddExpresion('Enteros')"/> 
			</div>
			<div class="TipoDatos">
				<div class="title">
					Errores
				</div>
				<div class="contentExpresiones">
						<ul >
							 <li  ng-repeat="expresion in niv2.Error.exp track by $index"> <div style="display: inline-block;  vertical-align: top;  width: 46%"> {{ expresion }}</div> <div class="cerrar" ng-click="niv2.RemoveExpresion($index,'Error')">x</div></li>
						</ul>
				</div>
				<input type="text" id="txtExpresionErrores" ng-model="niv2.txtexperror"  />
				<input type="button" id="btnGuardarErrores" value="+" ng-click="niv2.AddExpresion('Error')" /> 
			</div>
		</section>	
		<section id="nivel1" ng-controller="ControllerNiv3 as niv3">
			<div class="subTitulo">Nivel 3</div>
			<div class="titulo">Evaluación de expresiones</div>	
			<div id="situaciones" >
				<ul>
					<li ng-repeat="Expresion in niv3.expresiones.dataGusano" ng-click="niv3.selectExpre($index)"><div>{{Expresion.exp[0]}}</div>  <div class="cerrar" >x</div> </li>					
				</ul>				
			</div>
			<div id="formSituacion">	
				<div>
					<label>Pasos Expresión: </label>
					<div id="Pasos">
						<ol style="margin:0px;">
							<li><input type="text" maxlength ="40" name="txtExpresion" ng-change="niv3.Calcularpasos()" ng-model="niv3.txtExpresion" id="txtExpresion" ></li>							
							<li ng-repeat="PasosExp in niv3.exp track by $index "><input type="text" maxlength ="40" name="txtExpresion" id="txtExpresion" ng-model="niv3.exp[$index]" ></li>							
						</ol>
					</div>
				</div>
				<div id="Pasos">
					<ol style="margin:0px;">
						<li ng-repeat = "Paso in niv3.pasos" style="margin-bottom:10px;">
							<label><b>Paso</b></label>
							</br>
							<div ng-repeat="Opciones in niv3.pasosOpciones | filter:{n: Paso}">
								<input type="text" maxlength ="40" name="txtExpresion" ng-model="Opciones.txt"><img ng-show="Opciones.ok" src="Images/Ok.png" width="16">
							</div>

						</li>
					</ol>
									
				</div>
				<input style="margin-right: 10px;" ng-show="niv3.guardar" type="button" id="btnGuardarSituacion" ng-click="niv3.AddExpresionEva()" value="Guardar"/>
			</div>
		</section>			
</body>

</html>