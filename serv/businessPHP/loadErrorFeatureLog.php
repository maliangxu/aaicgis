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
		break;
    case 3:
    $fPath = $bPath."Polyline.aux";
		break;
	case 5:
    $fPath = $bPath."Polygon.aux";
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
/*          if($obj->Marker==0)
            continue;*/
          if(gettype($obj) == 'object'){
             array_push($arr,$obj);
          }
        }
    }
    fclose($handle);
}

$jsonStr = json_encode($arr);
echo $jsonStr;

?>