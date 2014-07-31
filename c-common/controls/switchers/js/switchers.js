$(function () {

    $(".c-switcher").each(function () {
        $(this).find(".c-button").first().bind("click", function () {
            $(window).trigger("c-calendar.change", [$(this).parent().attr("switcher-for-id"), "prev"]);
        });
        $(this).find(".c-button").last().bind("click", function () {
            $(window).trigger("c-calendar.change", [$(this).parent().attr("switcher-for-id"), "next"]);
        });
    });

});