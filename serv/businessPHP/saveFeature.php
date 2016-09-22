<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1); 

$fMethod = $_POST['method'];
$fShp = $_POST['sType'];
$fData = $_POST['data'];
$fErrorData = $_POST['errorLog'];
$fData=stripslashes($fData);

$town = $_POST['townEnName'];
echo $town;
$arr = explode("_",$town);
$county = $arr[0];
$townName = $arr[1]; 

$bPath = "data\\".$county."\\".$townName."\\";

switch ($fMethod) {
	case 1://添加要素
       switch($fShp){
       	case 1://点
       	    $fPath = $bPath."Point.g";
			$fPoint = fopen($fPath, "a");
			
			$fData = $fData."\r\n";
			fwrite($fPoint,$fData);
			fclose($fPoint);
			$fObj = json_decode($fData);
			$eArr = array();
			$eArr['ID'] = $fObj->ID;
			$eArr['eCode'] = "-1";
			$eArr['info'] = "";
			#$eStr = json_encode($eArr);
			$eStr = $eArr['ID'].",".$eArr['eCode'].",".$eArr['info'];
			$ePath = $bPath."Point.aux";
			$ePoint = fopen($ePath, "a");
            $eData = $eStr."\r\n";
            fwrite($ePoint,$eData);
			fclose($ePoint);
		    break;
       	case 3://线
       	    $fPath = $bPath."Polyline.g";
			$fPolyline = fopen($fPath, "a");
			$fData = $fData."\r\n";
			fwrite($fPolyline,$fData);
			fclose($fPolyline);
			$fObj = json_decode($fData);
			$eArr = array();
			$eArr['ID'] = $fObj->ID;
			$eArr['eCode'] = "-1";
			$eArr['info'] = "";
			#$eStr = json_encode($eArr);
			$eStr = $eArr['ID'].",".$eArr['eCode'].",".$eArr['info'];
			$ePath = $bPath."Polyline.aux";
			$ePolyline = fopen($ePath, "a");
            $eData = $eStr."\r\n";
            fwrite($ePolyline,$eData);
			fclose($ePolyline);
			break;
       	case 5://面
       	    $fPath = $bPath."Polygon.g";
			$fPolygon = fopen($fPath, "a");
			$fData = $fData."\r\n";
			fwrite($fPolygon,$fData);
			fclose($fPolygon);
            
			
			break;
       }
		break;
	
	case 2://修改要素，既没做添加 也没做删除
	    $arr = array();
	    switch($fShp){
	       	case 1:
	       	    $fPath = $bPath."Point.g";
			    break;
	       	case 3:
	       	    $fPath = $bPath."Polyline.g";
			    break;
	       	case 5:
	       	    $fPath = $bPath."Polygon.g";
			    break;
	       }
	    $i = 1;
		$fp = fopen($fPath, "r");
		if ($fp) {
		    while (!feof($fp)) {
		        $str = fgets($fp);
		        if(gettype($str) == 'string'){
		          $str = str_replace("\r\n","",$str);
		          $obj = json_decode($str);
		          if(gettype($obj) == 'object'){
		          	 $fObj = json_decode($fData);
		          	 if($obj->ID == $fObj->ID){
		          	 	break;
		          	 }				          	 		     
		          }
		        }
		        $i++;
		    }
		 }
	   $fArr=file($fPath); 
	    $newfp = ""; //我的修改；以前没有；此处为添加定义变量，否则360浏览器不识别
	   for($j=0;$j<count($fArr);$j++){
	   	if(strcmp($j+1,$i)==0){
           $newfp.= $fData."\r\n";;
	   	}else{
           $newfp.=$fArr[$j]; 

	   	}
	   }
	   $fp=@fopen($fPath,"w");//以写的方式打开文件
       @fputs($fp,$newfp);
       @fclose($fp);
	   break;
	 case 3://删除要素
	    switch($fShp){
	       	case 1:
	       	    $fPath = $bPath."Point.g";
			    break;
	       	case 3:
				$fPath = $bPath."Polyline.g";
			    break;
	       	case 5:
				$fPath = $bPath."Polygon.g";
			    break;
	       }

		 	$i = 1;
		    $fp = fopen($fPath, "r");
			if ($fp) {
			    while (!feof($fp)) {			    	
			        $str = fgets($fp);
			        if(gettype($str) == 'string'){
			          $str = str_replace("\r\n","",$str);
			          $obj = json_decode($str);
			          if(gettype($obj) == 'object'){
			          	 $fObj = json_decode($fData);
			          	 if($obj->ID == $fObj->ID){
			          	 	break;
			          	 }				          	 		     
			          }
			        }
			        $i++;
			    }
			 }
		   $fArr=file($fPath);	  
		   $newfp = ""; //我的修改；以前没有；此处为添加定义变量，否则360浏览器不识别
		   for($j=0;$j<count($fArr);$j++){
		   	if(strcmp($j+1,$i)==0){
		        continue;
		   	}else{
		        $newfp.=$fArr[$j]; 
		   	}
		   }
		   $fp=@fopen($fPath,"w");//以写的方式打开文件
		   @fputs($fp,$newfp);
		   @fclose($fp);
	   break;
}
  $rownum=array();
  //修改错误日志信息
  $ePath = $bPath."Polygon.aux";
  $fErrorData=stripslashes($fErrorData);
  echo($fErrorData);
  if($fErrorData!=""){
  	$errArr=json_decode($fErrorData);
  	print_r($errArr);
  	for($i=0;$i<count($errArr);$i++){
  		$ep = fopen($ePath, "r");
  		if ($ep) {
  			$j=0;
		    while (!feof($ep)) {
               $str = fgets($ep);
               if(gettype($str) == 'string'){
               	  $str = str_replace("\r\n","",$str);
               	  $obj=json_decode($str);
               	  print_r($obj);
               	  if($obj->X==$errArr[$i]->X&&$obj->Y==$errArr[$i]->Y){
                     array_push($rownum,$j);
                     break;
               	  }
               }
               $j++;
		    }
		}
  	}
  	print_r($rownum);
    $content="";
  	$eArr=file($ePath); 
  	for($k=0;$k<count($eArr);$k++){
  		if(in_array($k,$rownum)){
  		  $eArr[$k]=str_replace("\r\n","",$eArr[$k]);
  		  $obj=json_decode($eArr[$k]);
  		  $obj->Marker=0;
  		  $obj=json_encode($obj);
  		  $obj=$obj."\r\n"; 
  		  $content= $content.$obj;        
  		}else{
  		  $content= $content.$eArr[$k];
  		}
  	}
  	$ep=@fopen($ePath,"w");//以写的方式打开文件
    @fputs($ep,$content);
    @fclose($ep);
  }
?>