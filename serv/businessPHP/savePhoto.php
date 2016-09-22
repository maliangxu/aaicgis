<?php	
class Photo{
	private $dataURLs;
	private $ids;
	public function create(){
		for ($i= 0;$i< count($this->dataURLs); $i++){
			/*$parts = explode(',', $dataURL[$i]);  
			$data = $parts[1]; */ 	
			$encodedData = str_replace(' ','+',$this->dataURLs[$i]);
			$encodedData = preg_replace('/^data:image\/(png|jpg);base64,/','',$encodedData);
			$data = base64_decode($encodedData);  
			$id=$this->ids[$i]->id;
			$file ="photo\\". $id;	//UPLOAD_DIR .uniqid() . '.png';	
			$success = file_put_contents($file, $data);
		}
		echo $success ? 'success!' : 'Unable to save this image.';	
	}
	public function __construct($data,$id){
		$this->dataURLs=$data;
		$this->ids=$id;
	}
}

if ( isset($_POST["image"]) && !empty($_POST["image"]) ) {    
    $dataURLs = $_POST["image"];  
	$dataURLs=json_decode($dataURLs);
	
	$infoStr=stripslashes($_POST["info"]);
	$info=json_decode($infoStr);
	$ids=$info->photoInfo;
	
    $photo=new Photo($dataURLs,$ids);
	$photo->create();
	
	$fPath="photo\\photo.log";
	$fPhoto = fopen($fPath, "a");
	$infoStr = $infoStr."\r\n";
	fwrite($fPhoto,$infoStr);
	fclose($fPhoto);
}
?>