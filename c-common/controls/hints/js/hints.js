$(function () {

    $("[hint-id]").each(function () {
        var $hint = $(this);

        $hint.bind("click", function () {
            if ($(this).hasClass("-opened")) {
                $(window).trigger("c-hint.closed", ["c-hint.closed.select"]);
            } else {
                $(window).trigger("c-hint.closed", ["c-hint.closed.select"]);
                $(".-opened").removeClass(".-opened");
                $(this).addClass("-opened");
                $(window).trigger("c-hint.opened", [$(this).attr("hint-id")]);
            }
            return false;
        });

        $hint.bind("mouseenter", function () {
            $(this).addClass("-hover");
        });
        
        $hint.bind("mouseleave", function () {
            $(this).removeClass("-hover");
        });
    });

});

$(window).bind("c-hint.opened", function (event, data) {

    $(window).trigger("popups.close");

    $("html").addClass("html__hintOpened");

    var $hintCaller = $(".-opened[hint-id='" + data + "']");
    var $hintContent = $("[for-hint-id='" + data + "']");
    
    $(window).trigger("c-hint.closed");
    
    $("html").addClass("html__hintOpening");
    
    var callerWidth = $hintCaller.outerWidth();
    var callerOffset = $hintCaller.offset();
    
    $hintContent.addClass("c-hint_content__opened");
    
    //var contentWidth = $hintContent.outerWidth();

    var sizePropertiesV = "";
    var sizePropertiesH = "";
    var directionV = 0;
    var directionH = 0;

    var arrowSize = 12;
    var arrowSizeV = 0;
    var arrowSizeH = 0;    
    var arrowShiftV = 0;    
    var arrowShiftH = 0;

    var shiftV = "0";
    
    if ($hintCaller.hasClass("c-icon__font"))
        shiftV = "4";

    $hintContent.attr("hint-align", $hintCaller.attr("hint-align"));
    $hintContent.attr("hint-position", $hintCaller.attr("hint-position"));

    if ($hintCaller.attr("hint-position") == "top" || $hintCaller.attr("hint-position") == "bottom") {
        sizePropertiesH = "";
        directionH = -1;
        arrowSizeV = 0.5;
        arrowSizeH = 0;
        arrowShiftV = 0;
        arrowShiftH = 15;
        
        sizePropertiesV = "$hintContent.outerHeight() + 2 - " + shiftV;
        
        directionV = -1;
        
        if ($hintCaller.attr("hint-position") == "bottom") {
            sizePropertiesV = "$hintCaller.outerHeight() + 2";
            directionV = 1;
        }

        if ($hintCaller.attr("hint-align") == "center") {
            sizePropertiesH = "$hintContent.outerWidth()/2 - $hintCaller.outerWidth()/2";
            arrowSizeH = 0;
            arrowShiftH = 0;
        }
        if ($hintCaller.attr("hint-align") == "right") {
            sizePropertiesH = "$hintContent.outerWidth() - $hintCaller.outerWidth() - 2";
            arrowShiftH = -15;
        }
    }
    
    if ($hintCaller.attr("hint-position") == "right" || $hintCaller.attr("hint-position") == "left") {
        sizePropertiesV = "-" + shiftV;

        directionV = -1;
        arrowSizeV = 0;
        arrowSizeH = 0.5;
        arrowShiftV = 15;
        arrowShiftH = 0;

        sizePropertiesH = "$hintCaller.outerWidth() + 2";
        directionH = 1;

        if ($hintCaller.attr("hint-position") == "left") {
            sizePropertiesH = "$hintContent.outerWidth() + 2";
            directionH = -1;
        }

        if ($hintCaller.attr("hint-align") == "center") {
            sizePropertiesV = "$hintContent.outerHeight()/2 - $hintCaller.outerHeight()/2 - " + shiftV + "/2";
            arrowShiftV = 0;
        }
        
        if ($hintCaller.attr("hint-align") == "bottom") {
            sizePropertiesV = "$hintContent.outerHeight() - $hintCaller.outerHeight() - 2 + " + shiftV;
            arrowShiftV = -15;
        }
    }

    $hintContent.css({        
        top: callerOffset.top + (sizePropertiesV != "" ? eval(sizePropertiesV) : 0) * directionV + arrowSize * directionV * arrowSizeV + arrowShiftV * directionV,
        left: callerOffset.left + (sizePropertiesH != "" ? eval(sizePropertiesH) : 0) * directionH + arrowSize * directionH * arrowSizeH + arrowShiftH * directionH
    });
    
    setInterval(function () {
        $("html").removeClass("html__hintOpening");
    }, 0);

    $hintContent.bind("mouseenter", function () {
        $hintContent.addClass("-hover");
        $hintCaller.addClass("-hover");
    });

    $hintContent.bind("mouseleave", function () {
        $hintContent.removeClass("-hover");
        $hintCaller.removeClass("-hover");
    });

    //$hintContent.find(".c-link").bind("click", function () {
        //$(window).trigger("c-dropdown.closed", ["c-dropdown.closed.select"]);
        //if ($(this).hasClass("-checked")) return false;
        //return false; // костыль для отсутвующей обработки данных
    //});

    $(document).bind("click.c-hint", function () { // IE8 does not support click event on window object
        $(window).trigger("c-hint.closed");
    });

    $(window).bind("resize.c-hint lightbox__opened", function () {
        if (!$("html").hasClass("html__hintOpening")) { // IE8 resize event break flow
            $(window).trigger("c-hint.closed", ["c-hint.closed.force"]);
        }
    });

});

$(window).bind("c-hint.closed", function (event, data) {
    var selector = "";
    if (data == undefined) {
        selector = ":not(.-hover)";
    }

    $(".-opened" + selector).removeClass("-opened");
    $(".c-hint_content__opened" + selector)
        .removeClass()
        .addClass("c-hint_content")
        .removeAttr("style")
        .removeAttr("hint-align")
        .removeAttr("hint-position")
        .unbind();
    
    if ($(".c-hint_content.-hover").length == 0) {
        $(document).unbind("click.c-hint");
        $(window).unbind("resize.c-hint");
    }
});

