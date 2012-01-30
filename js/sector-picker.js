//JavaScript Document

function Controller( ) {
  var backend = new Backend();
  var tooltip = new ToolTip();
  var controller = this;
  var sector_picker = new SectorPicker( backend,tooltip );
  var visualization = new Visualization( backend,tooltip );

  $(window).hashchange( function(){
    var params = controller.get_params();
		
    if ("select" in params) {
      controller.show_selector_page();
      return;
    }

    if ("vis" in params) {
      controller.show_sector_page( params["vis"], params["metric"] );
      return;
    }

  });

  /* initialize*/
  backend.get_categories( function(){ sector_picker.init_UI() } );	

  this.show_selector_page = function(){
    sector_picker.show();
    visualization.hide();
  }

  this.show_sector_page = function( sec_id, met_id ){
    sector_picker.hide();
    visualization.show();
    visualization.init(sec_id, met_id);
  }

  this.set_win_location = function(string) {
    window.location = "#"+string;
  }

  this.get_params = function() {
    var parameters = {};
    var a = window.location.hash;
    var b = a.replace(/#/,'').split(/&/);

    $.each( b, function(i,param_string) {
      var arr = param_string.split(/=/);
      parameters[ arr[0] ] = arr[1];
    });

    return parameters;
  }

}


function SectorPicker( backend_obj, tooltip ) {

  this.$browse_by_cat_dialog = null;
  this.$browse_by_cat_buton = null;
  this.backend = backend_obj;
  this.tooltip = tooltip;
  var $selector_page = $('#selector_page');

  this.hide = function() { $selector_page.hide(); }
  this.show = function() { $selector_page.show(); }

  this.init_UI_buttons = function() {

    /*
    $sector_selector_page = $('#selectASector');
    $viz_container = $('#vizcontainer');
    $container = $('#container');
    */
  }

  this.init_UI = function (){

    //this.populate_metric_picker();
    this.init_UI_buttons();
    this.populate_sector_picker();
    this.populate_category_dialog();
    this.init_tool_tips();

    $("input[type=text]").focus(function() { $(this).val('') } );	

    $('.hoverable').hover(function(){
      var height = $(this).height();
      $(this).css({'background-position':'0 -'+height+'px'});
    }, function() {
      $(this).css({'background-position':'0 0'});
    });
  }

  /*
  this.populate_metric_picker = function() {
    var $metric_select = $('#metricSelect');
    var metrics = this.backend.get_metric_list();

    $.each(metrics, function(id, metric) {
      //"2":{ id:"2", name:"Water", path:"water" },
      $metric_select.append('<option value="'+id+'">'+metric.name+'</option>')

    });
  }
  */

  this.init_tool_tips = function() {
    /* Tool Tip Stuff, see tooltip.js */

    //TODO change this help text
    tooltip.new_tip( $('#chooseMetric'), "Begin typing a sector name to visualize it's SPA visualization" );
    tooltip.new_tip( $('#searchBySector'), "Begin typing a sector name to visualize it's SPA visualization" );
    tooltip.new_tip( $('#browseByCategory'), "Browse the sectors by expanding the industry categories." );
  }

  this.submit_sector = function(sector_id) {
    //add code to hide selector and show vizcontainer
    //window.location = "sector.php?sec_id="+sectorID+"&name="+backend.getSectorNameByID(sectorID)+"&metric="+$('#metricSelect').attr('value')
    window.location = "#vis="+sector_id
  }

  this.populate_category_dialog = function() {

    var num_cats = 0;
    var category_list = this.backend.get_category_list();

    $.each(category_list,function(){
      num_cats ++;
    });

    first_cutoff = num_cats/3 + 1;
    second_cutoff = 2*num_cats/3 + 1;

    var i = 1;

    $.each(category_list,function(){

      //create cat_div
      var $cat_div = $('<div class=\"catDiv hoverable\" catNum=\"'+this.cat_id+'\"><\/div>');
      $cat_div.append('<div class="plusMinus"><div class="hoverable plusIcon"></div><\div>');

      var $cat_label = $('<h3>'+this.cat_label+'<\/h3><div class="cleardiv"></div>');
      $cat_div.append($cat_label);

      //subcontainer of sectors under each category
      var $cat_sub_sectors = $('<ul class=\"catSubSectors\"><\/ul>');

      var cat_members = this.members;
      $.each(cat_members, function(id, sector) {
        //var url = "sector.php?sec_id="+sector.sec_id+"&name="+sector.sec_label+"&metric="+$('#metricSelect').attr('value');
        var url = "#vis="+sector.sec_id
        var $sector_link = $('<li><a class="hoverable" href="'+url+'">'+sector.sec_label+'<\/a><\/li>');

        $cat_sub_sectors.append($sector_link);
      });

      $cat_sub_sectors.hide();

      //which column should we put it in?
      if (i < first_cutoff) {
        $(".catTriColumn:eq(0)").append($cat_div);
      }
      else if (i < second_cutoff && i > first_cutoff) {
        $(".catTriColumn:eq(1)").append($cat_div);
      }
      else if (i > second_cutoff) {
        $(".catTriColumn:eq(2)").append($cat_div);
      }

      $('.catTriColumn').find('.catDiv').filter('[catNum="'+(i)+'"]').after($cat_sub_sectors);	

      var $icon = $cat_div.find('.hoverable');

      var label_width = $cat_div.width() - $icon.width() - 5;
      $cat_label.width(label_width);

      $cat_div.click(function() {		
        $cat_sub_sectors.slideToggle(50);

        if ($icon.hasClass('plusIcon'))
          $icon.removeClass('plusIcon').addClass('minusIcon');
        else
          $icon.removeClass('minusIcon').addClass('plusIcon');

      }).hover(function(){
        var height = $icon.height();
        $icon.css({'background-position':'0 -'+height+'px'});
      }, function() {
        $icon.css({'background-position':'0 0'});
      });;

      i++;
    });

  }

  this.populate_sector_picker = function() {
    var available_tags = new Array();
    //11":{"sec_id":"11","sec_label":"Milk Production","xml":"xml\newLoop$1MSector_11","cat_id":"1"}

    var obj = this;

    var sector_list = this.backend.get_sector_list();

    $.each(sector_list,function(key,sector) {
      if (sector != null) {	
        available_tags.push({
          label: sector.sec_label,
          value: key,
        });
      }
    });

    $( "#sectorAutocomplete" ).autocomplete({
      source: available_tags,
      minLength: 1,
      select: function(event, ui) {
        $(this).val(ui.item.label);
        obj.submit_sector(ui.item.value);
        $(this).blur();
        return false;
      },
      focus: function(event, ui) {
        return false;
      }
    });

  }
}
