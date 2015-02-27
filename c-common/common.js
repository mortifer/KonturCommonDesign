﻿var $content;
        
function MediaQueryFallback() {
    if ($(window).width() <= 1024) {
        $("html").addClass("html__1024");
    } else {
        $("html").removeClass("html__1024");
    }
};

function BrowserDetect() {
    var b = navigator.userAgent || "";
    var version = 0;
    var browserClasses = "";

    if (b.indexOf("MSIE") != -1 || b.indexOf("Trident") != -1) {
        if (b.indexOf("MSIE") != -1) {
            if (b.indexOf("Trident") != -1) {

                version = parseInt(b.split("Trident/")[1].split('.')[0]) + 4;
                browserClasses = "ie ie-lt" + (version + 1) + " ie-" + version;

                if (version > 8) browserClasses += " ie-gt8";

            } else {
                browserClasses = "ie ie-lt8";
            }

        } else {
            browserClasses = "ie ie-gt8 ie-gt10";
        }
    }

    if (b.indexOf("Firefox") != -1) {
        browserClasses = "ff";
        if (b.indexOf("Windows NT 5") != -1){
            browserClasses += " ff-xp";
        }
    }

    if (b.indexOf("Opera") != -1) {
        browserClasses = "oo";
    }

    if (b.indexOf("Chrome") != -1) {
        browserClasses = "ch";
        version = parseInt(b.split("Chrome/")[1].split('.')[0]);
        if (version > 31) {
            browserClasses += " ch-gt31";
            if (version > 36) {
                if (version == 37) browserClasses += " ch-37";
                browserClasses += " ch-gt36";
            }
        }
        if (version < 34) {
            browserClasses += " ch-lt34";
        }

        if (b.indexOf("OPR") != -1) {
            browserClasses = "ch ch-oo";
            
            version = parseInt(b.split("OPR/")[1].split('.')[0]);

            if (version > 24) {
                browserClasses += " ch-oo-gt24";
            }
        }
        
        if (b.indexOf("YaBrowser") != -1) {
            browserClasses = "ch ch-ya";
            
            version = parseInt( b.split("YaBrowser/")[1].split('.',2).join(""));
            if (version > 1410) {
                browserClasses += " ch-ya-gt14.10";
            }
        }
    }

    if (b.indexOf("Safari") != -1 && b.indexOf("Chrome") == -1) {
        browserClasses = "ch sf";

        if (b.indexOf("Windows") != -1) browserClasses += " win";
        if (b.indexOf("Mac") != -1) browserClasses += " mac";
    }
    
    if (
            browserClasses.indexOf("ch-gt36") != -1 ||
            browserClasses.indexOf("ch-oo-gt24") != -1 ||
            browserClasses.indexOf("ie-gt8") != -1 ||
            browserClasses.indexOf("ch-ya-gt14.10") != -1        
        ) {
        browserClasses += " font__subpixel";
    }


    document.documentElement.className = browserClasses;
    
    //document.msCSSOMElementFloatMetrics = false;
};

BrowserDetect();

$(function () {
    //$(document).bind("runPage", function () { // evrika version
            
    if ($("html").hasClass("ie-lt9")) {
        MediaQueryFallback();
        $(window).resize(function() {
            MediaQueryFallback();
        });
    };
    
    $(".c-dropdown_projects_item.c-link.-active").click(function () {
        $(window).trigger("c-dropdown.closed", ["c-dropdown.closed.select"]);
        return false;
    });

    $(window).trigger("c-button.reposition");
    
    if ($("html").hasClass("ie-gt8")) {
        $(window).resize(function() {
            $(window).trigger("c-button.reposition");
        });
    };
    
});

$(window).bind("popups.close", function (event, data) {
    $(window).trigger("c-dropdown.closed", "c-dropdown.closed.force");
    $(window).trigger("c-calendar.closed", "c-calendar.closed.force");
    $(window).trigger("c-hint.closed", "c-hint.closed.force");
    if (data != "c-calendarD.stayOpened") {
        $(window).trigger("c-calendarD.closed", "c-calendarD.closed.force");
    }
});

$(window).bind("c-button.reposition", function () {
    
    if ($("html").hasClass("font__subpixel")) {
        $(".c-button, .c-field").each(function () {
            var $button = $(this);
                
            var realWidth = $button[0].getBoundingClientRect().width;
            var width = $button.width();
            if (realWidth > width) {
                $button.width(Math.ceil(realWidth) - ($button.hasClass("-focus") ? 2:0));
            };
            if (!$button.parent().hasClass("c-field"))
                $button.css("left", (Math.floor($button.offset().left) - $button.offset().left));
        });
    }

    return false;

    if ($("html").hasClass("ie-gt8")) { // подравниваем по максимуму дробные измерения
        
        $content = $(".c-content");
        $content.css("left", Math.floor($content.offset().left) - $content.offset().left);

        $(".c-direction, .c-button, .c-field, .c-switcher, .c-group").css("lest", "").css("top", "");

        var repositionId = 0;

        $(".c-field, .c-switcher, .c-group, .c-direction").each(function () {
            var $button = $(this);
            var buttonCssTop = /*parseInt($button.css("top")) ||*/ 0;

            $button.css("left", (Math.floor($button.offset().left) - $button.offset().left));
            $button.css("top", -($button.offset().top - Math.floor($button.offset().top)) + 1 + buttonCssTop);
            
            //repositionId++;
            //$button.attr("reposition-id", repositionId);
            //console.log($button.attr("reposition-id") + " : " + $button.outerWidth() + " : " + ($button[0].getBoundingClientRect().right - $button[0].getBoundingClientRect().left));

        });
        
        $(".c-button").each(function () {
            var $button = $(this);
            var buttonCssTop = /*parseInt($button.css("top")) ||*/ 0;

            // надо более умно сделать, куда ближе - туда и двигать.

            if (!$button.parent().hasClass("c-field") && !$button.parent().hasClass("c-direction") /*&& !$button.parent().hasClass("c-switcher") && !$button.parent().hasClass("c-group")*/) {
                $button.css("left", (Math.floor($button.offset().left) - $button.offset().left));
                $button.css("top", -($button.offset().top - Math.floor($button.offset().top)) + 1 + buttonCssTop);
                
                //repositionId++;
                //$button.attr("reposition-id", repositionId);
                //console.log($button.attr("reposition-id") + " : " + $button.outerWidth() + " : " + ($button[0].getBoundingClientRect().right - $button[0].getBoundingClientRect().left));

            }

        });

    }
});
