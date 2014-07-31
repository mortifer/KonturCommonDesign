/* calendars*/
$(function () {

    $(".c-field[calendar-id]").each(function () {
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
                $(window).trigger("c-calendarD.closed", ["c-calendarD.closed.force"]);
            } else {
                $(window).trigger("popups.close");
                $(".-opened").removeClass(".-opened");
                $(this).addClass("-opened");
                $(window).trigger("c-calendarD.opened", [$(this).attr("calendar-id")]);
            }
            return false;
        });
    });

});

var monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

$(window).bind("c-calendarD.change", function (event, data, value) {

    var $item = $("[calendar-id='" + data + "']");

    $item.removeClass("-hover -active").children().html(value);

});

$(window).bind("c-calendarD.closed", function (event, reason, data, value) {
    var selector = "";
    if (reason == undefined) {
        selector = ":not(.-hover)";
    }

    if (reason == "c-calendarD.closed.select") {
        $(window).trigger("c-calendarD.change", [data, value]);
    }

    $(".-opened" + selector).removeClass("-opened");
    $(".c-calendar_days__opened" + selector)
        .removeClass()
        .addClass("c-calendar_days")
        .removeAttr("style")
        .removeAttr("for-calendar-id")
        .unbind();

    if ($(".c-calendar_days.-hover").length == 0) {
        $(document).unbind("click.c-calendarD");
        $(window).unbind("resize.c-calendarD");
    }
});

$(window).bind("c-calendarD.opened", function (event, data) {

    function generateContent(date) {

    };

    //$(window).trigger("popups.close");

    var $dropdownCaller = $("[calendar-id='" + data + "']");
    var $dropdownContent;

    if ($dropdownCaller.length > 1) $dropdownCaller[0];

    $dropdownContent = $(".c-calendar_days").attr("for-calendar-id", data);

    generateContent($dropdownCaller.children().text());

    var subPixelFix = 0;
    var ie8PixelFix = $("html").hasClass("ie-lt9") ? 1 : 0;
    var buttonFix = 0;

    $("html").addClass("html__dropdownOpening");

    var callerWidth = $dropdownCaller.outerWidth();
    var callerOffset = $dropdownCaller.offset();

    $dropdownContent.addClass("c-calendar_days__opened");
    var contentWidth = $dropdownContent.outerWidth();
    var contentPaddings = contentWidth - $dropdownContent.width();

    $dropdownContent.css({
        top: callerOffset.top + $dropdownCaller.outerHeight() - 2 - 1,
        left: callerOffset.left + buttonFix + 1//,
        //width: (callerWidth > contentWidth ? callerWidth : contentWidth) - contentPaddings + subPixelFix - ie8PixelFix
    });

    //var forceChangeAlignment = $dropdownContent[0].getBoundingClientRect().right > ($(window).width() - 10);

    //if (contentWidth > callerWidth || forceChangeAlignment) {
    //    if ($dropdownCaller.attr("dropdown-align") == "right" || forceChangeAlignment) {
    //        $dropdownContent.addClass("c-dropdown_content__right");
    //        $dropdownContent.css({
    //            left: callerOffset.left + callerWidth - contentWidth + subPixelFix + buttonFix
    //        });
    //    } else {
    //        $dropdownCaller.addClass("c-dropdown_content__left");
    //    }
    //};

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
        $(window).trigger("c-calendarD.closed", ["c-calendarD.closed.select", $(".c-calendar_days__opened").attr("for-calendar-id"), $(this).text()]);
        if ($(this).hasClass("-checked")) return false;
        return false; // костыль для отсутвующей обработки данных
    });

    $(document).bind("click.c-calendarD", function () { // IE8 does not support click event on window object
        $(window).trigger("c-calendarD.closed");
    });

    $(window).bind("resize.c-calendarD lightbox__opened", function () {
        if (!$("html").hasClass("html__dropdownOpening")) { // IE8 resize event break flow
            $(window).trigger("c-calendarD.closed", ["c-calendarD.closed.force"]);
        }
    });
});