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


### Servidor de archivos simple
#### GET
#### DELETE
#### PUT

## Ejercicio Creating Directories
## Insomnia
## Documentación
## gulpfile