<?php
echo header("Access-Control-Allow-Origin:*");
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$usrid=$_REQUEST['usrid']; 
$path="geolocation/".$usrid."/location.log";

$arr=array();
$handler=fopen($path, "r");
if($handler){
	while(!feof($handler)){
		$str=fgets($handler);
		$obj = json_decode($str);
         if(gettype($obj) == 'object'){
             array_push($arr,$obj);
           }
		}
	fclose($handler);
	echo json_encode($arr);
}else{
	echo "error";
}


?>