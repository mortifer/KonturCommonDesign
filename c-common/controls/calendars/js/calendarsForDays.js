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
                $(".c-field.-opened").removeClass(".-opened");
                $(this).addClass("-opened");
                $(window).trigger("c-calendarD.opened", [$(this).attr("calendar-id")]);
            }
            return false;
        });
    });

});

var monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

$(window).bind("c-calendarD.change", function (event, data, value) {

    var $item = $("[calendar-id='" + data + "']");;

    $item.removeClass("-hover -active").children().val(value);

});

$(window).bind("c-calendarD.closed", function (event, reason, data, value) {
    var selector = "";
    if (reason == undefined) {
        selector = ":not(.-hover)";
    }

    if (reason == "c-calendarD.closed.select") {
        $(window).trigger("c-calendarD.change", [data, value]);
    }

    $(".c-field.-opened[calendar-id]" + selector).removeClass("-opened");
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

Date.prototype.monthDays = function () {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
};

$(window).bind("c-calendarD.opened", function (event, data) {

    var firstGeneratedDate;
    var lastGeneratedDate;
    
    function generateMonth(date, dateInField) {

        var template = "";
        var tmp = date.split(".");
        var realDate = "";
        var oddMonth = parseInt(tmp[1], '10') % 2 == 0;

        template = "<div class=\"c-calendar_list " + (oddMonth ? "-odd" : "") + " \">\n";
        template += "<div class=\"c-calendar_list_title\">" + monthes[parseInt(tmp[1], '10') - 1].substr(0, 3).toLowerCase() + "<span>" + tmp[2] + "</span></div>\n";

        var tmpDate = new Date(tmp[2], parseInt(tmp[1], '10') - 1, 1);
        var daysInMonth = tmpDate.monthDays();
        var daysInPrevoiusMonth = new Date(tmp[2], (parseInt(tmp[1], '10') - 2 == -1 ? 11 : parseInt(tmp[1], '10') - 2), 1).monthDays();

        var firstMonthDayInWeek = tmpDate.getDay();
        firstMonthDayInWeek == 0 ? firstMonthDayInWeek = 7 : firstMonthDayInWeek = firstMonthDayInWeek;
        var lastMonthDayInWeek = new Date(tmp[2], parseInt(tmp[1], '10') - 1, daysInMonth).getDay();
        lastMonthDayInWeek == 0 ? lastMonthDayInWeek = 7 : lastMonthDayInWeek = lastMonthDayInWeek;

        var tmptmp = [];
        tmptmp[1] = tmp[1];
        tmptmp[2] = tmp[2];
        if (parseInt(tmptmp[1], '10') - 1 == 0) {
            tmptmp[1] = "12";
            tmptmp[2] = parseInt(tmptmp[2], '10') - 1;
        } else {
            tmptmp[1] = parseInt(tmptmp[1], '10') - 1 < 10 ? "0" + (parseInt(tmptmp[1], '10') - 1) : (parseInt(tmptmp[1], '10') - 1);
        }

        for (var prefixDay = (daysInPrevoiusMonth - firstMonthDayInWeek + 2) ; prefixDay <= daysInPrevoiusMonth; prefixDay++) {
            realDate = ((prefixDay < 10 ? "0" + prefixDay : prefixDay) + "." + tmptmp[1] + "." + tmptmp[2]).toString();
            template += "<a date=\"" + realDate + "\" href=\"#\" class=\"c-calendar_list_item c-link " + (realDate == dateInField ? "-checked" : "") + " " + (!oddMonth ? "-odd" : "") + " \">" + prefixDay + "</a>\n";
        };
        
        for (var day = 1; day <= daysInMonth; day++) {
            realDate = ((day < 10 ? "0" + day : day) + "." + tmp[1] + "." + tmp[2]).toString();
            template += "<a date=\"" + realDate + "\" href=\"#\" class=\"c-calendar_list_item c-link " + (realDate == dateInField ? "-checked" : "") + " " + (oddMonth ? "-odd" : "") + " " + ((firstMonthDayInWeek + day) % 7 == 0 || (firstMonthDayInWeek + day) % 7 == 1 ? "-red" : "") + "\">" + day + "</a>\n";
        };
        if (lastMonthDayInWeek != 7) {
            for (var suffixDay = lastMonthDayInWeek; suffixDay <= 7 - lastMonthDayInWeek; suffixDay++) {
                template += "<a href=\"#\" class=\"c-calendar_list_item c-link " + (!oddMonth ? "-odd" : "") + "\">" + suffixDay + "</a>\n";
            };
        } else {
            for (var suffixDay = 1; suffixDay <= 7; suffixDay++) {
                template += "<a href=\"#\" class=\"c-calendar_list_item c-link " + (!oddMonth ? "-odd" : "") + "\">" + suffixDay + "</a>\n";
            };
        }
        template += "</div>\n";
        return template;
    };

    function genegatePreviousMonth(date) {
        var tmp = date.split(".");
        tmp[1] = (parseInt(tmp[1], '10') - 1 == 0 ? 12 : parseInt(tmp[1], '10') - 1);
        tmp[2] = tmp[1] == 12 ? parseInt(tmp[2], '10') - 1 : tmp[2];
        var tempPrevoiusDate = tmp[0] + "." + (tmp[1] < 10 ? "0" + tmp[1] : tmp[1]) + "." + tmp[2];
        firstGeneratedDate = tempPrevoiusDate;
        return generateMonth(tempPrevoiusDate,date);
    }

    function genegateNextMonth(date) {
        var tmp = date.split(".");
        tmp[1] = (parseInt(tmp[1], '10') + 1 == 13 ? 1 : parseInt(tmp[1]) + 1);
        tmp[2] = tmp[1] == 1 ? parseInt(tmp[2], '10') + 1 : tmp[2];
        var tempNextDate = tmp[0] + "." + (tmp[1] < 10 ? "0"+tmp[1]:tmp[1]) + "." + tmp[2];
        lastGeneratedDate = tempNextDate;
        return generateMonth(tempNextDate, date);
    }

    function generateTripleMonth(date) {
        var template = "";
        template += genegatePreviousMonth(date);
        template += generateMonth(date, date);
        template += genegateNextMonth(date);
        return template;
    }

    function generateContent(date) {
        var tmp = date.split(".");
        var template = "";
        var selectedDay = parseInt(tmp[0], '10');
        var selectedMonth = monthes[parseInt(tmp[1], '10') - 1];
        var selectedYear = parseInt(tmp[2], '10');
        $dropdownContent.find(".c-button__calendar__month .c-button_content").html(selectedMonth);
        $dropdownContent.find(".c-button__calendar__year .c-button_content").html(selectedYear);
        
        $dropdownContentInner.html();
        
        template =  "<div class=\"c-calendar_lists\">\n";
        template +=  "<div class=\"c-calendar_lists_\">\n";
        template += generateTripleMonth(date);
        template += "</div>\n";
        template += "</div>\n";

        $dropdownContentInner.html(template);
    };

    //$(window).trigger("popups.close");

    var $dropdownCaller = $("[calendar-id='" + data + "']");
    var $dropdownContent,
        $dropdownContentInner;

    if ($dropdownCaller.length > 1) $dropdownCaller[0];

    $dropdownContent = $(".c-calendar_days").attr("for-calendar-id", data);
    $dropdownContentInner = $dropdownContent.find(".c-calendar_days_content");

    generateContent($dropdownCaller.children().val());

    var clickForDrag = false;

    $dropdownContentInner.children().draggable({
        axis: "y",
        cursor: "pointer",
        start: function(event, ui) {
            clickForDrag = true;
        },
        drag: function (event, ui) {
            var top = ui.position.top;
            var $tmp = $dropdownContentInner.find(".c-calendar_lists_");
            if ( top + parseInt($tmp.css("top")) >= 0) {
                $tmp.prepend(genegatePreviousMonth(firstGeneratedDate));
                $tmp.css("top", parseInt($tmp.css("top")) - parseInt($tmp.find(".c-calendar_list").first().outerHeight()) + 25);
            }
            if (top + parseInt($tmp.outerHeight()) <= parseInt($dropdownContentInner.outerHeight()) + 25) {
                $tmp.append(genegateNextMonth(lastGeneratedDate));
            }
            //$dropdownContentInner.find(".c-calendar_lists").append(genegateNextMonth(lastGeneratedDate));

        },
        stop: function (event, ui) {
            bindDropdownContentInner();
            setTimeout( function() {
                clickForDrag = false;
            },0 );
        }
    });

    $dropdownContentInner.children().bind("mousewheel", function (event) {
        event.preventDefault();
        
        var $tmp = $dropdownContentInner.find(".c-calendar_lists_");
        var top = parseInt($tmp.parent().css("top")) || 0;
        
        if (event.deltaY > 0) {
            top += 25;
        } else {
            top -= 25;
        }

        $tmp.parent().css("top", top);
        
        if (top + parseInt($tmp.css("top")) >= 0) {
            $tmp.prepend(genegatePreviousMonth(firstGeneratedDate));
            $tmp.css("top", parseInt($tmp.css("top")) - parseInt($tmp.find(".c-calendar_list").first().outerHeight()) + 25);
            bindDropdownContentInner();
        }
        if (top + parseInt($tmp.outerHeight()) <= parseInt($dropdownContentInner.outerHeight()) + 25) {
            $tmp.append(genegateNextMonth(lastGeneratedDate));
            bindDropdownContentInner();
        }
        
    });

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

    $dropdownContent.unbind();
    $dropdownContentInner.unbind();

    $dropdownContent.bind("mouseenter", function () {
        $dropdownContent.addClass("-hover");
        $dropdownCaller.addClass("-hover");
    });

    $dropdownContent.bind("mouseleave", function () {
        $dropdownContent.removeClass("-hover");
        $dropdownCaller.removeClass("-hover");
    });

    function unbindDropdownContentInner() {
        $dropdownContent.find(".c-link").unbind();
    };

    function bindDropdownContentInner() {
        unbindDropdownContentInner();
        $dropdownContent.find(".c-link").bind("click", function () {
            if (clickForDrag) return false;
            $(window).trigger("c-calendarD.closed", ["c-calendarD.closed.select", $(".c-calendar_days__opened").attr("for-calendar-id"), $(this).attr("date")]);
            if ($(this).hasClass("-checked")) return false;
            return false; // костыль для отсутвующей обработки данных
        });
    }

    bindDropdownContentInner();

    $(document).bind("click.c-calendarD", function () { // IE8 does not support click event on window object
        $(window).trigger("c-calendarD.closed");
    });

    $(window).bind("resize.c-calendarD lightbox__opened", function () {
        if (!$("html").hasClass("html__dropdownOpening")) { // IE8 resize event break flow
            $(window).trigger("c-calendarD.closed", ["c-calendarD.closed.force"]);
        }
    });

    $dropdownContentInner.bind("scroll", function () {

        if ($(this).scrollTop() == 0) {
            $dropdownContentInner.find(".c-calendar_lists").prepend(genegatePreviousMonth(firstGeneratedDate));
            $(this).scrollTop($dropdownContentInner.find(".c-calendar_list").first().outerHeight());
        }
        
        if ( $(this).scrollTop() >= $(this).children().outerHeight() - $(this).outerHeight()) {
            $dropdownContentInner.find(".c-calendar_lists").append(genegateNextMonth(lastGeneratedDate));
        }
        
        bindDropdownContentInner();

    });
});