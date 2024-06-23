
const express = require('express');
const router = express.Router();
const DataToucher = require('./test-data.js')
const WaveVibes = require('./waves-data.js');
const dataPath = '../public/asset/testData.json' || process.env.testData;

//instantiate class that interacts with files
let todoData = new DataToucher(dataPath);
//this is also temporary
let todos = null;


//instantiate class that creates waves and blocks
const blockManager = new WaveVibes.BlockManager();
const blockController = new WaveVibes.BlockController(blockManager);

blockController.setupRoutes(router);

router
    .use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    })
    .get('/todos', async (req,res) => {
        try{
            todos = await todoData.todos
            res.status(200).json(todos);
        } catch (error){
            console.error("can't get ", error)
        }
    })
    .get('/todos/:id', function(req, res) {
        try {
            const id = parseInt(req.params.id);
            const todo = todos.find(t => t.id === id);

            if(!todo){
                res.status(404).send('NOT FOUND! (┬┬﹏┬┬)');
                return;
            }
            res.status(200).json(todo)
        } catch (error) {
            console.error('cant get', error);
        }
    })
    .post('/todos', async (req, res) => {
        const newTodo = { id: todos.length + 1, task: req.body.task };
        try {
            todos.push(newTodo);
            todos = await todoData.saveTodos(todos);
        }catch (error) {
            console.error('Failed to create todo', error);
        }finally {
            res.status(201).json(newTodo);
        }

    })
    .put('/todos/:id', async (req,res) => {
        try {
            const id = parseInt(req.params.id);
            const todo = todos.find(t => t.id === id);

            if(!todo){
                res.status(404).send('NOT FOUND! (┬┬﹏┬┬)');
                return;
            }
            console.log('task ' + req.body.task);
            todo.task = req.body.task;
        } catch (error) {
            console.error('failed to make edit ', error);
        } finally {
            todos = await todoData.saveTodos(todos);
            res.status(200).json(todo);
        }
    })
    .delete('/todos/:id', async (req,res) => {
        console.log(`trying to delete ${JSON.stringify(todos[req.params.id])}`)
        try{
            const id = parseInt(req.params.id);
            todos = todos.filter(t => t.id !== id);
            
        } catch (error) {
            console.error('failed to delete ( ´･･)ﾉ(._.`) ', error);
        } finally {
            todos = await todoData.saveTodos(todos);
            res.status(204).send();
        }
    });

module.exports = router;

