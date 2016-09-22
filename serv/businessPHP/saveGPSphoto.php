

<?php

 $imgdataArr=$_REQUEST['imgdataList'];  //数组
 $filenameArr=$_REQUEST['filenameList'];
 $photoInfoArr=$_REQUEST['infoList']; 
 
$dir="photoFile";
if(!file_exists($dir)){
	mkdir($dir,0777,true); 
}
$path=$dir."/photoInfo.log";
$infofile=fopen($path,"a") or die("Unable to open file!");

 $count=0;
 for($i=0;$i<count($imgdataArr);$i++){
 	$encodedData = str_replace(' ','+',$imgdataArr[$i]); //参数find replace str
    $encodedData = preg_replace('/^data:image\/(png|jpeg);base64,/','',$encodedData); // 执行一个正则表达式的搜索和替换
    $data = base64_decode($encodedData); //对使用base64 编码的数据进行解码
    $filename=$filenameArr[$i];
    $filepath=$dir.'\\'.$filename;
    $flag=file_put_contents($filepath, $data);  //写入图片内容
    //写入图片信息
    fwrite($infofile, json_encode($photoInfoArr[$i])."\r\n");
    
    $count++;
 }
 fclose($infofile);
 if($count==count($imgdataArr)){
  echo "succeed to save photos";
}else{
	echo "fail to save photos";
}


?>