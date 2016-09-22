<?php
/**
*通用类
*/
class Table_CRUD
{
  /*****执行数据添加函数*******/
  public function addRecords($dbh,$sql){
    $info=$dbh->prepare($sql);
    $res=$info->execute(); 
    if($res){$li=true;}
    else{$li=false;}
    return $li;
  }
  /*****执行数据删除函数*******/
  public function deleteRecords($dbh,$sql)
  {
    $count = $dbh->exec($sql);
     if ($count) {
      $li=true;
    } else {
      $li=false;
    }
    return $li;
  }
  /*****执行数据修改函数*******/
  public function updateRecords($dbh,$sql){
    $count = $dbh->exec($sql);
    if ($count) {
      $li=true;
    } else {
      $li=false;
    }
    return $li;
  }
  /*****执行数据修改函数*******/
  public function createTable($dbh,$sql){
    $info=$dbh->prepare($sql);
    $res=$info->execute(); 
    if($res){$li=true;}
    else{$li=false;}
    return $li;
  }
  /*****执行数据查找函数*******/
  public function getRecords($dbh,$sql){
    $info = $dbh->prepare($sql);
    $info->execute();
    $li = $info->fetchAll();
    $entries   = array();
    foreach ($li as $row) {
        $entry = array();
        foreach ($row as $key => $value) {
            $keyType=gettype($key);
            if($keyType!="integer"){
               $entry[$key] = $value;
            }
        }
        $entries[] = $entry;
    }
    return $entries;
  }
  /*****判断函数*******/
  public function judgeRecords($dbh,$sql){
    $info = $dbh->prepare($sql);
        $info->execute();
        $res = $info->fetchAll();
        if ($res) {
          $li=true;  
         } else {
          $li=false;
         }
        return $li;
  }
}
?>