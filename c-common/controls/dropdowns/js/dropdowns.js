$(function () {

    $("[dropdown-id]").each(function () {
        var $dropdown = $(this);

        $dropdown.bind("mouseenter", function () {
            $(this).addClass("-hover");
            $(this).find(".c-link").addClass("-hover");
        });

        $dropdown.bind("mouseleave", function () {
            $(this).removeClass("-hover");
            $(this).find(".c-link").removeClass("-hover");
        });

        $dropdown.bind("click", function () {
            if ($(this).hasClass("-opened")) {
                $(window).trigger("c-dropdown.closed", ["c-dropdown.closed.select"]);
            } else {
                $(window).trigger("c-dropdown.closed", ["c-dropdown.closed.select"]);
                $(".-opened").removeClass(".-opened");
                $(this).addClass("-opened");
                $(window).trigger("c-dropdown.opened", [$(this).attr("dropdown-id")]);
            }
            return false;
        });
    });

});

$(window).bind("c-dropdown.closed", function (event, data) {
    var selector = "";
    if (data == undefined) {
        selector = ":not(.-hover)";
    }

    $(".-opened" + selector).removeClass("-opened");
    $(".c-dropdown_content__opened" + selector)
        .removeClass()
        .addClass("c-dropdown_content")
        .removeAttr("style")
        .unbind();
    if (data != undefined) {
        $(document).unbind("click.c-dropdown");
        $(window).unbind("resize.c-dropdown");
    }
});

$(window).bind("c-dropdown.opened", function (event, data) {

    $(window).trigger("popups.close");

    var $dropdownCaller = $(".-opened[dropdown-id='" + data + "']");
    var $dropdownContent = $("[for-dropdown-id='" + data + "']");

    if (!$("html").hasClass("html__helpOpened"))
        $(window).trigger("c-dropdown.closed");
    
    var subPixelFix = 0;//$("html").hasClass("ff") || $("html").hasClass("ie") ? 1 : 0;
    var ie8PixelFix = $("html").hasClass("ie-lt9") ? 1 : 0;
    var buttonFix = 0;//$(this).hasClass(".c-button") ? 1 : 0;

    $("html").addClass("html__dropdownOpening");

    var callerWidth = $dropdownCaller.outerWidth();
    var callerOffset = $dropdownCaller.offset();

    $dropdownContent.addClass("c-dropdown_content__opened");
    var contentWidth = $dropdownContent.outerWidth();
    var contentPaddings = contentWidth - $dropdownContent.width();

    $dropdownContent.css({
        top: callerOffset.top + $dropdownCaller.outerHeight() - 2,
        left: callerOffset.left + buttonFix,
        width: (callerWidth > contentWidth ? callerWidth : contentWidth) - contentPaddings + subPixelFix - ie8PixelFix
    });

    var forceChangeAlignment = $dropdownContent[0].getBoundingClientRect().right > ($(window).width() - 10);

    if (contentWidth > callerWidth || forceChangeAlignment) {
        if ($dropdownCaller.attr("dropdown-align") == "right" || forceChangeAlignment) {
            $dropdownContent.addClass("c-dropdown_content__right");
            $dropdownContent.css({
                left: callerOffset.left + callerWidth - contentWidth + subPixelFix + buttonFix
            });
        } else {
            $dropdownCaller.addClass("c-dropdown_content__left");
        }
    };

    setInterval(function () {
        $("html").removeClass("html__dropdownOpening");
    }, 0);

    $dropdownContent.bind("mouseenter", function () {
        $dropdownContent.addClass("-hover");
        $dropdownCaller.addClass("-hover");
    });

    $dropdownContent.bind("mouseleave", function () {
        $dropdownContent.removeClass("-hover");
        $dropdownCaller.removeClass("-hover");
    });

    $dropdownContent.find(".c-link").bind("click", function () {
        $(window).trigger("c-dropdown.closed", ["c-dropdown.closed.select"]);
        if ($(this).hasClass("-checked")) return false;
        return false; // костыль для отсутвующей обработки данных
    });

    $(document).bind("click.c-dropdown", function () { // IE8 does not support click event on window object
        $(window).trigger("c-dropdown.closed");
    });

    $(window).bind("resize.c-dropdown lightbox__opened", function () {
        if (!$("html").hasClass("html__dropdownOpening")) { // IE8 resize event break flow
            $(window).trigger("c-dropdown.closed", ["c-dropdown.closed.force"]);
        }
    });
});