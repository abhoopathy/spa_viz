<?php

require_once('header.php');
$categoryById = mysql_query("SELECT * FROM `component_categorynames`") or die(mysql_error());


$catArray=array();
$catMembers=array();
$sectorName=array();
$sectorPath=array();
$sectorCat=array();

while($row = mysql_fetch_array($categoryById)) {
	$catArray[$row['id']] = $row['name'];
}

foreach($catArray as $catId => $category)
{
	$thisCatMembers = array();
	
	$result = mysql_query("SELECT * FROM `component_sectors` where cat_id=".$catId) or die(mysql_error());

	while($row = mysql_fetch_array($result)) {
	
		 $sectorName[$row['number']] = $row['sector'];
		 $sectorPath[$row['number']] = $row['xml'];
		 $thisCatMembers[$row['number']]= $row['sector'];
	}
	
	$catMembers[$catId] = $thisCatMembers;
}

/*
foreach ($catMembers as $cat_id => $memberArr) {	
	echo $catArray[$cat_id]."<br>";
	
	foreach ($memberArr as $sec_id => $sectorName) {
		echo " - id: ".$sec_id." name:".$sectorName." path:".$sectorPath[$sec_id]."<br>"; 
	}
}
*/

?>
