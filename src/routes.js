//test data
let todos = [
    { id: 1, task: 'Eat Bees' },
    { id: 2, task: 'Go Back in Time' },
];

const express = require('express');
const router = express.Router();
const fs = require('fs');

router
    .use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    })
    //binding
    .get('/', function (req,res){
        //render view;
        res.render('index', { title: 'Route Separation Example', body: JSON.stringify(req) });
    })
    .get('/api/todos', function(req, res) {
        try {
            res.status(200).json(todos)
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
    .put('api/todos/:id', (req,res) => {
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
    .delete('/api/todos/:id', (req,res) => {
        try{
            const id = parseInt(req.params.id);
            todos = todos.filter(t => t.id !== id);

            res.status(204).send();
        } catch (error) {
            console.error('failed to delete ( ´･･)ﾉ(._.`) ', error);
        }
    })