<?php

$return = Array('ok'=>TRUE);

$upload_folder ='../assets/images/Nivel1/';

$nombre_archivo = $_FILES['archivo']['name'];

$tipo_archivo = $_FILES['archivo']['type'];

$tamano_archivo = $_FILES['archivo']['size'];

$tmp_archivo = $_FILES['archivo']['tmp_name'];

$archivador = $upload_folder . '/' . $nombre_archivo;

if (!move_uploaded_file($tmp_archivo, $archivador)) {
	return true;

}


?>