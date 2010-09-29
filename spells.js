// toggler.value() returns true then false then true then false...
var toggler = (function() {
				var flag = true;
				return {
								value: function() {
									(flag==true) ? flag = false : flag = true;
									return flag;
											 }
				}
})();

function alertUser(alertText){
				$("#alerts").empty();
				$("#alerts").append(alertText);
				$("#alerts").stop(true, true).fadeIn(500, function(){$("#alerts").fadeOut(3000)});
				
}

function spitLine(contents) {
    $(".gameout").append(
      "<li>" +
      contents +
      "</li>");
    $(".gameout li:first").remove();
    if(toggler.value()) {$(".gameout li:last").addClass("alt")};
    };

function wipeScreen(printMe){
				for(i = 0; i < 10; i++){spitLine("&nbsp");}
				(!printMe) ? spitLine("&nbsp") : spitLine(printMe);
};

function takeTurn(inVal) {
  $("input").removeAttr("value");
	inVal = inVal.replace(" ","&nbsp;");
  if(inVal[0] == "/")
	{
					if(inVal=="/clear"){
									wipeScreen();
					};
					if(inVal=="/connect"){
									alert("Connecting!");
					}
					alertUser(inVal);
	}
	else if(inVal !="") {
			spitLine(inVal);
		} 
	$("input").select();
};

$(document).ready(function() {
	wipeScreen("Welcome to app!");

	$("button").click(
		function () {
			takeTurn($("input").attr("value"));
		}); 

	$("input").click( function() { $(this).select(); });
	$("input").select();
	$("input").keypress(function(e) {
		if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
			$("button").click();
		}
	});
});
