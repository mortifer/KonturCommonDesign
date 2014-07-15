$(function () {

    $(".c-group .c-button").each(function () {
        var $button = $(this);
        $button.bind("click", function (event) {
            if ($(this).hasClass("-disabled")) return;
            if (event.which == 1) {
                $(this).parent().find(".c-button").removeClass("-checked -focus");
                $(this).addClass("-checked");
            }
        });
    });

});