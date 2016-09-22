<?php 
$sType = $_GET['sType'];

#$town = "fx_st";
$town = $_GET['townEnName'];
$arr = explode("_",$town);
$county = $arr[0];
$townName = $arr[1]; 

$bPath = "data\\".$county."\\".$townName."\\";

switch ($sType) {
	case 1:
    $fPath = $bPath."Point.g";
		break;
    case 3:
    $fPath = $bPath."Polyline.g";
		break;
	case 5:
    $fPath = $bPath."Polygon.g";
		break;
}

if(file_exists($fPath)){
   $handle = fopen($fPath, "r");
}else{
   $handle = false;
}

$arr = array();
if ($handle) {
    while (!feof($handle)) {
        $str = fgets($handle);
        if(gettype($str) == 'string'){
          $str = str_replace("\r\n","",$str);
          $obj = json_decode($str);
          if(gettype($obj) == 'object'){
          	 array_push($arr,$obj);
          }
          //echo json_last_error();
        }
    }
    fclose($handle);
}

$jsonStr = json_encode($arr);
echo $jsonStr;

?>