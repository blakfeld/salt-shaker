$(document).ready(function() {
    'use strict';
    var socket = io.connect('http://localhost:3000');
    var grain_list = document.getElementById('grains_list');
    var current_minion = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1);

    // Request initial minion list
    socket.emit('get_minion_grains', {'minion_id': current_minion});

    socket.on('grain_list', function(data) {
        if (data.grains) {
            var grains = data.grains;
            var html = "<ul class='list-group'>";
            for (var key in grains) {

                html += '<li class="list-group-item">';
                html += '<h4 class="list-group-item-heading">' + key + '</h4>';

                // Make sure grain listing is not an Object
                if (typeof(grains[key]) !== 'object') {

                    html += '<p class="list-group-item-text"><ul><li>' +
                        grains[key] + '</li></ul></p>';

                    // Check if it's an Array
                } else if (Array.isArray(grains[key])) {
                    html += '<ul>';
                    for (var i = 0; i < grains[key].length; i++) {
                        // Make sure its not a nested dict
                        if (typeof(grains[key][i]) !== 'object') {
                            html += '<li>' + grains[key][i] + '</li>';
                        } else {
                            for (var subkey in grains[key][i]) {
                                html += '<li><b>' + subkey + ': </b>' +
                                    grains[key][i][subkey] + '</li>';
                            }
                        }
                    }
                    html += '</ul>';

                    // Assume its a Dictionary
                } else {
                    html += '<ul>';
                    for (subkey in grains[key]) {
                        html += '<li><b>' + subkey + ': </b>' +
                            grains[key][subkey] + '</li>';
                    }
                    html += '</ul>';
                }
                html += '</li>';
            }
            html += '</ul>';
            grain_list.innerHTML = html;

            $('#refresh').button('reset');
        }
    });

    $('#refresh').click(function() {
        $(this).button('loading');
        $(this).prop('disabled', true);
        socket.emit('refresh_minion_grains', {'minion_id': current_minion});
    });
});
