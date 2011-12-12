// JavaScript Document

function Visualization( backend_obj ) {
  this.backend = backend_obj;
  var xml_data = null;

  //Various display variables and depth variables
  var DISPLAY_WIDTH = $('#vizcontainer').width();
  var BLOCK_HEIGHT = 42;
  var LEVELS = 5;
  var RELEVANCE_THRESHOLD = .1;

  //Data for the top categories bar
  var TOP_CATEGORIES = 5;
  var frequency_hash = [];
  var TOP_COLORS = ["#FF6969","#36CCD1", "#5A96DC", "#FFB469", "#FF8E69"]

  //
  var OTHER_NAME = "Other";

  var metric_id = 1;

  this.init = function() {
    var vis = this
    vis.backend.get_categories( function() {
      //TODO insert the proper metric ID
      vis.backend.get_XML_by_sector( metric_id , function() {
        xml_data = vis.backend.sector_XML;
        vis.init_UI();
      });
    });

  }

  this.init_UI = function() {
    $('#backButton').button({ icons: { primary: "ui-icon-carat-1-w" } });
    populate_metric_picker();
    init_viz();
  }

  function populate_metric_picker(){
    var $metric_select = $('#metricSelect');
    var metrics = vis.backend.get_metric_list();

    $.each(metrics, function(id, metric) {
      //"2":{ id:"2", name:"Water", path:"water" },
      $metric_select.append('<option value="'+id+'">'+metric.name+'</option>')

    });

    $metric_select.change( function(event) {
      window.location = '#metric='+$(this).attr('value');
      init_viz();
    });

  }


  function init_viz(){
    //sample xml code
    data = $(xml_data);
    //console.log(xml_data)

    var outer = data.children().first().children().first();
    main = createChildren(outer, 1);

    //Sort the frequency hash for the top-category display
    frequency_hash.sort(function(a,b) {
      return b.value - a.value;
    });


   //Clear out the undefined entries
    frequency_hash = frequency_hash.filter(function(){ return true });

    hash_total = 0;
    $.each(frequency_hash, function(index, value) {
      if(typeof value != 'undefined')
        hash_total += value.value;
    });

    $('#top_categories').html('');

    for(i = 0; i < TOP_CATEGORIES; i++){
      width = parseFloat(frequency_hash[i].value / hash_total) * 100;
      name = vis.backend.get_sector_name_by_id(frequency_hash[i].number);
      cat = $('#top_categories').append('<div class="top_category top_' + i + '" rank="' + i + '" section="' + frequency_hash[i].number + '" style="width:' + Math.round(width) + '%;"><div class="pct">' + Math.round(width) + '%' + '</div><div class="name">'+ name +'</div></div>')
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

    $('#viz').remove();
    $('#vizcontainer').append('<div id="viz"></div>');
    $('#viz').append('<div class="block_wrapper" style="height:600px;"></div>')


    /* side tool tips */
    var tt = new ToolTip( $(document) );

    //TODO syntax change

    tt.new_tip( $('#top_categories'),
        "These industries represent the top 5 overall emission sources within the sector. Hover over them to see where they appear in the path analysis");
    tt.new_tip( $('#vizcontainer'),
        "Each \"depth\" on the tree chart represents the component make-up of emission sources. Click on a component to see it's subsequent components in the next depth." );

    render( main );
  }


  function render( node ) {
    
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
      var width = node.childWidth(child) -1; 
      if(width < 0) return;
      
      var name = (width > (8 * child.name.length)) ? child.name : child.acronym;
      //if(name == child.acronym) {
      var title = child.getTitle();
      //}
      //alert('width: ' + width + ', length: ' + (8*child.name.length));
      var new_div = $('<div class="' + child.getClass() +'" title="' + title + '" style="width:' + width + 'px"></div>');
      //new_div.tipsy({live: true});
      new_div.append('<span class=\"name\">' + name + '</span><br /><span class=\"value\">' + child.prettyValue() + '</span><br /><span class="percent">' + decimalToPercent(node.childPercentage(child)) + '%</sapn>')
      
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
              render(child);
              
            }
        });
      }
    });

    wrapper.slideDown();
  }


  function createChildren( node, node_depth ) {
    node = $(node);

    var name = node.attr('name');

    if(vis.backend.get_sector_by_id(parseInt(name))) {
      name = vis.backend.get_sector_name_by_id(name);
    }

    //Use hash to calculate top five sectors
    var id = parseInt(node.attr('name'));
    if( node.children().length == 0) {
      if(typeof frequency_hash[id] !== 'undefined') {
        frequency_hash[id].value += parseFloat(node.attr('value'));		
        //console.log(frequency_hash.length);
      }else{
    //		console.log(parseFloat(node.attr('value')));		
        frequency_hash[id] = {
          number: id,
          value: parseFloat(node.attr('value'))
        };
      }
    }

    var d = new Depth(id, name, parseFloat(node.attr('value')), parseFloat(node.attr('descendants')), node_depth );

    //calculate the 'other' category
    var total = d.desc - d.value;
    var sum = 0;

    $.each(node.children(), function(index, child) {
      c = createChildren(child, node_depth+1)
      sum += c.desc;
      d.addChild(c);				
    });

    if(sum < (d.desc-d.value) && d.children.length > 0) {
      d.addChild(new Depth(0, OTHER_NAME, parseFloat((d.desc-d.value) - sum), parseFloat((d.desc-d.value) - sum), node_depth+1));
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


  function Depth(id, name, value, desc, depth) {
    this.name = name; //getSectorNameByID(parseInt(name));
    this.acronym = acronym(name);
    this.id = id;
    this.value = value;
    this.desc = desc;
    this.children = new Array();
    this.parent = null;
    this.depth = depth;

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
      return this.childPercentage(child) * (DISPLAY_WIDTH - 40*(this.depth - 1));
    }
    
    //returns the width of the parent based on the percentage of total output
    this.width = function(child) {
      return this.percentage() * (DISPLAY_WIDTH - 40 * (this.depth - 1));
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

  }

  function acronym(str) {
    a = "";
    $.each(str.split(' '), function(index, word) {
      if(word.toUpperCase() == "AND") {
        a += "&";
      }else {
        if(word != '')
          a += word[0].toUpperCase();			
      }
    });
    return a;
  }

  function truncate(string, digits) {
    return (string).toString().slice(0, digits+1);
  }

  function decimalToPercent(decimal) {
    return truncate((decimal * 100).toString(), 3);
  }
}
function trim(str) {
    return str.replace(/^\s+|\s+$/g,"");
}
