$(function() {
    $("#menu-button").click(function() {
        console.log('menu');

		if ($("#menu").css("left") == "-340px") {
			$("#menu").css("left", "0");
		} else {
			$("#menu").css("left", "-340px");
		}
	});
});
