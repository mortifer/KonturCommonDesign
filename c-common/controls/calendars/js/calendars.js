/* calendars*/
$(function () {
    
    $("[calendar-id]").each(function () {
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
                $(window).trigger("c-calendar.closed", ["c-calendar.closed.select"]);
            } else {
                $(window).trigger("c-calendar.opened", [$(this).attr("calendar-id")]);
            }
            return false;
        });
    });
    
});

var monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

$(window).bind("c-calendar.change", function (event, data, value) {

    function getMonthIndex(month) {
        for (var i = 0; i < monthes.length; i++) {
            if (monthes[i] == month)
                return i;
        }
        return -1;
    }

    var $item = $("[calendar-id='" + data + "']");

    if (value == "prev" || value == "next") {

        var monthIndex = getMonthIndex($item.children().text().split(" ")[0]);
        var year = parseInt($item.children().text().split(" ")[1]);

        if (value == "prev") {
            if (monthIndex == 0) {
                monthIndex = 11;
                year--;
            } else {
                monthIndex--;
            }
        } else {
            if (monthIndex == 11) {
                monthIndex = 0;
                year++;
            } else {
                monthIndex++;
            }
        }

        value = monthes[monthIndex] + " " + year;
    }

    $item.removeClass("-hover -active").children().html(value);

});

$(window).bind("c-calendar.closed", function (event, reason, data, value) {
    var selector = "";
    if (reason == undefined) {
        selector = ":not(.-hover)";
    }

    if (reason == "c-calendar.closed.select") {
        $(window).trigger("c-calendar.change", [data, value]);
    }

    //$(".-opened"+selector).removeClass("-opened");
    $(".c-calendar_content__opened" + selector)
        .removeClass()
        .addClass("c-calendar_content")
        .removeAttr("style")
        .unbind();
    
    if (data != undefined) {
        $(document).unbind("click.c-calendar");
        $(window).unbind("resize.c-calendar");
    }
});

$(window).bind("c-calendar.opened", function (event, data) {

    function generateContent(date) {
        var monthSelected = date.split(" ")[0];
        var yearSelected = parseInt(date.split(" ")[1]);

        $dropdownContent.html();

        var template = "<div class=\"c-calendar_lists\">\n";
        for (var year = yearSelected - 1; year <= yearSelected + 1; year++) {
            template += "<div class=\"c-calendar_list_title\">" + year + "</div>\n";
            template += "<div class=\"c-calendar_list\">\n";
            for (var month = 0; month < monthes.length; month++) {
                template += "<a href=\"#\" class=\"c-calendar_list_item c-link " + (monthes[month] == monthSelected && year == yearSelected ? "-checked" : "") + "\" >" + monthes[month] + " <span>" + year + "</span></a>\n";
            };
            template += "</div>\n";
            template += "<div class=\"c-calendar_hr\"></div>\n";
        };
        template += "</div>\n";
        $dropdownContent.html(template);
    };

    $(window).trigger("popups.close");

    var $dropdownCaller = $("[calendar-id='" + data + "']");
    var $dropdownContent = $(".c-calendar_content").attr("for-calendar-id", data);

    $(window).trigger("c-calendar.closed");

    generateContent($dropdownCaller.children().text());

    //$dropdownCaller.addClass("-opened");

    var subPixelFix = 0;
    var ie8PixelFix = $("html").hasClass("ie-lt9") ? 1 : 0;
    var buttonFix = 0;

    $("html").addClass("html__dropdownOpening");

    var callerWidth = $dropdownCaller.outerWidth();
    var callerOffset = $dropdownCaller.offset();

    $dropdownContent.addClass("c-calendar_content__opened");
    var contentWidth = $dropdownContent.outerWidth();
    var contentPaddings = contentWidth - $dropdownContent.width();

    $dropdownContent.css({
        top: callerOffset.top + ($dropdownCaller.outerHeight() - $dropdownContent.outerHeight()) / 2 - 2,
        left: callerOffset.left + buttonFix,
        width: (callerWidth > contentWidth ? callerWidth : contentWidth) - contentPaddings + subPixelFix - ie8PixelFix
    });
    var $itemSelected = $dropdownContent.find(".-checked");
    $dropdownContent.children().css("top", -$itemSelected.position().top + $dropdownContent.outerHeight() / 2 - $itemSelected.outerHeight() / 2 + 1);

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
        $(window).trigger("c-calendar.closed", ["c-calendar.closed.select", $(this).parents(".c-calendar_content").attr("for-calendar-id"), $(this).text()]);
        if ($(this).hasClass("-checked")) return false;
        return false; // костыль для отсутвующей обработки данных
    });

    $(document).bind("click.c-calendar", function () { // IE8 does not support click event on window object
        $(window).trigger("c-calendar.closed");
    });

    $(window).bind("resize.c-calendar lightbox__opened", function () {
        if (!$("html").hasClass("html__dropdownOpening")) { // IE8 resize event break flow
            $(window).trigger("c-calendar.closed", ["c-calendar.closed.force"]);
        }
    });
});