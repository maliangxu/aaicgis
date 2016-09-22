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
function userLogin($dBaseName,$Name,$Pass){
	global $dbh;
	$dbName=$dBaseName.".db";
    createConn($dbName);
    $returnValue=array();
    $table = new Table_CRUD();
    $sql="select ID,Name,realName,RoleID,effect from usersinfo where Name='".$Name."' and Pass='".$Pass."'";
    $res=$table->getRecords($dbh,$sql);
    $res_count=count($res);
    if($res_count==0){
    	$returnValue['flag']=false;
    	return $returnValue;
    }
    $returnValue['flag']=true;

    $usrinfo=$res[0];//即为返回的usr信息
    $usr_effect=$usrinfo['effect'];
    if($usr_effect=="no"){
       $returnValue['effect']=false;
       return $returnValue;
    }
    $returnValue['effect']=true;

    $usrRole=$usrinfo['RoleID'];
    $sql_modules="select modules.ID,modules.Module from modules,role_module where role_module.ModuleID=modules.ID and role_module.RoleID=".$usrRole;
    $res_modules=$table->getRecords($dbh,$sql_modules);
    array_push($res,$res_modules);
    $returnValue['usr']=array();
    $returnValue['usr']['usrinfo']=$usrinfo;
    $returnValue['usr']['modules']=$res_modules;
    return $returnValue;
}
function getAllUnits($dBaseName,$sortUsrID){
  global $dbh;
  $dbName=$dBaseName.".db";
  createConn($dbName);
  $table = new Table_CRUD();
  if($sortUsrID=="all"){
    $sql="select ID,Name from unitinfo where ID<>20";//取消最后一个过渡部门
    $get_res=$table->getRecords($dbh,$sql);
    return $get_res;
  }else{
    $sql="select unitinfo.ID,unitinfo.Name from unitinfo,usersinfo where usersinfo.UnitID=unitinfo.ID and usersinfo.ID=".$sortUsrID;
    $get_res_id=$table->getRecords($dbh,$sql);
    $unitid=$get_res_id[0]['ID'];
    $sql_units="select ID,Name from unitinfo where ID<>20";//取消最后一个过渡部门
    $get_res=$table->getRecords($dbh,$sql_units);
    if($unitid=='20'){
      return $get_res;
    }
    $units_count=count($get_res);
    $newArr=array();
    for($i=0;$i<$units_count;$i++){
      if($get_res[$i]['ID']!=$unitid){
        array_push($newArr,$get_res[$i]);
      }else{
        array_unshift($newArr,$get_res[$i]);
      }
    }
    return $newArr;   
  }
}
function saveUsr($dBaseName,$usrName,$newPass,$usrRealName,$usrUnit,$usrTel,$usrEmail){
  global $dbh;
  $dbName=$dBaseName.".db";
  createConn($dbName);
  $table = new Table_CRUD();
  $returnValue=array();

//首先需要判断是否存在该用户
  $sql_exit="select ID from usersinfo where Name='".$usrName."'";
  $exit_res=$table->getRecords($dbh,$sql_exit);
  $exit_res_count=count($exit_res);
  if($exit_res_count>0){
    $returnValue['add']=false;
    return $returnValue;
  }
  $insertValues="("."'".$usrName."','".$newPass."','".$usrRealName."','".$usrUnit."','6','".$usrTel."','".$usrEmail."','yes')";
  $sql_add="insert into usersinfo (Name,Pass,realName,UnitID,RoleID,Tel,Mail,effect) values ".$insertValues;
  $add_res=$table->addRecords($dbh,$sql_add);
  $returnValue['add']=$add_res;
  return $returnValue;
}
function GetTaskByUsr($dBaseName,$UsrID){
  global $dbh;
  $dbName=$dBaseName.".db";
    createConn($dbName);
    $returnValue=array();
    $table = new Table_CRUD();

    //此sql语句为数据采集任务sql查询
    $sql="select towninfo.Name as distName,countyinfo.Name as preDistName,task.DistID as distId,towninfo.X as distX,towninfo.Y as distY from task,towninfo,countyinfo where task.DistID=towninfo.ID and towninfo.CountyID=countyinfo.ID and task.TaskType='dig' and task.UserID=".$UsrID;
    $res_dataget=$table->getRecords($dbh,$sql);
    $returnValue['dataget']=$res_dataget;

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
function getAllCountys($dBaseName){//获取数据采集的所有区县
  global $dbh;
  $dbName=$dBaseName.".db";
  createConn($dbName);
  $sql=""; 
  $sql="select ID,Name from countyinfo where class=1 and Name<>'上海市'";
  $table = new Table_CRUD();
  $res=$table->getRecords($dbh,$sql);
  return $res;
}
?>