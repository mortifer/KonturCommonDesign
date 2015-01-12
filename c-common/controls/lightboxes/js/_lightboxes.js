$(function () {
    
    $("[lightbox-id]").each(function () {
        var $lightbox = $(this);

        $lightbox.bind("click", function () {
            $(window).trigger("c-lightbox.opened", [$(this).attr("lightbox-id")]);
        });
    });

});

/* lightboxes */

var lightboxes = [];

$(window).bind("c-lightbox.opened", function (event, data) {
    
    $("body").focus();

    $(window).trigger("popups.close");

    lightboxes.push(data);
    $("html").addClass("html__lightboxOpened");

    var $lightboxCaller = $("[lightbox-id='" + data + "']");
    var $lightboxContent = $("[for-lightbox-id='" + data + "']");
    var zIndexBase = 10000 + lightboxes.length;
    
    var $lightboxBg = $lightboxContent.find(".c-lightbox_bg");
    var $allLightboxesBg = $(".c-lightbox_bg");

    //$allLightboxesBg.hide();
    //$lightboxBg.show();

    $lightboxContent.find("[lightbox-close]").bind("click", function () {
        $(window).trigger("c-lightbox.closed", [$(this).parents(".c-lightbox").attr("for-lightbox-id")]);
    });
    
    $lightboxContent.show().css({ "z-index": zIndexBase }).animate({"opacity":1}, 0, function() {
        $(this).addClass("c-lightbox__show").css({"opacity":""});
    });

    $(window).trigger("c-button.reposition");

    $lightboxContent.bind("scroll.c-lightbox", function(e) {
        $(window).trigger("c-dropdown.closed");
    });

    if ($lightboxContent.hasClass("c-lightbox__scrollable")) {
        $(window).bind("resize.c-lightbox", function() {
            $(window).trigger("c-lightbox.resize");
        });
        
        $(window).trigger("c-lightbox.resize");
    }

    $lightboxContent.bind("mousewheel.c-lightbox", function (e) {
        e.stopPropagation();
    });
});

$(window).bind("c-lightbox.resize", function (event, data) {
    var contentMinHeight = 150;
    var windowHeight = $(window).height();

    $(".c-lightbox:visible").find(".c-lightbox_content").removeAttr("style");
    $(".c-lightbox:visible").each(function() {
        var entryHeight = $(this).find(".c-lightbox_entry").outerHeight();
        var contentCurrentHeight = $(this).find(".c-lightbox_content").outerHeight();
        var contentTargetHeight = entryHeight > windowHeight ? contentCurrentHeight - (entryHeight - windowHeight) : "auto";

        contentTargetHeight = Math.max(contentTargetHeight, contentMinHeight);
        $(this).find(".c-lightbox_content").outerHeight(contentTargetHeight);
    });
});

$(window).bind("c-lightbox.closed", function (event, data) {

    if (data != lightboxes[lightboxes.length - 1]) return false;

    $(window).trigger("popups.close");
    lightboxes.pop();

    var $lightboxCaller = $("[lightbox-id='" + data + "']");
    var $lightboxContent = $("[for-lightbox-id='" + data + "']");

    $lightboxContent.removeClass("c-lightbox__show").animate({"opacity":1}, 300, function() {
        $(this).css({ "opacity": "" }).hide().removeAttr("style");
        
        if (lightboxes.length == 0)
            $("html").removeClass("html__lightboxOpened");
        else
            $("[for-lightbox-id='" + lightboxes[lightboxes.length - 1] + "']").find(".c-lightbox_bg").show();
    });

    $lightboxContent.unbind("scroll.c-lightbox mousewheel.c-lightbox");
    $(document).unbind("scroll.c-lightbox");
    $(window).unbind("resize.c-lightbox");

});
