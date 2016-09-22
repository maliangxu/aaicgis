<?php
    //创建Conntion连接于获取数据表
    function createConn($db){
      global $dbh_dir;global $dbh;
      $dbpath=$dbh_dir.$db; 
      $dbh= new PDO($dbpath) or die ('数据库连接失败');
      $dbh->query('set names utf8');
    }




/*****************************************************
                 method==userLogin
*****************************************************
                 用户登录信息
*****************************************************

*****************************************************/
function GetTaskByUsr($dBaseName,$UsrID){
	global $dbh;
	$dbName=$dBaseName.".db";
    createConn($dbName);
    $returnValue=array();
    $table = new Table_CRUD();

    //此sql语句为数据采集任务sql查询
    $sql="select towninfo.Name as distName,countyinfo.Name as preDistName,task.DistID as distId,towninfo.X as distX,towninfo.Y as distY from task,towninfo,countyinfo where task.DistID=towninfo.ID and towninfo.CountyID=countyinfo.ID and task.TaskType='dig' and task.UserID=".$UsrID;
    $res_dataget=$table->getRecords($dbh,$sql);
    $count_town_get=count($res_dataget);
    if($count_town_get==0){
      //此sql语句为数据采集模块的区县中选择
      $sql_county_get="select countyinfo.Name as distName,countyinfo.PreDist as preDistName,task.DistID as distId,countyinfo.X as distX,countyinfo.Y as distY from task,countyinfo where task.DistID=countyinfo.ID and task.TaskType='dig' and task.UserID=".$UsrID;
      $res_datasta_county_get=$table->getRecords($dbh,$sql_county_get);
      $returnValue['dataget']=$res_datasta_county_get;
    }else{
      $returnValue['dataget']=$res_dataget;
    }
    

    //此sql语句为数据统计上报模块的首先从乡镇中选择
    $sql_town="select towninfo.Name as distName,countyinfo.Name as preDistName from task,towninfo,countyinfo where task.DistID=towninfo.ID and towninfo.CountyID=countyinfo.ID and task.TaskType='sta' and task.UserID=".$UsrID;
    $res_datasta_town=$table->getRecords($dbh,$sql_town);
    $count_town=count($res_datasta_town);
    if($count_town==0){
        //此sql语句为数据统计上报模块的区县中选择
    	$sql_county="select countyinfo.Name as distName,countyinfo.PreDist as preDistName from task,countyinfo where task.DistID=countyinfo.ID and task.TaskType='sta' and task.UserID=".$UsrID;
        $res_datasta_county=$table->getRecords($dbh,$sql_county);
        $returnValue['datasta']=$res_datasta_county;
    }else{
       $returnValue['datasta']=$res_datasta_town;
    }
    return $returnValue;
}
?>