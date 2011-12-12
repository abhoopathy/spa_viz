// JavaScript Document
var sectorList = null; 

function initBackend(cb) {
	
	
	
	console.log("backend initiated");
	
	//http://www.eiolca.net/abhoopat/componentviz/staging/xml/sample.xml
	var sectorNumToGet = 1;
	
	$.ajax({
		url: 'http://localhost:8888/eiolca/staging/xml/sample.xml',
		type: 'GET',
		dataType: 'text',
		timeout: 1000,
		error: function(){
			alert('Error loading XML document');
		},
		success: function(xml){
			xmlData = xml;
			cb();
		}
	});
			
}