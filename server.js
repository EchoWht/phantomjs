/**
 * Created by wanghaotian on 16/9/15.
 */
"use strict";
var port, server, service,
    system = require('system');

if (system.args.length !== 2) {
    console.log('Usage: server.js <portnumber>');
    phantom.exit(1);
} else {
    port = system.args[1];
    server = require('webserver').create();

    service = server.listen(port, function (request, response) {
        // 生成截图 start

        // var args = require('system').args;
        var msg='Success';
        var myURL = parseURL(request.url);
        console.log('URL:'+myURL);
        var filename = myURL.params.pic;
        var url = myURL.params.url;
        if (filename&&url){
            var page = require('webpage').create();
            page.viewportSize = { width: 960, height: 600 };
            page.clipRect = { top: 0, left: 0, width: 960, height: 600 };
            page.settings = {
                javascriptEnabled: false,
                loadImages: true,
                userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/19.0'
            };
            page.open(url, function () {
                page.render('../www.blskye.com/wht/uploads/notepic/'+filename);
            });
        }else{
            msg="Please input filename and url.";
        }
        // 生成截图 end
        console.log('Request at ' + new Date());
        console.log(request.url);

        response.statusCode = 200;
        response.headers = {
            'Cache': 'no-cache',
            'Content-Type': 'text/html'
        };
        response.write('<html>');
        response.write('<head>');
        response.write('<title>Hello, Blksye!</title>');
        response.write('</head>');
        response.write('<body>');
        response.write('<p>'+msg+'</p>');
        response.write('<p>Request data:</p>');
        response.write('<pre>');
        response.write(JSON.stringify(request.url, null, 4));
        response.write('</pre>');
        response.write('</body>');
        response.write('</html>');
        response.close();
    });


    if (service) {
        console.log('Web server running on port ' + port);
    } else {
        console.log('Error: Could not create web server listening on port ' + port);
        phantom.exit();
    }
}
// 传入url 获取url中得参数
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}