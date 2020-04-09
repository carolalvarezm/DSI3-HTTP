var http = require("http"),
    fs = require("fs");

var methods = Object.create(null);

http.createServer(function(request, response) {
    function respond(code, body, type) {
        if (!type) type = "text/plain";
        response.writeHead(code, { "Content-Type": type });
        if (body && body.pipe)
            body.pipe(response);
        else
            response.end(body);
    }
    if (request.method in methods)
        methods[request.method](urlToPath(request.url),
            respond, request);
    else
        respond(405, "Method " + request.method +
            " not allowed."); <<
    << << < HEAD
}).listen(8080);

/**
 * Esta función decodifica la url para obtener la ruta de la petición
 * @param {url} url url de la petición 
 */
function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    return "." + decodeURIComponent(path);
}

/**
 * Este método lista el directorio o el muestra el contenido de un archivo
 */
methods.GET = function(path, respond) {
    fs.stat(path, function(error, stats) {
        if (error && error.code == "ENOENT")
            respond(404, "File not found");
        else if (error)
            respond(500, error.toString());
        else if (stats.isDirectory())
            fs.readdir(path, function(error, files) {
                if (error)
                    respond(500, error.toString());
                else
                    respond(200, files.join("\n"));
            });
        else
            respond(200, fs.createReadStream(path),
                require("mime").lookup(path));
    });
};

/**
 * Este método elimina un archivo o directorio.
 */
methods.DELETE = function(path, respond) {
    fs.stat(path, function(error, stats) {
        if (error && error.code == "ENOENT")
            respond(204);
        else if (error)
            respond(500, error.toString());
        else if (stats.isDirectory())
            fs.rmdir(path, respondErrorOrNothing(respond));
        else
            fs.unlink(path, respondErrorOrNothing(respond));
    });
};

/**
 * Esta función responde con error (500) o código de estado 204
 * @param {respond} respond objeto de respuesta 
 */
function respondErrorOrNothing(respond) {
    return function(error) {
        if (error)
            respond(500, error.toString());
        else
            respond(204);
    };
}
/**
 * Este método escribe en un archivo especificado
 */
methods.PUT = function(path, respond, request) {
    var outStream = fs.createWriteStream(path);
    outStream.on("error", function(error) {
        respond(500, error.toString());
    });
    outStream.on("finish", function() {
        respond(204);
    });
    request.pipe(outStream);
};

/**
 * Este método crea un directorio en la ruta especificada
 */
methods.MKCOL = function(path, respond) {
fs.stat(path, function(error, stats) {
    if (error && error.code == "ENOENT")
        fs.mkdir(path, respondErrorOrNothing(respond))
    else if (error)
        respond(500, error.toString());
    else if (stats.isDirectory())
        respond(204);
    else
        respond(400, "bad request");
});
}; ===
=== =
}).listen(8080); >>>
>>> > Comenzando con la implementación del file server