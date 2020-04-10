var http = require("http");
/*
 * Primer ejemplo de como usar el módulo para crear un servidor básico
 */
var server = http.createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("<h1>Hello!</h1><p>You asked for <code>" +
        request.url + "</code></p>");
    response.end();
});
server.listen(8080);