
$(document).ready( function() {

  var obj = new anObject();
  p(obj.var1);
  obj.changeVar1("two")
  p(obj.var1);

});

function anObject() {
  this.var1 = "one";

  this.changeVar1 = function(s){
    var tempThis = this;
    $("#text").each( function() {
      tempThis.var1 = s;
      $(this).text(s);
    });
  }

}

/* logging function */
p = function(s) {
  console.log(s);
}
