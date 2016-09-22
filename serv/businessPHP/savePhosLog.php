<?php
echo header("Access-Control-Allow-Origin:*");
if ( isset($_POST["info"]) && !empty($_POST["info"]) ) {    
	$infoStr=$_POST["info"];
	
	$fPath="photo\\photo.log";
	$fPhoto = fopen($fPath, "a");
	$infoStr = $infoStr."\r\n";
	fwrite($fPhoto,$infoStr);
	fclose($fPhoto);
	echo "日志文件存储成功";
}
?>