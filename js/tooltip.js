/**
 * @author Aneesh Bhoopathy
 *         aneesh.bhoopathy@gmail.com
 */

/**
 * Creates an instance of ToolTip object
 *
 * @constructor
 * @this {Backend}
 * @param {document} document
 */
function ToolTip ( document ) {

  this.$doc = document;

  /* XY offsets of tool tip */
  this.left_offset = -30;
  this.top_offset = 10;
  this.fade_duration = 150;
  this.hints_hidden = false;

  /* jquery obj of tool tip */
  this.$jq = $('<div class="help_tip"><div class="help_tip_arrow"></div><div class="help_tip_text"></div><div class="help_tip_hide">hide tips</div></div>');

  /* when user clicks "HIDE TIPS", hide the tips */
  this.$jq
    .find('.help_tip_hide')
    .click( {obj: this}, function(event) {
      var tt = event.data.obj;
      tt.hideTips();
    });


  /**
   * Positions tool tip to right of the given
   * jQuery object.
   *
   * @param {jQ} target jQuery object that receives tooltip
   */
  this.position_to_right_of = function(target) {
    if ( !this.hints_hidden ) {
      this.$jq.hide();

      this.$jq = this.$jq.appendTo(target);
      var pos = target.offset();
      var left = pos.left + target.outerWidth() + this.left_offset;
      var top = pos.top + this.top_offset;
      this.position(left,top);

      this.fade_in();
    }

  }

  /**
   * descript
   *
   * @param {jQ} target
   * @param {String} text
   */
  this.new_tip = function(target,text) {
    var tool_tip = this;
    target.hover(function () {
      tool_tip.position_to_right_of(target);
      tool_tip.set_text(text);
    }, function() {
      tool_tip.fade_out();
    });
  }

  /* helper functions */
  this.hide_tips = function() {
    this.$jq.hide();
    this.hints_hidden = true;
  }

  this.position = function(left,top) {
    this.$jq.css({ "left": left+"px", "top": top+"px" });
  }

  this.fade_out = function() {
    this.$jq.fadeOut( this.fade_duration );
  }

  this.fade_in = function() {
    this.$jq.fadeIn( this.fade_duration );
  }

  this.set_text = function(text) {
    this.$jq.find('.help_tip_text').text(text);
  }

}
