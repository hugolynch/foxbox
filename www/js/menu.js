$(function() {

    $("#menu-button").on('click', function() {

		if ($("#menu").css("left") == "-340px") {
			$("#menu").css("left", "0");
		} else {
			$("#menu").css("left", "-340px");
		}
	});
});
