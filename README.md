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

#### GET
#### DELETE
#### PUT

## Ejercicio Creating Directories
## Insomnia
## Documentación
## gulpfile