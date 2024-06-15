
const express = require('express');
const router = express.Router();
const DataToucher = require('./test-data.js')
const dataPath = '../public/asset/testData.json' || process.env.testData;

//instantiate class that interacts with files
let todoData = new DataToucher(dataPath);
//replace this manual read with something automatic;
//todoData.readTodos();
//this is also temporary
let todos = null;

router
    .use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    })
    // .get('/todos', function(req, res) {
    //     try {
    //         res.status(200).json(todos)
    //     } catch (error) {
    //         console.error('cant get', error);
    //     }
    // })
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
    .post('/api/todos', (req, res) => {
        try {
            const newTodo = { id: todos.length + 1, task: req.body.task };
            todos.push(newTodo);
            res.status(201).json(newTodo);
        } catch (error) {
            console.error('Failed to create todo', error);
        }
    })
    .put('/todos/:id', (req,res) => {
        try {
            const id = parseInt(req.params.id);
            const todo = todos.find(t => t.id === id);

            if(!todo){
                res.status(404).send('NOT FOUND! (┬┬﹏┬┬)');
                return;
            }
            console.log('task ' + req.body.task);
            todo.task = req.body.task;
            res.status(200).json(todo);
        } catch (error) {
            console.error('failed to make edit ', error);
        }
    })
    .delete('/todos/:id', (req,res) => {
        try{
            const id = parseInt(req.params.id);
            todos = todos.filter(t => t.id !== id);

            res.status(204).send();
        } catch (error) {
            console.error('failed to delete ( ´･･)ﾉ(._.`) ', error);
        }
    });

module.exports = router;

