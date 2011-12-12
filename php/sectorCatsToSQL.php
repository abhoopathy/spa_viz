<?php

require_once('header.php');

$categories = array();
/*

table names: `component_categorynames` and `componentsectornamesbackup`
viewable at http://www.eiolca.net/abhoopat/componentviz/staging/php/sectorCatsToSQL.php

*/
$handle = @fopen("sectorCats.txt", "r");
if ($handle) {
    while (($buffer = fgets($handle, 4096)) !== false) {
        //echo $buffer;
		$catToInsert;
		if (!is_numeric($buffer[1]) && !is_numeric($buffer[0])) {
			$categories[$buffer] = array();
			$catToInsert = $buffer;
		} else {
			$string = substr($buffer,7);
			array_push($categories[$catToInsert],$string);
		}
		
    }
    if (!feof($handle)) {
        echo "Error: unexpected fgets() fail\n";
    }
    fclose($handle);
}

foreach ($categories as $cat => $arr) {
	echo "CATEGORY: ".$cat;
	echo "</br>";
	echo implode($arr,"</br>");
	echo "</br>";
	echo "</br>";
}



/*
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
*/


//echo $jsonString;

//json_encode($sectorArr);

//.{id:"sector",id:"sector"...
	function charAt($string, $index){
		if($index < mb_strlen($string)){
			return mb_substr($string, $index, 1);
		}
		else{
			return -1;
		}
	}

?>