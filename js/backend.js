/**
 * @author Aneesh Bhoopathy
 *         aneesh.bhoopathy@gmail.com
 */

//TODO: Important!! all getter functions should check if db was gotten already.
//That is the entire point of having the backend class.

/**
 * Creates an instance of Backend object
 *
 * @constructor
 * @this {Backend}
 */
function Backend() {

  this.sector_list = new Array() /* array of each sector in DB */
  this.category_list = new Array() /* array of each category in DB */
  this.DOMAIN = ""; /* Domain where php calls should be made */
  this.sector_XML = null; /* XML data for sector */
  this.metrics = {
      "1":{ id:"1", name:"Acidification Air", path:"acid_air" },
      "2":{ id:"2", name:"CO", path:"co"  },
      "3":{ id:"3", name:"Eutrophication Air", path:"eutrophication_air" },
      "4":{ id:"4", name:"Eutrophication Water", path:"eutrophication_water" },
      "5":{ id:"5", name:"Global Warming", path:"global_warming" },
      "6":{ id:"6", name:"HH Criteria Air", path:"hh_criteria_air" },
      "7":{ id:"7", name:"High Ecotoxicity", path:"high_ecotoxicity" },
      "8":{ id:"8", name:"High Human Health Cancer", path:"high_human_health_cancer" },
      "9":{ id:"9", name:"High Human Health Noncancer", path:"high_human_health_noncancer" },
      "10":{ id:"10", name:"Low Ecotoxicity", path:"low_ectoxicity" },
      "11":{ id:"11", name:"Low Human Health Cancer", path:"low_human_health_cancer" },
      "12":{ id:"12", name:"Low Human Health Noncancer", path:"low_human_health_noncancer" },
      "13":{ id:"13", name:"NH3", path:"nh3" },
      "14":{ id:"14", name:"NOX", path:"nox" },
      "15":{ id:"15", name:"Ozone Depletion", path:"ozone_depletion" },
      "16":{ id:"16", name:"PM-10", path:"pm10" },
      "17":{ id:"17", name:"PM-25", path:"pm25" },
      "18":{ id:"18", name:"Purch_Total_Energy", path:"purch_total_energy" },
      "19":{ id:"19", name:"RCRA", path:"rcra" },
      "20":{ id:"20", name:"Smog Air", path:"smog_air" },
      "21":{ id:"21", name:"so2", path:"so2" },
      "22":{ id:"22", name:"Total GHGs", path:"total_ghgs" },
      "23":{ id:"23", name:"VOC", path:"voc" },
      "24":{ id:"24", name:"Water Use", path:"water_use" }
     };

this.metric_list = [

  {heading:"Energy & Greenhouse Gases",
   metrics:[
      {id:"1", name:"Energy", path:"purch_total_energy", units:"Terajoules"},
      {id:"2", name:"Greenhouse Gases", path:"total_ghgs", units:"metric tons CO2-equivalents"}
  ]},

  {heading:"US EPA TRACI Indicators",
   metrics:[
      {id:"3", name:"Acidification (Air)", path:"acid_air", units:"Metric Tons"},
      {id:"4", name:"Eutrophication (Air)", path:"eutrophication_air", units:"Metric Tons"},
      {id:"5", name:"Eutrophication (Water)", path:"eutrophication_water", units:"Metric Tons"},
      {id:"6", name:"Ecotoxicity (Low)", path:"low_ectoxicity", units:"Metric Tons"},
      {id:"7", name:"Ecotoxicity (High)", path:"high_ecotoxicity", units:"Metric Tons"},
      {id:"8", name:"Global Warming (Air)", path:"global_warming", units:"Metric Tons"},
      {id:"9", name:"Human Health Criteria (Air)", path:"hh_criteria_air", units:"Metric Tons"},
      {id:"10", name:"Human Health Cancer (Low)", path:"high_human_health_cancer", units:"Metric Tons"},
      {id:"11", name:"Human Health Cancer (High)", path:"high_human_health_noncancer", units:"Metric Tons"},
      {id:"12", name:"Human Health Non-Cancer (Low)", path:"low_human_health_cancer", units:"Metric Tons"},
      {id:"13", name:"Human Health Non-Cancer (High)", path:"low_human_health_noncancer", units:"Metric Tons"},
      {id:"14", name:"Ozone Depletion", path:"ozone_depletion", units:"Metric Tons"},
      {id:"15", name:"Smog (Air)", path:"smog_air", units:"Metric Tons"}
  ]},

  {heading:"Conventional Air Emissions",
   metrics:[
      {id:"16", name:"Carbon Monoxide (CO)", path:"co", units:"metric tons,"},
      {id:"17", name:"Ammonia (NH3)", path:"nh3", units:"metric tons"},
      {id:"18", name:"Nitrogen Oxides (NOx)", path:"nox", units:"metric tons"},
      {id:"19", name:"Particulate Matter < 10 µ (PM10)", path:"pm10", units:"metric tons"},
      {id:"20", name:"Particulate Matter < 2.5 µ (PM2.5)", path:"pm25", units:"metric tons"},
      {id:"21", name:"Sulfur Dioxide (SO2)", path:"so2", units:"metric tons"},
      {id:"22", name:"Volatile Organics (VOC)", path:"voc", units:"metric tons"}
  ]},

  {heading:"Other Indicators",
   metrics:[
    {id:"23", name:"Hazardous Waste (RCRA C)", path:"rcra", units:"tons (short)"},
    {id:"24", name:"Water Use", path:"water_use", units:"thousand gallons"}
  ]},
]


  /**
   * gets metrics list defined above
   */
  this.get_metric_list = function() { return this.metric_list; }

  /**
   * Gets section data JSON given it's ID, for example
   * {"sec_id":"11","sec_label":"Milk Production","xml":"xml\newLoop$1MSector_11","cat_id":"1"}
   *  TODO make sure sectorlist is already parsed, if not try get, return error
   * @param {number} secID ID of sector to get
   */
  this.get_sector_by_id = function(secID) { return this.sector_list[secID]; }

  /**
   * Gets section name given it's ID
   *  TODO make sure sectorlist is already parsed
   * @param {number} secID ID of sector to get
   */
  this.get_sector_name_by_id = function(secID) { return this.sector_list[secID].sec_label; }

  /**
   * Gets entire sector_list array, e.g
   * [ {cat_id: "1", sec_id: "1", sec_label: "Oilseed farming", xml: "xml/newLoop$1MSector_1"}, ...]
   */
  this.get_sector_list = function() { return this.sector_list; }

  /**
   * Gets entire category_list array, e.g
   * [ {cat_id:"1", cat_label: "Agri..",
          members: [{cat_id: "1", sec_id: "1", sec_label: "Oilseed farming", xml: "xml/newLoop$1MSector_1"},...]}]
   */
  this.get_category_list = function() { return this.category_list; }

  /**
   * Initializes the backend by populating sector_list, category_list,
   * and optionally, XML data for a specific sector.
   *
   * @param {boolean} getXML Boolean specifying whether or not xml data should be returned
   * @param {function} getXML Boolean specifying whether or not xml data should be returned
   */
  this.init_backend = function(get_XML,cb) {
    //boolean to determine whether or not to get xml data			

    if(get_XML) {
      this.get_categories(function(){
        get_XML_by_sector(cb);
      });
    } else {
      this.get_categories(function(){
        cb();
      });
    }

  }

  /**
   * Retrieves the correct XMLdata
   */
  this.get_XML_by_sector_and_metric = function (sector_id, metric_id, cb ) {
    var obj = this;
		var sector_file = sector_id + '.xml';

		if(metric_id != undefined) {
	    var metric_subpath = this.metrics[metric_id].path
		} else {
			metric_subpath = this.metrics[1].path;
		}
		
		console.log(this.DOMAIN + "xml/"+ metric_subpath + "/" + sector_file);
    //newLoop$1MSector_234
    $.ajax({
        type: "GET",
        url: this.DOMAIN + "xml/"+ metric_subpath + "/" + sector_file, //DOMAIN + sectorPath+".xml",
        dataType: "xml",
        success: function(xml) {
          obj.sector_XML = xml;
					cb(obj.sector_XML);
        }
      });	
  }

  /**
   * Makes a PHP call to get_categories.php, which will populate the
   * sector_list and category_list variables
   *
   * @param {function} cb function to call after data retrieval is complete
   */
  this.get_categories = function(cb) {

    //already cached
    if (this.category_list.length > 0 && cb != undefined) {
      cb();
      return;
    }

    //temporary variable containing 'this'
    var bcknd_obj = this;

    //GET call for get_categories.php
    var jqxhr = $.getJSON(this.DOMAIN + "php/get_categories.php", function() {})
    .complete(function(data) {
      //parsing this json yields the category list
      bcknd_obj.category_list = $.parseJSON(data.responseText);

      //for each category in list
      $.each(bcknd_obj.category_list,function() {
        var cat_members = this.members;

        //add it's all members to sector_list
        $.each(cat_members, function() {
          bcknd_obj.sector_list[this.sec_id] = this;
        });

      });

      //callback function
			if(cb != undefined) {
      	cb();	
			}
    });
  }

}
