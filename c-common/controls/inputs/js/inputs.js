$(function () {

    $(".c-checkbox input, .c-radio input").each(function () {
        var $input = $(this);
        var $label = $input.parent().find("label");

        $input.bind("mouseenter", function () {
            $(this).next().addClass("-hover");
        });

        $input.bind("mouseleave", function () {
            $(this).next().removeClass("-hover");
        });

        $input.bind("mousedown", function () {
            $(this).next().addClass("-active");
        });

        $input.bind("mouseup", function () {
            $(this).next().removeClass("-active");
        });
        
        

        $label.bind("mouseenter", function () {
            $(this).prev().addClass("-hover");
        });

        $label.bind("mouseleave", function () {
            $(this).prev().removeClass("-hover");
        });

        $label.bind("mousedown", function () {
            $(this).prev().addClass("-active");
        });

        $label.bind("mouseup", function () {
            $(this).prev().removeClass("-active");
        });

    });

});