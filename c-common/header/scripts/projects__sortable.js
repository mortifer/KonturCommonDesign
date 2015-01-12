$(function () {
    setTimeout(function () {
        //$("[dropdown-id='Projects']").click();
    }, 500);

    $("#AllServices").click(function (e) {
        //$(".c-dropdown_content__custom").addClass("c-toggle__visible");
        $(".c-toggle_visible").removeClass("hidden");
        $(".c-toggle_hidden").addClass("hidden");
        return false;
    });

    $(window).bind("c-dropdown.closed", function () {
        $(".c-dropdown_content__custom .c-toggle_visible").addClass("hidden");
        $(".c-dropdown_content__custom .c-toggle_hidden").removeClass("hidden");
    });

    $(".c-dropdown_projects").sortable({
        connectWith: ".c-dropdown_projects",
        cursor: "move",
        placeholder: "sortable-placeholder"
    });
});