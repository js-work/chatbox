function takeTurn() {
	if($("input").attr("value") != "") {
		$(".gameout li:first").remove();
		$(".gameout").append(
		   "<li>" +
		   $("input").attr("value") +
		   "</li>");
		 $("input").removeAttr("value");
		} 
		
};

$(document).ready(function() {
	$("#inputs").append(
		"<input value=\"What next?\" size=55/><button>Do it!</button>");
	$("button").click(
		function () {takeTurn();}); 
	$("input").click( function() { $(this).select(); });
	$("input").select();
});
