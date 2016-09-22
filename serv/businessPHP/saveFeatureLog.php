<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$type=$_GET['sType'];
$town=$_GET['townEnName'];
$arr = explode("_",$town);
$county = $arr[0];
$townName = $arr[1]; 
$bPath = "data\\".$county."\\".$townName."\\";
if($type==1){//添加错误标识
  $fData=$_GET['data'];
  $fData=stripslashes($fData);

  $ePath = $bPath."Polygon.aux";
  $ePolygon = fopen($ePath, "a");
  $fData = $fData."\r\n";
  fwrite($ePolygon,$fData);
  fclose($ePolygon);
}else if($type==2){//某个错误要素审核通过
  $X=$_GET['X'];
  $Y=$_GET['Y']; 
  $ePath = $bPath."Polygon.aux"; 

  $content="";
  $eArr=file($ePath); 
  for($k=0;$k<count($eArr);$k++){
      $eArr[$k]=str_replace("\r\n","",$eArr[$k]);
      $obj=json_decode($eArr[$k]);
      if($obj->X==$X&&$obj->Y==$Y){
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
}else if($type==3){//上报按钮 需要清空错误日志
   $ePath = $bPath."Polygon.aux"; 
   unlink($ePath);
}else if($type==4){//审核未通过，需要修改原先的Marker为1
  $X=$_GET['X'];
  $Y=$_GET['Y']; 
  $ePath = $bPath."Polygon.aux"; 

  $content="";
  $eArr=file($ePath); 
  for($k=0;$k<count($eArr);$k++){
      $eArr[$k]=str_replace("\r\n","",$eArr[$k]);
      $obj=json_decode($eArr[$k]);
      if($obj->X==$X&&$obj->Y==$Y){
        $obj->Marker=1;
        $obj=json_encode($obj);
        $obj=$obj."\r\n"; 
        $content= $content.$obj; 
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





	
?>