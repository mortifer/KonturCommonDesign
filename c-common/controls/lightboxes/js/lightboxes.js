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

    $lightboxContent.find("[lightbox-close]").bind("click", function () {
        $(window).trigger("c-lightbox.closed", [$(this).parents(".c-lightbox").attr("for-lightbox-id")]);
    });

    $lightboxContent.show().css("z-index", zIndexBase);

    var $lightboxBg = $lightboxContent.find(".c-lightbox_bg");
    var $allLightboxesBg = $(".c-lightbox_bg");

    $allLightboxesBg.hide();
    $lightboxBg.show();

    $(window).trigger("c-button.reposition");

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
