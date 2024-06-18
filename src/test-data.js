// Importing the fs module with promises
const fs = require('node:fs/promises');
const path = require('path');

class DataToucher{
    #todos;
    constructor(myPath){
        this.path = path.join(__dirname, myPath);

        this.#todos = null;
        this.readTodos();
    }
    
    _readTodos(){
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

    async readTodos(){
        try {
            let data = await fs.readFile(this.path, {encoding: 'utf-8'});
            this.#todos = JSON.parse(data);
        } catch(err){
            console.error(err);
        }
    }

    async saveTodos(newData){
        //this.saveFile(this.path, JSON.stringify(newData), 'utf-8')
        console.log(`new data recieved to save: ${JSON.stringify(newData)}`)
        try{
            await fs.writeFile(this.path, `${JSON.stringify(newData)}`,{encoding: 'utf-8'});
            this.#todos = newData;
            return this.#todos;
        }
        catch(err){
            console.error(err);
        }
       
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