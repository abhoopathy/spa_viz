<?php

require_once('header.php');

$theTime = date("Hi");

$result = mysql_query("SELECT * FROM `component_sectors`") or die(mysql_error());
$sectorArr = array();
while($row = mysql_fetch_array($result)) {
	$sectorArr[$row['number']] = $row['sector'];
}

$jsonString = "{\"sectors\":{";

foreach ($sectorArr as $id => $sector) {
    $jsonString = $jsonString."\"".$id."\":{\"label\":\"".$sector."\",\"id\":\"".$id."\"},";
}

$jsonString = $jsonString."}}";

echo $jsonString;

//json_encode($sectorArr);

//.{id:"sector",id:"sector"...

?>
