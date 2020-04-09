# Práctica 4: HTTP
## Apuntes del libro [Eloquent JS: Chapter 20 HTTP 2nd Edition](https://eloquentjavascript.net/2nd_edition/20_node.html)

### Asincronía

* La forma en la que trabaja node con la entrada/salida no es la tradicional, esperando hasta que se acabe la operación para seguir ejecutando. En node se trabaja de manera asíncrona, no se esperará hasta que acabe de cargar el archivo para seguir ejecutando el código, por lo que no se trabaja de manera secuencial.
* La manera  de trabajar es incluir lo que necesitemos de lo que estemos leyendo/escribiendo en los archivos, en una callback que se ejecutará cuando acabe de cargarse el archivo.
* En la [práctica](https://github.com/ULL-ESIT-DSI-1920/p2-t1-c3-filesystem-alu0100944723) anterior hicimos ya ejemplos de esto.
### Comando node 
* Para ejecutar node desde la linea de comandos hacemos:
    ```bash
    $ node fichero.js
    ```
* También podemos abrir el intérprete de node para ejecutar código javascript directamente:
    ```bash
    $ node
    ```
* La variable process está definida de forma global y la podemos utilizar para inspeccionar y manipular el programa actual. También hemos hecho ejemplos de esto en la pŕactica anterior.
 
### Módulos
* Para más funcionalidades debemos usar el sistema de módulos de node. 
* Para usarlos en nuestro código debemos introducir un:
```javascript
require('modulo')
```
* También debemos instalar las librerías con npm:
```
$ npm install modulo
```
### Sistema de archivos
* Este módulo *fs* lo vemos con detalle en la [práctica anterior](https://github.com/ULL-ESIT-DSI-1920/p2-t1-c3-filesystem-alu0100944723).
* Añadir que las funciones de *fs* en lugar de un objeto buffer pueden devolver un string si añadimos la codificación(utf8 en este caso):
```javascript
var fs = require("fs");
fs.readFile("file.txt", "utf8", function(error, text) {
  if (error)
    throw error;
  console.log("The file contained:", text);
});
```
### Módulo HTTP
* El módulo HTTP provee funcionalidades para desplegar servidores y hacer peticiones http.
* Para lanzar un servidor http simple podemos ver el código de nuestro primer [ejemplo]():
    ```javascript
    var http = require("http");
    var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<h1>Hello!</h1><p>You asked for <code>" +
                    request.url + "</code></p>");
    response.end();
    });
    server.listen(8080);
    ```
    * En primer lugar cargamos el módulo http con el require ```var http = require("http");```
    * A continuación creamos el servidor con la función *createServer* que es llamada cada vez que un cliente intenta conectarse al servidor. 
    * Las variables *request* y *response* que reprensentan los datos entrantes y salientes.
        * *request* contiene información sobre la petición como su url y para qué se hizo esa petición.
        * Para devolver algo llamamos métodos en el objeto de respuesta *response*.
            * El *writeHead* nos sirve para escribir las cabeceras de la respuesta, en este caso devolvemos el código de estado 200 y le comunicamos que le vamos a retornar un documento html. ```response.writeHead(200, {"Content-Type": "text/html"});``` 
            * Con el método *write* escribimos en el body del html de respuesta. ```response.write("<h1>Hello!</h1><p>You asked for <code>" + request.url + "</code></p>");```
            * Con el *response.end()* señalamos el final de la respuesta.
    * Finalmente ponemos el servidor a escuchar con *server.listen* en nuestro caso en el puerto 8080 para poder acceder desde la máquina del iaas.
    * Para parar el servidor pulsamos *ctrl+c*.
    * Comprobamos a continuación que funciona:
    ![ejecución con node]()
    ![Ejemplo 1]()
* Un servidor web real hace más que el ejemplo anterior, por ejemplo mirar el método con el que se ha hecho la petición para saber que acción realizar.
* Para actuar como un cliente HTTP podemos usar la función *request* del módulo como hacemos en el [ejemplo 2]():
    ```javascript
    var http = require("http");
    var request = http.request({
    hostname: "eloquentjavascript.net",
    path: "/20_node.html",
    method: "GET",
    headers: {Accept: "text/html"}
    }, function(response) {
    console.log("Server responded with status code",
                response.statusCode);
    });
    request.end();
    ```
    * El primer argumento del *request* es un objeto en el que añadimos el nombre de la máquina, la ruta, el método que queremos usar y las cabeceras.
    * El segundo argumento es una función que se ejecutará cada vez que se reciba una respuesta, en este caso imprimir por la terminal el código de estado.
    ![Ejemplo 2]()
* Para navegación segura podemos usar otro módulo de node *https* que contiene su propia función request.

### Servidor de archivos simple
* Si tratamos los archivos como recursos HTTP los métodos GET, PUT y DELETE pueden ser usados para leer, escribir y eliminar ficheros.
* Como no queremos que haya acceso total a nuestro sistema de archivos interpretaremos que la ruta empieza en el directorio de trabajo del servidor, que será el directorio en el que es lanzado.
* Vamos a contruir nuestro servidor de archivos paso a paso usando un objeto llamado *methods* donde guardaremos las funciones que manejan los métodos http:
    ```javascript
    var http = require("http"), fs = require("fs");

    var methods = Object.create(null);

    http.createServer(function(request, response) {
    function respond(code, body, type) {
        if (!type) type = "text/plain";
        response.writeHead(code, {"Content-Type": type});
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
                " not allowed.");
    }).listen(8000);
    ```
    * La función *respond* se ejecuta cada vez que se hace una petición al servidor. Esta función manejará los métodos y actuará como una callback para cerrar la petición.
    * Si el valor pasado a body es un stream de lectura usaremos pipe para escribirlo, si no se lo pasamos a la respuesta.
    * Lo siguiente que tenemos hace que cuando el método esté dentro de nuestro objeto *methods* le pasamos la ruta, y los objetos respond y request. ```methods[request.method](urlToPath(request.url), respond, request);```
    * Si no está el método implementado, respondemos con un código de estado 405 *Method not allowed*. ``` respond(405, "Method " + request.method + " not allowed.");```
    * Para obtener la ruta desde la url de la petición tenemos la función *urlToPath()* a la que le pasamos la url de la peticion:
        ```javascript
        function urlToPath(url) {
        var path = require("url").parse(url).pathname;
        return "." + decodeURIComponent(path);
        }

        ```
        * Nos devolverá la url decodificada para poder utilizarla, además añadimos un *'.'* para hacerla relativa.
* Para saber el tipo correcto a devolver en la cabecera podemos utilizar *mime* para ello instalamos el módulo con npm:
    ```
    npm install mime@1.4.0
    ```

#### GET
* El método GET nos returnará una lista de los ficheros cuando leamos un directorio y el contenido cuando leamos un fichero:
```javascript
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
```
* Si el fichero no existe devolvemos un código de error 404.
```javascript
    if (error && error.code == "ENOENT")
      respond(404, "File not found");
```
* Para los errores que no esperemos returnamos un código de estado 500:
```javascript
    else if (error)
      respond(500, error.toString());
```
* Si le hemos pasado como ruta un directorio nos devuelve la lista de directorios con la función de fs *readdir*:
```javascript
    else if (stats.isDirectory())
      fs.readdir(path, function(error, files) {
        if (error)
          respond(500, error.toString());
        else
          respond(200, files.join("\n"));
    });
```
![Ejemplo de GET con directorios]()
* Si le hemos pasado un archivo creamos un stream de lectura y mostramos el contenido, además de devolver el código de estado 200.
```javascript
    else
    respond(200, fs.createReadStream(path),
        require("mime").lookup(path));
```
![Ejemplo de GET con ficheros]()

#### DELETE
* El método DELETE lo usaremos para borrar directorios o ficheros:
```javascript
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
```
* Si no existe el fichero o directorio a eliminar, simplemente retornamos un código 204 en lugar de un error debido a que realmente el objetivo de la petición se ha cumplido. Esto lo hacemos para que el código sea idempotente, aplicar multiples veces la misma acción no produzca un resultado diferente.
```javascript
    if (error && error.code == "ENOENT")
      respond(204);

```
* Devolvemos el 204 ya que no contiene ningún dato nuestra respuesta.
* Igual que en el anterior si hay algún error que no hemos previsto devolvemos el codigo 500:
```javascript
    else if (error)
      respond(500, error.toString());
```
* Si lo que le hemos pasado es un directorio lo eliminará con *rmdir*:
```javascript
    else if (stats.isDirectory())
      fs.rmdir(path, respondErrorOrNothing(respond));
```
* Si es un fichero lo borrara con *unlink*:
```javascript
    else
      fs.unlink(path, respondErrorOrNothing(respond));

```
* La función *respondErrorOrNothing* nos sirve para devolver como callback en el caso que queramos de devolver el código 204 o en caso de error el código 500:
```javascript
function respondErrorOrNothing(respond) {
    return function(error) {
        if (error)
            respond(500, error.toString());
        else
            respond(204);
    };
}
```
![Ejemplo con Directorios]()
![Ejemplo con ficheros]()

#### PUT
* En el caso de PUT escribiremos en el fichero que nos pasen. No nos preocuparemos si este existe ya o no porque en ese caso lo sobreescribiremos:
```javascript
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
```
* Usamos pipe para mover los datos desde lo que entramos en la petición a una salida en este caso el fichero indicado:

```javascript
request.pipe(outStream);
```
* Si hay un error se responderá con el código 500:
```javascript
  outStream.on("error", function(error) {
    respond(500, error.toString());
  });
```
* Si se ha cargado el archivo donde vamos a escribir devolvemos un código 204.
```javascript
  outStream.on("finish", function() {
    respond(204);
  });
```
![Ejemplo con PUT]()

Como podemos ver todas estos métodos siguen el mismo patrón para crearlos.
* Con la herramienta CURL podemos probar los métodos anteriores haciendo peticiones a nuestro servidor:
  * Para el GET:
    ```
    $ curl http://localhost:8080/file.txt
    ```
  * Para el PUT, donde el -d indica el texto a introducir:  
    ```
    $ curl -X PUT -d hello http://localhost:8080/file.txt
    ```
  * Para el DELETE
    ```
    $ curl -X DELETE http://localhost:8000/file.txt
    ```

## Ejercicio Creating Directories
* Para este ejercicio cogeremos de plantilla el del DELETE. El método MKCOL que he hecho es el siguiente:
```javascript
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
};
```
* Cuando el directorio no existe lo creamos con *fs.mkdir*:
```javascript
  if (error && error.code == "ENOENT")
    fs.mkdir(path, respondErrorOrNothing(respond))
```
![Ejemplo de MKCOL con directorio]()
* Cuando nos da algún error desconocido devolvemos el código 500:
```javascript
else if (error)
  respond(500, error.toString());
```
* Cuando el directorio existe respondemos con el código de estado 204, para mantener la idempotencia de las operaciones.
```javascript
else if (stats.isDirectory())
  respond(204);
```
![Prueba idempotencia]()
* Cuando no es un directorio lo que nos pasan respondemos con el código de error 400 *bad request*
```javascript
else
  respond(400, "bad request");
```
![Ejemplo de MKCOL con fichero]()

## Insomnia
## Documentación
## gulpfile