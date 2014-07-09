var buttonCounter = 0;
var $content;
        
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
    }

    if (b.indexOf("Opera") != -1) {
        browserClasses = "oo";
    }

    if (b.indexOf("Chrome") != -1) {
        browserClasses = "ch";
        version = parseInt(b.split("Chrome/")[1].split('.')[0]);
        if (version > 31) {
            browserClasses += " ch-gt31";
        }
        if (version < 34) {
            browserClasses += " ch-lt34";
        }

        if (b.indexOf("OPR") != -1) {
            browserClasses = "ch ch-oo";
        }
        if (b.indexOf("YaBrowser") != -1) {
            browserClasses = "ch ch-ya";
        }
    }

    if (b.indexOf("Safari") != -1 && b.indexOf("Chrome") == -1) {
        browserClasses = "ch sf";

        if (b.indexOf("Windows") != -1) browserClasses += " win";
        if (b.indexOf("Mac") != -1) browserClasses += " mac";
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
            
    if ($("html").hasClass("ie-gt8")) { // для ie > 8 
        $content = $(".c-content");
        $content.css("left", Math.floor($content.offset().left) - $content.offset().left);
        $(window).resize(function() {
            $content.css("left", Math.floor($content.offset().left) - $content.offset().left);
        });
    }

    $(".c-button").each( function(){ // Для оперы престо надо и для ie
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

    if ($("html").hasClass("ie-gt8")) { // подравниваем по максимуму дробные измерения

        $(".c-button").each(function() {
            var $button = $(this);
            var $button_content = $button.find(".c-button_content");
            var buttonCssTop = parseInt($button.css("top")) || 0;

            // надо более умно сделать, куда ближе - туда и двигать.

            if (!$button.parent().hasClass("c-field") && !$button.parent().hasClass("c-switcher") && !$button.parent().hasClass("c-group")) {
                $button.css("left", (Math.floor($button.offset().left) - $button.offset().left));
                $button.css("top", -($button.offset().top - Math.floor($button.offset().top)) + 1 + buttonCssTop);
            }

        });

        $(".c-field, .c-switcher, .c-group").each(function () {
            var $button = $(this);
            var buttonCssTop = parseInt($button.css("top")) || 0;

            $button.css("left", (Math.floor($button.offset().left) - $button.offset().left));
            $button.css("top", -($button.offset().top - Math.floor($button.offset().top)) + 1 + buttonCssTop);
        });

    }

            
    $(".c-group .c-button").each(function () {
        var $button = $(this);
        $button.bind("click", function (event) {
            if ($(this).hasClass("-disabled")) return;
            if (event.which == 1) {
                $(this).parent().find(".c-button").removeClass("-checked -focus");
                $(this).addClass("-checked");
            }
        });
    });

            
    $(".c-field").each( function(){
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
            
    $(".c-checkbox input, .c-radio input").each( function(){
        var $input = $(this);

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

    });
    
    $(".c-dropdown_projects_item.c-link.-active").click(function () {
        $(window).trigger("c-dropdown.closed", ["c-dropdown.closed.select"]);
        return false;
    });

    $("[dropdown-id]").each( function(){
        var $dropdown = $(this);

        $dropdown.bind("mouseenter", function(){
            $(this).addClass("-hover");
            $(this).find(".c-link").addClass("-hover");
        });

        $dropdown.bind("mouseleave", function(){
            $(this).removeClass("-hover");
            $(this).find(".c-link").removeClass("-hover");
        });

        $dropdown.bind("click", function(){
            if ($(this).hasClass("-opened")) {
                $(window).trigger("c-dropdown.closed",["c-dropdown.closed.select"]);
            } else {
                $(window).trigger("c-dropdown.opened",[$(this).attr("dropdown-id")]);
            }
            return false;
        });
    });
    
    $("[lightbox-id]").each(function () {
        var $lightbox = $(this);

        $lightbox.bind("click", function () {
            $(window).trigger("c-lightbox.opened", [$(this).attr("lightbox-id")]);
        });
    });

});

$(window).bind("popups.close", function (event, data) {
    //$(".hint").hide();    
});

$(window).bind("c-dropdown.closed", function(event,data){
    var selector = "";
    if ( data == undefined) {
        selector = ":not(.-hover)";
    }

    $(".-opened"+selector).removeClass("-opened");
    $(".c-dropdown_content__opened"+selector)
        .removeClass()
        .addClass("c-dropdown_content")
        .removeAttr("style")
        .unbind();
    $(document).unbind("click.c-dropdown");
    $(window).unbind("resize.c-dropdown");
});

$(window).bind("c-dropdown.opened", function (event, data) {
            
    $(window).trigger("popups.close");
            
    var $dropdownCaller = $("[dropdown-id='"+data+"']");
    var $dropdownContent = $("[for-dropdown-id='"+data+"']");

    if (!$("html").hasClass("html__helpOpened"))
        $(window).trigger("c-dropdown.closed");
            
    $dropdownCaller.addClass("-opened");

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

    if (contentWidth > callerWidth || forceChangeAlignment ) {
        if ($dropdownCaller.attr("dropdown-align") == "right" || forceChangeAlignment) {
            $dropdownContent.addClass("c-dropdown_content__right");
            $dropdownContent.css({
                left: callerOffset.left + callerWidth - contentWidth + subPixelFix + buttonFix
            });
        }  else  {
            $dropdownCaller.addClass("c-dropdown_content__left");
        }
    };
            
    setInterval(function() {
        $("html").removeClass("html__dropdownOpening");
    }, 0);

    $dropdownContent.bind("mouseenter", function(){
        $dropdownContent.addClass("-hover");
        $dropdownCaller.addClass("-hover");
    });

    $dropdownContent.bind("mouseleave", function(){
        $dropdownContent.removeClass("-hover");
        $dropdownCaller.removeClass("-hover");
    });

    $dropdownContent.find(".c-link").bind("click", function () {
        $(window).trigger("c-dropdown.closed", ["c-dropdown.closed.select"]);
        if ($(this).hasClass("-checked")) return false;
        return false; // костыль для отсутвующей обработки данных
    });

    $(document).bind("click.c-dropdown", function(){ // IE8 does not support click event on window object
        $(document).trigger("c-dropdown.closed");
    });

    $(window).bind("resize.c-dropdown lightbox__opened", function () {
        if (!$("html").hasClass("html__dropdownOpening")) { // IE8 resize event break flow
            $(window).trigger("c-dropdown.closed", ["c-dropdown.closed.force"]);
        }
    });
});

/* lightboxes */

var lightboxes = [];

$(window).bind("c-lightbox.opened", function (event, data) {

    $(window).trigger("popups.close");
    
    lightboxes.push(data);
    $("html").addClass("html__lightboxOpened");
    
    var $lightboxCaller = $("[lightbox-id='" + data + "']");
    var $lightboxContent = $("[for-lightbox-id='" + data + "']");
    var zIndexBase = 10000 + lightboxes.length;
   
    $lightboxContent.find("[lightbox-close]").bind("click", function () {
        $(window).trigger("c-lightbox.closed", [$(this).parents(".c-lightbox").attr("for-lightbox-id")]);
    });

    $lightboxContent.show().css("z-index", zIndexBase);

    var $lightboxBg = $lightboxContent.find(".c-lightbox_bg");
    var $allLightboxesBg = $(".c-lightbox_bg");
    
    $allLightboxesBg.hide();
    $lightboxBg.show();

});

$(window).bind("c-lightbox.closed", function (event, data) {

    if (data != lightboxes[lightboxes.length - 1]) return false;
    
    $(window).trigger("popups.close");
    lightboxes.pop();
    
    if (lightboxes.length == 0)
        $("html").removeClass("html__lightboxOpened");
    else
        $("[for-lightbox-id='" + lightboxes[lightboxes.length - 1] + "']").find(".c-lightbox_bg").show();
    
    var $lightboxCaller = $("[lightbox-id='" + data + "']");
    var $lightboxContent = $("[for-lightbox-id='" + data + "']");

    $lightboxContent.hide().removeAttr("style");

});

