<?php 
try{
	$stringText = $_POST['JsonString'];
	$direccion =  $_POST['direccion'];
	$eliminar =  $_POST['eliminar'];
	$file = fopen($direccion, "w");
	fwrite($file, $stringText);
	fclose($file);
	//Guardado de la imagen

	if($eliminar != null && file_exists ($eliminar)){
		unlink($eliminar);
	}
	$resultado = file_get_contents($direccion);
	$mensaje ="OK";
	echo '{ "Json" : '. $resultado .', "Mensaje": "'.$mensaje.'"}';
	
}catch (Exception $e) {
    echo '"Mensaje":"Error"';
}

?>