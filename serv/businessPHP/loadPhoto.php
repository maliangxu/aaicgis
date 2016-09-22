<?php
$path="photo\\photo.log";
if(file_exists($path)){
   $handle = fopen($path, "r");
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