<?php
echo header("Access-Control-Allow-Origin:*");
if ( isset($_POST["text"]) && !empty($_POST["text"]) ) {    
	$infoStr=$_POST["text"];
	
	$fPath="photo\\textInfo.log";
	$fPhoto = fopen($fPath, "a");
	fwrite($fPhoto,$infoStr);
	fclose($fPhoto);
	echo "日志文件存储成功";
}
?>