/**
 * @author Aneesh Bhoopathy
 *         aneesh.bhoopathy@gmail.com
 */

/**
 * Creates an instance of Backend object
 *
 * @constructor
 * @this {Backend}
 */
function Backend() {

  this.sector_list = new Array() /* array of each sector in DB */
  this.category_list = new Array() /* array of each category in DB */
  this.DOMAIN = "http://localhost/componentviz/"; /* Domain where php calls should be made */
  this.sector_XML = null; /* XML data for sector */
  this.metrics = {"1":{ id:"1", name:"Emissions", path:"emissions" }, /* array of metrics for UI */
                  "2":{ id:"2", name:"Water", path:"water" },
                  "3":{ id:"3", name:"Green House Gas", path:"ghg" }};

  /**
   * gets metrics list defined above
   */
  this.get_metric_list = function() { return this.metrics; }

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
		if(metric_id == undefined) metric_id = 1;
		
    var metric_subpath = this.metrics[metric_id].path
		var sector_file = sector_id + '.xml';
    var obj = this;
		var params = controller.get_params();

    //newLoop$1MSector_234
    $.ajax({
        type: "GET",
        url: this.DOMAIN + "xml/"+ metric_subpath + "/" + sector_file, //DOMAIN + sectorPath+".xml",
        dataType: "xml",
        success: function(xml) {
          obj.sector_XML = xml;
          if(cb != undefined) {
						cb();
					}
        }
      });	

		return obj.sector_XML;
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
