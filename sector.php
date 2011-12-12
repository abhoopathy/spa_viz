<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<?php
	/*allows us to use $catArray,$catMembers,$sectorName,$sectorPath,$sectorCat*/
	require_once('php/backend.php');
	
	/*if the url is malformed, send back to selector page*/
	
	$sec_id = $_GET["sec_id"];
	
	$return = false;
	
	if ($sec_id == null)
		$return = true;
	
	if ($sectorName[$sec_id] == null)
		$return = true;
	
	if ($return)
   		header( 'Location: selector.php' ) ;
	
	$sec_name = $sectorName[$sec_id];
	$sec_path = $sectorPath[$sec_id]

?>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>EIOLCA | <?php echo $sec_name ?></title>

<!--<script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>-->
<script src="js/jquery-1.5.1.min.js" type="text/javascript"></script>
<script src="js/jquery-ui-1.8.9.custom.min.js" type="text/javascript"></script>
<script src="js/jquery.ba-hashchange.min.js" type="text/javascript"></script>
<script src="js/jquery.tipsy.js" type="text/javascript"></script>
<script src="js/backend.js" type="text/javascript"></script>
<script src="js/tooltip.js" type="text/javascript"></script>
<script src="js/visualization.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="css/custom-theme/jquery-ui-1.8.11.custom.css"/>
<link rel="stylesheet" type="text/css" href="css/style.css"/>
<link rel="stylesheet" type="text/css" href="css/vis.css"/>
<link rel="stylesheet"type="text/css" href="css/tipsy.css">

</head>

<body>
<?php include('pageTop.php'); ?>

<div id="selector_page">
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
    <div id="vizcontainer" sec_id="<?php echo $sec_id ?>">
    </div>
    
	<a href="selector.php"><button id="backButton">Return To Sector Menu</button></a>
	
    <div id="helpDialog" style="display:none;">
		<div id="help" style="width: 600px;">
			<h2 style="overflow:auto;">
				<a href="#" class="tab_link selected" rel="help">Help</a>
				<a href="#" class="tab_link" rel="instructions">Instructions</a>
			</h2>
			
			<div class="tab selected" id="help_tab">
				<ul>
					<li>
						This tool was designed to perform structural path analysis (SPA) on the supply chain of a chosen industry sector of the economy.  This allows the users to "drill down" back through the production chain through layers of production to try to get a sense of which activities in the supply chain lead to significant impacts.
					</li>
					<li>
					 	On the next screen, you will first see a summary of the top 5 sectors across the supply chain (at all levels of production) that lead to the impacts (e.g., greenhouse gas emissions) that you have chosen.  These results are similar to those you could already find on the EIO-LCA website.	
					</li>
					<li>
						Below this initial summary of top 5 impacts, you will see a horizontal bar showing all of the first level activities that occur in production (e.g., impacts that are associated with final assembly at a factory).  You can then click on any of the grey bars to drill down further back in the supply chain - back to the fourth level upstream.
					</li>
					<li>
						Further help is available on the 'Instructions and Usage' tab.
					</li>
				</ul>
			</div>
			
			<div class="tab" id="instructions_tab">
				<ul>
            <li>
              To begin using the visualizer, click the top bar. This represents the impact of the industry in question. Upon clicking, you will see that impact split into its respective sources.
            </li>
            <li>
              Hover over a top-emission in the colorful bar to see where those industries appear in your current expansion of the visualizer.
            </li>
            <li>
              Hover over an industry rectangle to see its full name.
            </li>
            <li class="clearfix">
              <div class="block children" style="width: 100px; float: right; margin-left: 10px;">
                <span class="name">Example</span>
              </div>
              The <span style="color:#995A6C">red</span> line at the bottom of a rectangle indicates that the data point can be further
              broken into more data points. If no red line is visible, the data point can not be selected.
            </li>
            <li class="clearfix">
              <div class="block parent" style="width: 100px; float: right; margin-left: 10px;">
                <span class="name">Example 2</span>
              </div>
              The near-white blocks on the left of each level represent the output from the chosen data point.
            </li>
          </ul>
        </div>
        
      </div>	
    </div>
      
  </div>
</div>


</body>
</html>
