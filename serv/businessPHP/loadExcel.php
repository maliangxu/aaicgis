<?php
if((($_FILES["file"]["type"]=="text/plain")||($_FILES["file"]["type"]="application/vnd.ms-excel")||($_FILES["file"]["type"]=="application/pdf"))&&($_FILES["file"]["size"]<2000000))
{
  if($_FILES["file"]["error"]>0)
    echo "文件传输错误.";
                /*$_FILES["file"]["error"] - 由文件上传导致的错误代码 */
  else
  {
  	$name=iconv("UTF-8","GBK//IGNORE",$_FILES["file"]["name"]);

    //echo "FileName:".$_FILES["file"]["name"]."<br />";
                /*$_FILES["file"]["name"] - 被上传文件的名称 */
   //echo "FileType:".$_FILES["file"]["type"]."<br />";
                /*$_FILES["file"]["type"] - 被上传文件的类型 */
    //echo "FileSize:".$_FILES["file"]["size"]."<br />";
                /*$_FILES["file"]["size"] - 被上传文件的大小*/
     /***判断文件夹是否存在，如果不存在创建一个文件夹***/
 	if(!is_dir("upload")){
 		mkdir("upload");
 	}
                /*判断选择上传文件是否存在*/
    if(file_exists("upload/".$name))
    {

      echo "该文件名已经存在!";
    }
    else
    { 
      //echo ("upload/".$name);
          /*将临时副本中的文件移动到目的文件夹upload中*/
      move_uploaded_file($_FILES["file"]["tmp_name"],
                           "upload/".$name);
                        /*$_FILES["file"]["tmp_name"] - 存储在服务器的文件的临时副本的名称*/
      echo "文件保存成功";
    }
  }
}else{
	echo "格式不正确";
}
exit;
?>