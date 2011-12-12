<?php

require_once('header.php');

$theTime = date("Hi");

/*$jsonString = "{\"cat_id\":{";*/
$jsonString = "{";

$categoryById = mysql_query("SELECT * FROM `component_categorynames`") or die(mysql_error());

$catArray=array();

while($row = mysql_fetch_array($categoryById)) {
	
		 $catArray[$row['id']] = $row['name'];

	}
	
foreach($catArray as $id => $category)
{
	
	
	$result = mysql_query("SELECT * FROM `component_sectors` where cat_id=".$id) or die(mysql_error());
	$sectorArr = array();
	$pathArr = array();
	
	$len=count($result);
	

	$pos=1;
	while($row = mysql_fetch_array($result)) {
	
		 $sectorArr[$row['number']] = $row['sector'];
		 $pathArr[$row['number']] = $row['xml'];
		  
	}
	
	$len=count($sectorArr);
	$jsonString = $jsonString."\"".$id."\":{\"cat_id\":\"".$id."\", \"cat_label\":"."\"".trim($catArray[$id])."\",\"members\":{";
	
	
	foreach ($sectorArr as $sec_id => $sector) {
	$jsonString = $jsonString."\"".$sec_id."\":";
	
		  $jsonString = $jsonString."{\"sec_id\":\"".$sec_id."\",\"sec_label\":\"".$sector."\",\"xml\":\"".$pathArr[$sec_id]."\",\"cat_id\":\"".$id."\"}";
		
		  if($pos!=$len)
			 $jsonString.=",";
		  $pos+=1;

	}

	if($len!=0)
	{
		$jsonString.="}}";
		if($id!=count($catArray))
			$jsonString.=",";
	}
}

$jsonString = $jsonString."}}";
echo $jsonString."}";


?>
