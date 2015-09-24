<?php //Ejemplo aprenderaprogramar.com

$stringText = $_POST['JsonString'];
$direccion =  $_POST['direccion'];
$eliminar =  $_POST['eliminar'];
$file = fopen($direccion, "w");
fwrite($file, $stringText);
fclose($file);
//Guardado de la imagen

if($eliminar != null){
	unlink($eliminar);
}
?>