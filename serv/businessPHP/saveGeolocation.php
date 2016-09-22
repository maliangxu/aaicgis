<?php
echo header("Access-Control-Allow-Origin:*");
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$usrid=$_REQUEST['usrid']; 
$posArr=$_REQUEST['datainfo'];

$geodir="geolocation/".$usrid;
if(!file_exists($geodir)){
	mkdir($geodir,0777,true); 
}
$geopath=$geodir."/location.log";
$file=fopen($geopath,"a");
for($i=0,$len=count($posArr);$i<$len;$i++){
	fwrite($file, json_encode($posArr[$i])."\r\n");
}
fclose($file);


?>