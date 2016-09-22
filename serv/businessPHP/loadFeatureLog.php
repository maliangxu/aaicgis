<?php 
// ini_set('display_errors',1);
// ini_set('display_startup_errors',1);
// error_reporting(-1); 
$sType = $_GET['sType'];

#$town = "fx_st";
$town = $_GET['townEnName'];
$arr = explode("_",$town);
$county = $arr[0];
$townName = $arr[1]; 

$bPath = "data\\".$county."\\".$townName."\\";

switch ($sType) {
	case 1:
    $fPath = $bPath."Point.aux";
		$handle = fopen($fPath, "r");
		break;
    case 3:
    $fPath = $bPath."Polyline.aux";
		$handle = fopen($fPath, "r");
		break;
	case 5:
    $fPath = $bPath."Polygon.aux";
		$handle = fopen($fPath, "r");
		break;
}

$arr = array();
if ($handle) {
    while (!feof($handle)) {
        $str = fgets($handle);
        if(gettype($str) == 'string' && strlen(trim($str))>0){
          $str = str_replace("\r\n","",$str);
          $earr = explode(",",$str);
          $tmp = array();
          $tmp['ID'] = $earr[0];
          $tmp['eCode'] = $earr[1];
          $tmp['ranknum'] = $earr[2];
          $tmp['ifmod'] = $earr[3];
          $tmp['info'] = $earr[4];
          $obj=(object)$tmp;
          if(gettype($obj) == 'object'){
          	 array_push($arr,$obj);
          }
        }
    }
    $jsonStr = json_encode($arr);
    echo $jsonStr;
    fclose($handle);
}

?>