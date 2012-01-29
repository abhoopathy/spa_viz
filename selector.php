<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php
	require_once('php/backend.php');
?>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>EIOLCA | Pick a sector</title>

<script src="js/jquery-1.5.1.js" type="text/javascript"></script>
<script src="js/jquery-ui-1.8.9.custom.min.js" type="text/javascript"></script>
<script src="js/jquery.ba-hashchange.min.js" type="text/javascript"></script>
<script src="js/backend.js" type="text/javascript"></script>
<script src="js/tooltip.js" type="text/javascript"></script>
<script src="js/visualization.js" type="text/javascript"></script>
<script src="js/sector-picker.js" type="text/javascript"></script>
<script src="js/main.js" type="text/javascript"></script>


<link rel="stylesheet" type="text/css" href="css/custom-theme/jquery-ui-1.8.11.custom.css"/>
<link rel="stylesheet" type="text/css" href="css/style.css"/>
<link rel="stylesheet" type="text/css" href="css/vis.css"/>
<link rel="stylesheet" type="text/css" href="css/selector.css"/>
</head>

<body>
<?php include('pageTop.php'); ?>
    
  <div id="selector_page">

    <!--
	 	<div class="aBox"id="chooseMetric">
    		<h2>Choose Metric</h2>
        <select id="metricSelect"></select>
		</div>
    -->

		<div class="aBox"id="searchBySector">
    		<h2>Search by Sector</h2>
            <div id="searchbg">
            	<input type="text" id="sectorAutocomplete" value="Begin typing a sector" onfocus="this.select()">
            </div>
		</div>
        <div class="aBox" id="browseByCategory">
        	<h2>Browse by Category</h2>
        	<div class="catTriColumn"></div>
        	<div class="catTriColumn"></div>
        	<div class="catTriColumn"></div>
            <div class="cleardiv"></div>
        </div>
  </div>

  <div id="sector_page">

    <div id="container" class="aBox" sec_path=" <?php echo $sec_path ?>">	
      <h2 id="sectorName">Sector: <?php echo $sec_name ?></h2>
      <div id="metricChooserBox">
          Metric:
          <select id="metricSelect"></select>
      </div>
      <div class="cleardiv"></div>

      <h4>Top 5 Emission Sources</h4>
      <div id="top_categories"></div>

      <h4>Economic Pathway</h4>
      <div id="vizcontainer" sec_id="<?php echo $sec_id ?>"></div>
      <a href="selector.php"><button id="backButton">Return To Sector Menu</button></a>
    </div>

  </div>

</body>
</html>
