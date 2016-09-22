<?php
echo header("Access-Control-Allow-Origin:*");
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
$data = $_GET['data'];
$data=stripslashes($data);
$dataObj = json_decode($data);
//$dataObj = json_decode($dataObj);
$type=$dataObj->sType;
$methodtype=$dataObj->mType;
$usrid=$dataObj->usrId;
$tmpbPath = "userLine/".$usrid;
if(!file_exists($tmpbPath)){//判断文件夹不存在就执行创建文件夹
  mkdir ($tmpbPath);
}
$bPath = $tmpbPath."/";
//然后判断是处理标记还是线路
if($type==1){//1是标注
  $ePath = $bPath."mark.log";
  $fData=$dataObj->data;
  //$fData=$_GET['data'];
  // $fData=stripslashes($fData);
  if ($methodtype==1){//1标识添加
    $emarkLog = fopen($ePath, "a");
    $fData = json_encode($fData)."\r\n";
    fwrite($emarkLog,$fData);
    fclose($emarkLog);
  }else if($methodtype==2){//2表示删除
    $delMarker=$fData;
    $ID=$delMarker->ID;
    $content="";
    $eArr=file($ePath); 
    for($k=0;$k<count($eArr);$k++){
      $eArr[$k]=str_replace("\r\n","",$eArr[$k]);
      $obj=json_decode($eArr[$k]);
      if($obj->ID==$ID){
        continue;
      }else{
        $obj=json_encode($obj);
        $obj=$obj."\r\n"; 
        $content= $content.$obj;   
      }  
    }
    $ep=@fopen($ePath,"w");//以写的方式打开文件
    @fputs($ep,$content);
    @fclose($ep);
  }else if($methodtype==3){//3表示修改
    $delMarker=$fData;
    $ID=$delMarker->ID;
    $content="";
    $eArr=file($ePath); 
    //首先删除该标记对象
    for($k=0;$k<count($eArr);$k++){
      $eArr[$k]=str_replace("\r\n","",$eArr[$k]);
      $obj=json_decode($eArr[$k]);
      if($obj->ID==$ID){
        continue;
      }else{
        $obj=json_encode($obj);
        $obj=$obj."\r\n"; 
        $content= $content.$obj;   
      }  
    }
    //然后添加
    $fData = json_encode($fData)."\r\n";
    $content=$content.$fData;
    $ep=@fopen($ePath,"w");//以写的方式打开文件
    @fputs($ep,$content);
    @fclose($ep);
  }
}else if($type==2){//2是线路
  $ePath = $bPath."line.log";
  $fData=$dataObj->data;
  if ($methodtype==1){//1标识线路
    $elineLog = fopen($ePath, "a");
    $fData = json_encode($fData)."\r\n";
    fwrite($elineLog,$fData);
    fclose($elineLog);
  }else if($methodtype==2){//2表示删除
    $delLine=$fData;
    $ID=$delLine->ID;
    $content="";
    $eArr=file($ePath); 
    for($k=0;$k<count($eArr);$k++){
      $eArr[$k]=str_replace("\r\n","",$eArr[$k]);
      $obj=json_decode($eArr[$k]);
      if($obj->ID==$ID){
        continue;
      }else{
        $obj=json_encode($obj);
        $obj=$obj."\r\n"; 
        $content= $content.$obj;   
      }  
    }
    $ep=@fopen($ePath,"w");//以写的方式打开文件
    @fputs($ep,$content);
    @fclose($ep);
  }
}

	
?>