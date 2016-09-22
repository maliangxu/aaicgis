<?php
echo header("Access-Control-Allow-Origin:*");
if ( isset($_POST["image"]) && !empty($_POST["image"]) ) {    
    $dataURLs = $_POST["image"];  
	$info=$_POST["info"];

	$encodedData = str_replace(' ','+',$dataURLs);
	$encodedData = preg_replace('/^data:image\/(png|jpg);base64,/','',$encodedData);
	$data = base64_decode($encodedData);  
	$file ="photo\\". $info;	
	$success = file_put_contents($file, $data);
	echo $success ? 'success!' : 'Unable to save this image.';
}
?>