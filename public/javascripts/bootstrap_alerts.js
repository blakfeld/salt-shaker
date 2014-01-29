bootstrap_alert = function (type, message, timeout, dismissable) {
    $('.alert').alert('close');

    if (dismissable) {
        $('.dynamic_alerts').append('<div class="alert alert-' + type + '"><a class="close" style="margin-bottom: 4px" data-dismiss="alert">&times;</a>' + message + '<div>').hide().slideDown('slow', 'swing');
    } else {
        $('.dynamic_alerts').append('<div class="alert alert-' + type + '">' + message + '<div>').hide().slideDown('slow', 'swing');
    }

    if (timeout || timeout === 0) {
        setTimeout(function () {
            $('.dynamic_alerts').slideUp('slow', 'swing', function () {
                $(".alert").alert('close');
            });
        }, timeout);
    }
};