<?php
$path="photo\\textInfo.log";
if(file_exists($path)){
   $handle = fopen($path, "r");
}else{
   $handle = false;
}

if ($handle) {
   $str = fgets($handle);
	if(gettype($str) == 'string'){
	    $str = str_replace("\r\n","",$str);
	}
    fclose($handle);
}

echo $str;
?>