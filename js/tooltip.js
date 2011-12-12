function ToolTip ( document ) {

  this.leftOffset = -30;
  this.topOffset = 10;
  this.fadeDuration = 150;
  this.hintsHidden = false;

  this.$jq = $('<div class="help_tip"><div class="help_tip_arrow"></div><div class="help_tip_text"></div><div class="help_tip_hide">hide tips</div></div>');

  this.$jq
    .find('.help_tip_hide')
    .click( {obj: this}, function(event) {
      var tt = event.data.obj;
      tt.hideTips();
    });

  this.$doc = document;

  /**
   * position tool tip to right of the given
   * jquery object
   */
  this.positionTipRightOf = function(target) {
    if ( !this.hintsHidden ) {
      this.$jq.hide();

      this.$jq = this.$jq.appendTo(target);
      var pos = target.offset();
      var left = pos.left + target.outerWidth() + this.leftOffset;
      var top = pos.top + this.topOffset;
      this.position(left,top);

      this.$jq.fadeIn( this.fadeDuration );
    }

  }

  this.newTip = function(div,text) {
    var toolTip = this;
    div.hover(function () {
      toolTip.positionTipRightOf(div);
      toolTip.setText(text);
    }, function() {
      toolTip.fadeOut();
    });
  }

  this.hideTips = function() {
    this.$jq.hide();
    this.hintsHidden = true;
  }

  this.position = function(left,top) {
    this.$jq.css({ "left": left+"px", "top": top+"px" });
  }

  this.fadeOut = function() {
    this.$jq.fadeOut( this.fadeDuration );
  }

  this.setText = function(text) {
    this.$jq.find('.help_tip_text').text(text);
  }

}
