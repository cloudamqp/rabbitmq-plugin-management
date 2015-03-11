dispatcher_add(function(sammy) {
    sammy.get('#/plugins', function() {
            render({'plugins': {path: '/plugins'}},
                    'plugins', '#/plugins');
        });
    sammy.get('#/plugins/:name', function() {
            render({'plugin': '/plugins/' + esc(this.params['name'])},
                   'plugins', '#/plugins');
        });
    sammy.put('#/plugins/:name', function() {
            var num_keys = ['prefetch-count', 'reconnect-delay'];
            var bool_keys = ['add-forward-headers'];
            var arrayable_keys = ['src-uri', 'dest-uri'];
            var redirect = this.params['redirect'];
            if (redirect != undefined) {
                delete this.params['redirect'];
            }
            put_parameter(this, [], num_keys, bool_keys, arrayable_keys);
            if (redirect != undefined) {
                go_to(redirect);
            }
            return false;
        });
    sammy.del('#/plugins/:name', function() {
            if (sync_delete(this, '/plugins/:name'))
                go_to('#/plugins');
            return false;
        });
});


NAVIGATION['Admin'][0]['Plugins'] = ['#/plugins', "administrator"];

HELP['shovel-uri'] =
    'Both source and destination can be either a local or remote broker. See the "URI examples" pane for examples of how to construct URIs. If connecting to a cluster, you can enter several URIs here separated by spaces.';

HELP['shovel-queue-exchange'] =
    'You can set both source and destination as either a queue or an exchange. If you choose "queue", it will be declared beforehand; if you choose "exchange" it will not, but an appropriate binding and queue will be created when the source is an exchange.';

HELP['shovel-prefetch'] =
    'Maximum number of unacknowledged messages that may be in flight over a shovel at one time. Defaults to 1000 if not set.';

HELP['shovel-reconnect'] =
    'Time in seconds to wait after a shovel goes down before attempting reconnection. Defaults to 1 if not set.';

HELP['shovel-forward-headers'] =
    'Whether to add headers to the shovelled messages indicating where they have been shovelled from and to. Defaults to false if not set.';

HELP['shovel-ack-mode'] =
    '<dl>\
       <dt><code>on-confirm</code></dt>\
       <dd>Messages are acknowledged at the source after they have been confirmed at the destination. Handles network errors and broker failures without losing messages. The slowest option, and the default.</dd>\
       <dt><code>on-publish</code></dt>\
       <dd>Messages are acknowledged at the source after they have been published at the destination. Handles network errors without losing messages, but may lose messages in the event of broker failures.</dd>\
       <dt><code>no-ack</code></dt>\
       <dd>Message acknowledgements are not used. The fastest option, but may lose messages in the event of network or broker failures.</dd>\
</dl>';

HELP['shovel-delete-after'] =
    '<dl>\
       <dt><code>Never</code></dt>\
       <dd>The shovel never deletes itself; it will persist until it is explicitly removed.</dd>\
       <dt><code>After initial length transferred</code></dt>\
       <dd>The shovel will check the length of the queue when it starts up. It will transfer that many messages, and then delete itself.</dd>\
</dl>';

function link_shovel(vhost, name) {
    return _link_to(name, '#/dynamic-shovels/' + esc(vhost) + '/' + esc(name));
}

function fmt_shovel_endpoint(prefix, shovel) {
    var txt = '';
    if (shovel[prefix + '-queue']) {
        txt += fmt_string(shovel[prefix + '-queue']) + '<sub>queue</sub>';
    } else {
        if (shovel[prefix + '-exchange']) {
            txt += fmt_string(shovel[prefix + '-exchange']);
        } else {
            txt += '<i>as published</i>';
        }
        if (shovel[prefix + '-exchange-key']) {
            txt += ' : ' + fmt_string(shovel[prefix + '-exchange-key']);
        }
        txt += '<sub>exchange</sub>';
    }
    return txt;
}
