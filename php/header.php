<?php

$con = mysql_connect("localhost","eiolca","xyzzy");
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("eiolca",$con);

?>
