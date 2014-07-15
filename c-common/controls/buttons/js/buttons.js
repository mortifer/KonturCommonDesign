$(function () {

    $(".c-button").each(function () { // Для оперы престо надо и для ie
        var $button = $(this);
        //var $button_content = $button.find(".c-button_content");

        $button.bind("mousedown", function (event) {
            if ($(this).hasClass("-disabled")) return;
            if (event.which == 1) {
                $(this).addClass("-active");
            }
        });

        $button.bind("mouseup mouseleave", function () {
            if ($(this).hasClass("-disabled")) return;
            $(this).removeClass("-active");
        });

    });

});