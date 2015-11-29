<?php 
try{
	$Usuario = $_POST['Usuario'];
	$Contrasena =  $_POST['Contrasena'];
	if($Usuario == "Programacion" && $Contrasena == "Prog123"){
		echo '{ "Status" : "Login_Success" }';
	}	
	else{
		echo '{ "Status" : "Login_Failed" }';
	}
	
	
}catch (Exception $e) {
    echo '"Status":"Login_Error"';
}

?>