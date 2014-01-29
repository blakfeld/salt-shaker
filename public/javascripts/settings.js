$(document).ready(function() {

    // Handle Clicking Save
    $('#save').click(function() {
        $(this).button('loading');
        $(this).prop('disabled', true);
        $('#settings').submit();
    });
});
