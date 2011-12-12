<?php

require_once('header.php');

$theTime = date("Hi");

$result = mysql_query("SELECT * FROM `componentsectornamesbackup`") or die(mysql_error());
$sectorArr = array();
while($row = mysql_fetch_array($result)) {
    $delCommand="DELETE FROM `componentsectornamesbackup` WHERE number=".$row['number'];
	echo $delCommand;
	mysql_query($delCommand);
	$sectorArr[$row['number']] = $row['sector'];
	$fileName="xml\\\\newLoop$1MSector_".$row['number'];
	$addCommand="INSERT INTO `componentsectornamesbackup` (number, sector, xml) VALUES (".$row['number'].",'".$row['sector']."','".$fileName."')";
	echo $addCommand;
	//echo "\n";
	mysql_query($addCommand);
}



//echo $jsonString;

//json_encode($sectorArr);

//.{id:"sector",id:"sector"...

?>