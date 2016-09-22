<?php
echo header("Access-Control-Allow-Origin:*");
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
      case "userLogin":
      global $dbh;
        $Name=$_GET["Name"];
        $Pass=$_GET["Pass"];
        $dBaseName="shapgis_aaic";
        $results=userLogin($dBaseName,$Name,$Pass);
        echo json_encode($results);
        $dbh=null;
      break;
      case "getAllUnits":
      global $dbh;
        $sortUsrID=$_GET["sortUsrID"];
        $dBaseName="shapgis_aaic";
        $results=getAllUnits($dBaseName,$sortUsrID);
        echo json_encode($results);
        $dbh=null;
      break;
      case "regNewUser":
      global $dbh;
        $usrName=$_POST["Name"];
        $usrRealName=$_POST["rName"];
        $newPass=$_POST["Pass"];
        $usrUnit=$_POST["UnitID"];
        $usrTel=$_POST["Tel"];
        $usrEmail=$_POST["Mail"];
        $dBaseName="shapgis_aaic";
        $results=saveUsr($dBaseName,$usrName,$newPass,$usrRealName,$usrUnit,$usrTel,$usrEmail);
        echo json_encode($results);
        $dbh=null;
      break;
      case "GetTaskByUsr"://针对移动端要用。PC端中在menupage已写
      global $dbh;
        $UsrID=$_GET["UsrID"];
        $dBaseName="shapgis_aaic";
        $results=GetTaskByUsr($dBaseName,$UsrID);
        echo json_encode($results);
        $dbh=null;
      break;
      //任务管理部分
      case "getAllCountys":
      global $dbh;
        $dBaseName="shapgis_aaic";
        $results=getAllCountys($dBaseName);
        echo json_encode($results);
        $dbh=null;
      break;
      //获取所有区县
      case 'getAllCounty':
      global $dbh;
        $dbName="shapgis_aaic.db";
        createConn($dbName);
        $county = new Table_CRUD();
        $sql="select Name,ID from countyinfo where class=1";
        $res = $county->getRecords($dbh,$sql);
        echo (json_encode($res));
        $dbh=null;
      break; 
      case 'getTownByCountyID_Class':
      global $dbh;
        $dbName="shapgis_aaic.db";
        createConn($dbName);
        $cunid=$_GET['countyID'];
        $town_sta = new Table_CRUD();
        $sql = "select Name,ID,CountyID from towninfo where CountyID="."'$cunid'"." AND class=1" ;
        $res = $town_sta->getRecords($dbh,$sql);
        echo(json_encode($res));
        $dbh=null;
      break;  
      //获取所有区县 修改后
      case 'getAllCounties_location':
      		global $dbh;
  		$dbName="shapgis_aaic.db";
  		createConn($dbName);
        	$county = new Table_CRUD();
        	$sql="select county,id from county_town where class=1";
        	$res = $county->getRecords($dbh,$sql);
        	echo (json_encode($res));
      break;
      case 'getTownByCountyname_Class':
      		global $dbh;
  		$dbName="shapgis_aaic.db";
  		createConn($dbName);
		$county=$_POST['countyname'];
		$town_sta = new Table_CRUD();
		$sql = "select town from county_town where county="."'$county'"." AND class=2" ;
		$res = $town_sta->getRecords($dbh,$sql);
		echo(json_encode($res));
      break;
}
?>