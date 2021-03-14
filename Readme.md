## Fortuna assignment
An assignment for the job position of frontend web developer. 

## Running the app
To run the app do the following:
1. restore node modules: `npm install`
2. compile scss to css. It can be done with the command:
```shell
    npm run scss-compile
```
Scss files can be auto-compiled when they are changed by running the following command:
```shell
    npm run scss
```
3. run a server. The simplest approach is to run the server that comes with a Python installation.
Simply run the server from the project folder:
```shell
    python3 -m http.Server
```
You can also run a server using npm with the command: 
```shell
    npx serve
```
without installing the package.

4. go to the address, e.g. `http://localhost:8000` (for Python) or `http://localhost:5000` for npx serve.


The web page should look something like the one presented in the gif below:
![](cats.gif)
