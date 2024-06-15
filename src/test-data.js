// Importing the fs module
const fs = require('fs');
// Importing util module
const util = require('util');
// Both of these will allow promise-ified node file operations?
const path = require('path');

class DataToucher{
    #todos;
    constructor(myPath){
        this.path = path.join(__dirname, myPath);
        this.readFile = util.promisify(fs.readFile);
        this.saveFile = util.promisify(fs.writeFile);
        this.#todos = null;
        this.readTodos();
    }
    
    readTodos(){
        this.readFile(this.path, 'utf-8')
        .then((data) => {
            console.log(`reading file now ${JSON.stringify(data)}`);
            this.#todos = JSON.parse(data);
        })
        .catch((err) => {
            console.warn('error in reading file');
            console.error(err);
        })
       
    }

    saveTodos(newData){
        this.saveFile(this.path, JSON.stringify(newData), 'utf-8')
        .then((data) => {
            console.log(`writing file now ${JSON.stringify(data)}`);
            this.#todos = JSON.parse(data);
        })
        .catch((err) => {
            console.warn('error in writing file');
            console.error(err);
        })
    }

    set todos(newData){
        this.#todos = newData;
    }



    get todos(){
        console.log(`this.todos in obj instance is ${typeof(this.#todos)} ${JSON.stringify(this.#todos)}`);
        return (this.#todos);
    }
}

module.exports = DataToucher;