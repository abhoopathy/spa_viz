// JavaScript Document

function Visualization( backend_obj, tooltip ) {

  //Backend object, see backend.js
  this.backend = backend_obj;

  //ToolTip object, see tooltip.js
  this.tooltip = tooltip;

  // Deals with whole visualization page
  var $sector_page = $('#sector_page');
  var $sector_title = $('#sectorName');
  this.hide = function() { $sector_page.hide(); }
  this.show = function() { $sector_page.show(); }
  
  var vis = this;

  var sector_name;

  //Various display variables and depth variables
  this.DISPLAY_WIDTH = $('#vizcontainer').width();
  var BLOCK_HEIGHT = 42;
  var LEVELS = 5;
  var RELEVANCE_THRESHOLD = .1;

  //Data for the top categories bar
  var TOP_CATEGORIES = 5;
  var frequency_hash = [];
  var TOP_COLORS = ["#FF6969","#36CCD1", "#5A96DC", "#FFB469", "#FF8E69"]

  //
  var OTHER_NAME = "Other";

  this.init = function(sector_id, metric_id) {
		var params = controller.get_params();
		sector_id = params.vis;
		metric_id = params.metric;
		var xml_data;
		
		vis.backend.get_categories(function() {
			vis.backend.get_XML_by_sector_and_metric(sector_id, metric_id,	function() {
				vis.init_UI();
			});
		});

    sector_name = vis.backend.get_sector_name_by_id(sector_id);
    $sector_title.text("Sector: " + sector_name);

  }

  this.init_UI = function() {

    //initialize back button TODO put this somewhere else
    $('#backButton').button({ icons: { primary: "ui-icon-carat-1-w" } });
    this.populate_metric_picker();
		xml_data = vis.backend.sector_XML;
		this.create_viz(xml_data);
  }

  this.populate_metric_picker = function(){
    var $metric_select = $('#metricSelect');
    var metrics = this.backend.get_metric_list();
		var params = controller.get_params();
		
		$metric_select.children('option').remove();

    $.each(metrics, function(id, metric) {
      //"2":{ id:"2", name:"Water", path:"water" },
      $metric_select.append('<option value="'+id+'">'+metric.name+'</option>')
    });

		$metric_select[0].selectedIndex = params.metric - 1;


    $metric_select.change( function(event) {
			window.location.hash = 'vis=' + params.vis + '&metric=' + $(this).attr('value');
    });

  }

  this.create_viz = function(xml_data) {
	  var data = $(xml_data);
    var outer = data.children().first().children().first();
		
		frequency_hash = [];

    main = this.create_children(outer, 1);

		vis.create_top_categories(frequency_hash);


    $('#viz').remove();
    $('#vizcontainer').append('<div id="viz"></div>');
    $('#viz').append('<div class="block_wrapper" style=""></div>')


    /* side tool tips */

    //TODO syntax change

    this.tooltip.new_tip( $('#top_categories'),
        "These industries represent the top 5 overall emission sources within the sector. Hover over them to see where they appear in the path analysis");
    this.tooltip.new_tip( $('#vizcontainer'),
        "Each \"depth\" on the tree chart represents the component make-up of emission sources. Click on a component to see it's subsequent components in the next depth." );

    this.render( main );
  }


  /* 

	Creates the top categories bar in the visualization given a hash of categories and their respective values
  
	*/

	this.create_top_categories = function(hash) {
		//Sort the frequency hash for the top-category display
    hash.sort( function(a,b) {
      return b.value - a.value;
    });


   //Clear out the undefined entries
    hash = hash.filter(function(){ return true });

    hash_total = 0;
    $.each(hash, function(index, value) {
      if(typeof value != 'undefined')
        hash_total += value.value;
    });

    $('#top_categories').html('');

    for(i = 0; i < TOP_CATEGORIES; i++){
      width = parseFloat(hash[i].value / hash_total) * 100;
      name = this.backend.get_sector_name_by_id(hash[i].number);
      cat = $('#top_categories').append('<div class="top_category top_' + i + '" rank="' + i + '" section="' + hash[i].number + '" style="width:' + Math.round(width) + '%;"><div class="pct">' + Math.round(width) + '%' + '</div><div class="name">'+ name +'</div></div>')
    }

    $('.top_category').mouseover(function() {
      id = parseInt($(this).attr('section'));
      rank = parseInt($(this).attr('rank'));
      $('.section_' + id).addClass('top_' + rank);
    });

    $('.top_category').mouseout(function() {
      id = parseInt($(this).attr('section'));
      rank = parseInt($(this).attr('rank'));
      $('.block.top_' + rank).removeClass('top_' + rank);
    });
	}

	/* 
	
		Renders the children of a chosen node
		
	*/


   this.render = function( node ) {

    //Get rid of all nodes below the one recently clicked
    for(i = node.depth+1; i <= LEVELS; i++) {
      $('.depth_' + i).fadeOut(function(){
        $(this).remove();
      });
    }

    wrapper = $('<div class="depth_wrapper clearfix depth_' + node.depth + '" style="display:none;"></div>')
    $('.block_wrapper').append(wrapper);

    //Add the parent to the depth_wrapper
    var parent_name = (node.width() > (8 * node.name.length)) ? node.name : node.acronym;
    var parent = $('<div class="' + node.getClass(true) + '" title="' + node.getTitle() + '" style="width:' + node.width() + 'px;"><span class="name">' + parent_name + '</span></div>');
    wrapper.append(parent);
    //parent.tipsy();

    //Add the children to the depth_wrappers
    $.each(node.children, function(index, child) {

      //console.log( node.childWidth(child) );
      var width = node.childWidth(child) -1; 
      if(width < 0) return;

      var name = (width > (8 * child.name.length)) ? child.name : child.acronym;
      //if(name == child.acronym) {
      var title = child.getTitle();
      //}
      //alert('width: ' + width + ', length: ' + (8*child.name.length));
      var new_div = $('<div class="' + child.getClass() +'" title="' + title + '" style="width:' + width + 'px"></div>');
      //new_div.tipsy({live: true});
      new_div.append('<span class=\"name\">' + name + '</span><br /><span class=\"value\">' + child.prettyValue() + '</span><br /><span class="percent">' + decimalToPercent(node.childPercentage(child)) + '%</span>')
      
      $(wrapper).append(new_div);
      if(child.children.length != 0) {
        new_div.click(function() {
            if($(this).hasClass('selected')){
              $(this).parent().children().animate({opacity:1});
              $(this).removeClass('selected');
              for(i = child.depth; i <= LEVELS; i++) {
                $('.depth_wrapper.depth_'+(i)).fadeOut(function(){
                  $(this).remove();
                });
              }
            } else {
              for(i = child.depth; i <= LEVELS; i++) {
                $('.depth_wrapper.depth_'+(i)).remove();
              }
              $('.selected').filter('.depth_' + child.depth).removeClass('selected');
              $(this).addClass('selected');
              $(this).animate({opacity: 1});
              $(this).parent().children().not('.selected, .parent').animate({opacity: .35});
              vis.render(child);
            }
        });
      }
    });

    wrapper.slideDown();
  }


  this.create_children = function( node, node_depth ) {

    var vis = this;

    node = $(node);

    var name = node.attr('name');

    if(this.backend.get_sector_by_id(parseInt(name))) {
      name = this.backend.get_sector_name_by_id(name);
    }

    //Use hash to calculate top five sectors
    var id = parseInt(node.attr('name'));
    if( node.children().length == 0) {
      if(typeof frequency_hash[id] !== 'undefined') {
        frequency_hash[id].value += parseFloat(node.attr('value'));		
      }else{
        frequency_hash[id] = {
          number: id,
          value: parseFloat(node.attr('value'))
        };
      }
    }

    var d = new Depth(id, name, parseFloat(node.attr('value')), parseFloat(node.attr('descendants')), node_depth, this );

    //calculate the 'other' category
    var total = d.desc - d.value;
    var sum = 0;

    $.each(node.children(), function(index, child) {
      c = vis.create_children(child, node_depth+1)
      sum += c.desc;
      d.addChild(c);				
    });

    if(sum < (d.desc-d.value) && d.children.length > 0) {
      d.addChild(new Depth(0, OTHER_NAME, parseFloat((d.desc-d.value) - sum), parseFloat((d.desc-d.value) - sum), node_depth+1, this));
    }

    //Order from largest to smallest
    d.children.sort(function(a, b) {
      if(a.name == OTHER_NAME) return 1;
      if(b.name == OTHER_NAME) return -1;
      return b.desc - a.desc
    });

    //if(d.desc < RELEVANCE_THRESHOLD || d.value < RELEVANCE_THRESHOLD) return null;

    return d;
  }


}
function trim(str) {
    return str.replace(/^\s+|\s+$/g,"");
}

function truncate(string, digits) {
  return (string).toString().slice(0, digits+1);
}

function decimalToPercent(decimal) {
  return truncate((decimal * 100).toString(), 3);
}

function Depth(id, name, value, desc, depth, vis_obj) {
  this.name = name; //getSectorNameByID(parseInt(name));
  this.acronym = acronym(name);
  this.id = id;
  this.value = value;
  this.desc = desc;
  this.children = new Array();
  this.parent = null;
  this.depth = depth;
  this.vis_obj = vis_obj;

  this.addChild = function(child) {
    if(child != null) {
      this.children.push(child);
      child.setParent(this);
    }
  }

  this.setParent = function(parent) {
    this.parent = parent;
  }

  this.addDiv = function(div) {
    this.div = div;
  }

  //returns the percentage of the parent that the child makes up
  this.childPercentage = function(child) {
    var total = this.desc;
    width = parseFloat(child.desc / total)
    return width;
  }
  
  //returns the width of the child based on the percentage of total output
  this.childWidth = function(child) {
    return this.childPercentage(child) * (this.vis_obj.DISPLAY_WIDTH - 40*(this.depth - 1));
  }
  
  //returns the width of the parent based on the percentage of total output
  this.width = function(child) {
    return this.percentage() * (this.vis_obj.DISPLAY_WIDTH - 40 * (this.depth - 1));
  }
  
  //returns the percentage of the actual node's value is contained by that node's industry
  this.percentage = function(child) {
    return parseFloat(this.value / this.desc);
  }
  
  this.getClass = function(parent) {
    //parent boolean is for when we're getting the main div for the parent -- a.k.a. the white divs on left
    klass = "block depth_" + this.depth + " section_" + this.id;

    if(parent == true) {
      klass += ' parent';
    }else {
      if (this.children.length > 0) klass += ' children';
    }
    
    return klass;
  }

  this.getTitle = function() {
    if(this.parent != null) {
      return this.name + ' (' + this.prettyValue() + ', ' + decimalToPercent(this.parent.childPercentage(this)) + '%)';
    }else {
      return this.name + ' (' + truncate(this.value, 3) + ', ' + decimalToPercent(this.percentage()) + '%)';
    }
  }

  this.prettyValue = function() {
    var str = truncate(this.desc.toString(), 3);
    if(str[3] == '.') {
      return truncate(str, 2);
    }
    return str;
  }

  function acronym(str) {
    a = "";

    $.each( str.split(' '), function(index, word) {
      if(word.toUpperCase() == "AND") {
        a += "&";
      }else {
        if(word != '')
          a += word[0].toUpperCase();			
      }
    });
    return a;
  }


}

