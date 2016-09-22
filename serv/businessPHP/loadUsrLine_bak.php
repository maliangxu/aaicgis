<?php 
// ini_set('display_errors',1);
// ini_set('display_startup_errors',1);
// error_reporting(-1); 
$sType = $_GET['sType'];//判断载入标注还是线路
$usrid = $_GET['usrId'];
$tmpbPath = "userLine/".$usrid;
if(!file_exists($tmpbPath)){//判断文件夹不存在就执行创建文件夹
  mkdir ($tmpbPath);
}
$bPath = $tmpbPath."/";
switch ($sType) {
	case 1://1代表标注
    $fPath = $bPath."mark.log";
		break;
  case 2://2代表线路
    $fPath = $bPath."line.log";
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
        }
    }
    fclose($handle);
}
$jsonStr = json_encode($arr);
echo $jsonStr;
?>