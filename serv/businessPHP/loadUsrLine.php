<?php 
echo header("Access-Control-Allow-Origin:*");
// ini_set('display_errors',1);
// ini_set('display_startup_errors',1);
// error_reporting(-1); 
$sType = $_GET['sType'];//判断载入标注还是线路
$usrid = $_GET['usrId'];
$usrids=array();
function getFilesOfDir($dirpath){
   $result=array();
   $allfiles=scandir($dirpath);
   $len=count($allfiles); 
   for($i=0;$i<$len;$i++){
     $fileOrDir=$dirpath.$allfiles[$i];
     $filetype=pathinfo($fileOrDir, PATHINFO_EXTENSION);
     if(!is_file($fileOrDir)&&is_numeric($allfiles[$i])){
      $tmpnum=iconv('gb2312','utf-8',$allfiles[$i]);
      array_push($result,$tmpnum);
     }
   }
   $len1=count($result); 
   return $result;
}
if(isset($_GET['bAllData'])&&($_GET['bAllData']=="true")){
  //返回所有数据
  //遍历目录下所有文件夹名称
  $usrids=getFilesOfDir("userLine/");
}else{
  //只返回本身数据
  array_push($usrids,$usrid);
}
$arr = array();//声明返回数组
$usrids_len=count($usrids);
for($i=0;$i<$usrids_len;$i++){
    $tmpusrid=$usrids[$i];
    $tmpbPath = "userLine/".$tmpusrid;
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
    if ($handle) {
        while (!feof($handle)) {
            $str = fgets($handle);
            if(gettype($str) == 'string'){
              $str = str_replace("\r\n","",$str);
              $obj = json_decode($str);
              if(gettype($obj) == 'object'){
                 $obj->usrid=$tmpusrid;
                 array_push($arr,$obj);
              }
            }
        }
        fclose($handle);
    }
}
$jsonStr = json_encode($arr);
echo $jsonStr;
?>