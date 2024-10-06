/* Javascript for OpenDNDXBlock. */
function OpenDNDXBlock(runtime, element) {
    

    var handlerUrl = runtime.handlerUrl(element, 'increment_count');



    $('[data-open-dnd]', element).click(function(eventObject) {
        console.log('work')
    });

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
