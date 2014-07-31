/* calendars*/
$(function () {
    
    $(".c-button[calendar-id]").each(function () {
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
                $(window).trigger("c-calendar.closed", ["c-calendar.closed.force"]);
            } else {
                $(window).trigger("popups.close", $(this).parents(".c-calendar_days").length ? "c-calendarD.stayOpened" : undefined);
                $(".-opened").removeClass(".-opened");
                $(this).addClass("-opened");
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

    var type = 0;

    if ($item.hasClass("c-button__calendar__month")) {
        type += 1;
    }
    if ($item.hasClass("c-button__calendar__year")) {
        type += 2;
    }

    if (value == "prev" || value == "next") {

        switch (type) {
        case 3:
            {
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
                break;
            }
        }
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

    $(".-opened" + selector).removeClass("-opened");
    $(".c-calendar_content__opened" + selector)
        .removeClass()
        .addClass("c-calendar_content")
        .removeAttr("style")
        .removeAttr("for-calendar-id")
        .unbind();
    
    if ($(".c-calendar_content.-hover").length == 0) {
        $(document).unbind("click.c-calendar");
        $(window).unbind("resize.c-calendar");
    }
});

$(window).bind("c-calendar.opened", function (event, data) {

    function generateContent(date) {
        
        // type: 0 = days
        // type: 1 = month
        // type: 2 = year
        // type: 3 = month + year
        
        type !=0 ? $dropdownContent.html() : "";
        
        var monthSelected = "",
            yearSelected = "",
            template = "";
        
        switch (type) {
            case 0: {
                    break;
                }
            case 1: {
                    monthSelected = date;
                    template = "<div class=\"c-calendar_lists c-calendar_lists__month\">\n";
                        template += "<div class=\"c-calendar_list\">\n";
                        for (var month = 0; month < monthes.length; month++) {
                            template += "<a href=\"#\" class=\"c-calendar_list_item c-link " + (monthes[month] == monthSelected ? "-checked" : "") + "\" >" + monthes[month] + "</a>\n";
                        };
                        template += "</div>\n";
                        template += "</div>\n";
                        
                    break;
                }
            case 2: {
                    yearSelected = date;
                    template = "<div class=\"c-calendar_lists c-calendar_lists__year\">\n";
                        template += "<div class=\"c-calendar_list\">\n";
                        for (var year = parseInt(yearSelected) - 4; year <= parseInt(yearSelected) + 4; year++) {
                            template += "<a href=\"#\" class=\"c-calendar_list_item c-link " + (year == parseInt(yearSelected) ? "-checked" : "") + "\" >" + year + "</a>\n";
                        };
                        template += "</div>\n";
                    template += "</div>\n";

                    break;
                }
            case 3: {
                    monthSelected = date.split(" ")[0];
                    yearSelected = parseInt(date.split(" ")[1]);
                        
                    template = "<div class=\"c-calendar_lists c-calendar_lists__month c-calendar_lists__year\">\n";
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
                        
                    break;
                }
        }

        type != 0 ? $dropdownContent.html(template) : "";

    };

    //$(window).trigger("popups.close");

    var $dropdownCaller = $("[calendar-id='" + data + "']");
    var $dropdownContent;

    if ($dropdownCaller.length > 1) $dropdownCaller[0];
    
    var type = 0;

    if ($dropdownCaller.hasClass("c-button__calendar__month")) {
        type += 1;
    }
    if ($dropdownCaller.hasClass("c-button__calendar__year")) {
        type += 2;
    }

    $dropdownContent = $(".c-calendar_content").attr("for-calendar-id", data);

    //$(window).trigger("c-calendar.closed");

    generateContent($dropdownCaller.children().text());

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
        
    if (type == 1) { //monthes
        $dropdownContent.css("top", $dropdownContent.offset().top - $itemSelected.position().top + $dropdownContent.outerHeight() / 2 - $itemSelected.outerHeight() / 2 + 1);
    } else { // monthes, years, both
        $dropdownContent.children().css("top", -$itemSelected.position().top + $dropdownContent.outerHeight() / 2 - $itemSelected.outerHeight() / 2 + 1);
    }

    var dropdownContentDimensions = $dropdownContent[0].getBoundingClientRect();
    var delta = 0;
    
    if (dropdownContentDimensions.top < 0 || dropdownContentDimensions.bottom > $(window).height()) {

        dropdownContentDimensions.top < 0 ? (delta = -dropdownContentDimensions.top):0;
        dropdownContentDimensions.bottom > $(window).height() ? (delta = $(window).height() - dropdownContentDimensions.bottom) : 0;
        dropdownContentDimensions.top < 0 && dropdownContentDimensions.bottom > $(window).height() ? (delta = 0) : (delta = delta);
        
        $dropdownContent.css("top", $dropdownContent.offset().top + delta);
    }

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
        $(window).trigger("c-calendar.closed", ["c-calendar.closed.select", $(".c-calendar_content__opened").attr("for-calendar-id"), $(this).text()]);
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