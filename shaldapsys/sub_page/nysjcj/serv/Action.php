<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
ini_set ('memory_limit', '256M');  
error_reporting(-1);
require_once("Data.php");
require_once("Conn.php");
require_once("Model.php");
date_default_timezone_set('Europe/London');
if (isset($_GET["method"])) {
	$method = $_GET["method"];
} else {
	$method = $_POST["method"];
}
switch ($method) {   
      case "GetTaskByUsr":
      global $dbh;
        $UsrID=$_GET["UsrID"];
        $dBaseName="shapgis_aaic";
        $results=GetTaskByUsr($dBaseName,$UsrID);
        echo json_encode($results);
        $dbh=null;
      break; 
}
?>