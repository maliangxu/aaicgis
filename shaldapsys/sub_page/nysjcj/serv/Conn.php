<?php
$aTmpDir = explode(':',dirname(__FILE__)); 
$tmpDir=$aTmpDir[0];
$dirPath_GeoDB=$tmpDir.":/ecnu/data/GeoDB/";
$dbh_dir="sqlite:".$dirPath_GeoDB;
?>