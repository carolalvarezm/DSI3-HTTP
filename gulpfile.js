var gulp = require("gulp");
var shell = require("gulp-shell");

gulp.task("pre-install", shell.task([
    "npm i -g gulp static-server",
    "npm install -g nodemon",
    "npm install -g gulp-shell"
]));

gulp.task("serve", shell.task("npx nodemon src/server.js"));

gulp.task("lint", shell.task("jshint *.js **/*.js"));

gulp.task("get", shell.task("curl -v http://localhost:8080/src/file.txt"));
gulp.task("put", shell.task("curl -v -X PUT -d 'Bye world!' http://localhost:8080/src/file.txt"));
gulp.task("delete", shell.task("curl -v -X DELETE  http://localhost:8080/src/file.txt"));
gulp.task("mkcol", shell.task("curl -v -X MKCOL http://localhost:8080/src/ejemplo"));

gulp.task("doc", shell.task("documentation build src/** -f html -o docs"));
gulp.task("docserver", shell.task("documentation serve --port 8081 src/*.js"));