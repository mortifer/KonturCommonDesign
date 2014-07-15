$(function () {

    $(".c-field").each(function () {
        var $field = $(this);
        var $field_content = $field.find(".c-field_content");

        $field_content.bind("focus focusin", function () {
            if ($(this).hasClass("-disabled")) return;
            $(this).parent().addClass("-focus");
            $(this).parent().find(".c-button").removeClass("-focus");
        });

        $field_content.bind("focusout", function () {
            if ($(this).hasClass("-disabled")) return;
            $(this).parent().removeClass("-focus");
        });

    });

});