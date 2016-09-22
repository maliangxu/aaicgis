<?php
echo header("Access-Control-Allow-Origin:*");
$file=$_POST[file];
$content = file_get_contents($file);
$size=filesize($file);
$result=chunk_split(base64_encode($content));
$filenew=$file;
$result=$filenew. '|' . $size . '|data:image/jpeg;base64,' . $result;
echo $result;
 
/*$type=getimagesize($file);//取得图片的大小，类型等  
$fp=fopen($file,"r")or die("Can't open file");  
$file_content=chunk_split(base64_encode(fread($fp,filesize($file))));//base64编码  
echo filesize($file);*/
?>