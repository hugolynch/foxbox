$(function() {
    $("#menu-button").click(function() {
		if ($("#menu").css("margin-left") == "-340px") {
			$("#menu").css("margin-left", "0");
		} else {
			$("#menu").css("margin-left", "-340px");
		}
	});
});