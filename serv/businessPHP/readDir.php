<?php
echo header("Access-Control-Allow-Origin:*");
$dir=$_POST['dir'];
$arr=array();
foreach(new DirectoryIterator($dir) as $file){
	//$content=substr($file->getPathname(),6);
	$content=$file->getPathname();
	$arr[]=$content;		
}
$result=json_encode($arr);
echo($result);
?>