$(document).ready(function() {
    var socket = io.connect('http://localhost:3000');

    // Get Initial data
    socket.emit('get_settings', {'type': 'server'});

    socket.on('error', function(data) {
        if(data.errormsg) {
            bootstrap_alert('danger', data.errormsg, 10000, true);
        }
    });

    socket.on('current_settings', function(data) {
        if (data.settings) {
            var settings = data.settings;

            $('#host').val(settings.host);
            $('#user').val(settings.user);
            $('#pass').val(settings.pass);
            $('#auth_type').val(settings.auth_type.toUpperCase());
        }
    });

    socket.on('settings_status', function(data) {
        if(data.success)
            bootstrap_alert('success', data.success, 10000, true);

        $('#save').button('reset');
    });

    // Handle Clicking Save
    $('#save').click(function() {
        $(this).button('loading');
        $(this).prop('disabled', true);
        $('#settings-form').submit();
    });

    // Catch submit
    $('#settings-form').submit(function(event) {
        event.preventDefault();
        $('#subscribe-button').attr('disabled', 'disabled');

        // Build JSON to submit.

        var newSettings = {
            'host': $('#host').val(),
            'user': $('#user').val(),
            'pass': $('#pass').val(),
            'auth_type': $('#auth_type').val().toLowerCase()
        };

        socket.emit('new_settings',
            {'type': 'server', 'new_settings': newSettings});
    });
});
