<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);


$fShp = $_GET['sType'];//可能需要修改为POST,因为涉及到传参大小的问题
$town = $_GET['townEnName'];
$fData = $_GET['data'];//Id值 
echo $fData;

$fArray = $fData;

$arr = explode("_",$town);
$county = $arr[0];
$townName = $arr[1]; 

$bPath = "data\\".$county."\\".$townName."\\";

switch ($fShp) {
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
foreach ($fArray as &$v) {
  $newfp = "";
  $ranknum="";
  $i = 1;
  $fp = fopen($fPath, "r");
  if ($fp) {
      while (!feof($fp)) {
          $str = fgets($fp);
          if(gettype($str) == 'string' && strlen(trim($str)) > 0){
            $str = str_replace("\r\n","",$str);
            $earr = explode(",",$str);
               if($earr[0] == $v['ID']){
                $ranknum=$earr[2];
                break;
               }                             
          }
          $i++;
      }
   }
   $fArr=file($fPath); 
   for($j=0;$j<count($fArr);$j++){
    if(strcmp($j+1,$i)==0){
       $eStr = $v['ID'].","."-1".",".$ranknum."yes"." ";
       $newfp.= $eStr."\r\n";;
    }else{
       $newfp.=$fArr[$j]; 
    }
   }
   $fp=@fopen($fPath,"w");//以写的方式打开文件
   @fputs($fp,$newfp);
   @fclose($fp);
   echo "OK";
}

	
?>