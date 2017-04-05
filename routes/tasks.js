const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('mongodb://nathan:nathan@ds151820.mlab.com:51820/tasklist_nathan', ['tasks'])


//Get all tasks
router.get('/tasks', function(req, res, next) {
  db.tasks.find(function(err, tasks) {
    if(err){
      res.send(err);
    }
    res.json(tasks);
  });
});

//Get single tasks
router.get('/task/:id', function(req, res, next) {
  db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
    if(err){
      res.send(err);
    }
    res.json(task);
  });
});

//Save tasks
router.post('/task', function(req, res, next) {
  const task = req.body;
  if(!task.title || (task.isDone + '')) {
    res.status(400);
    res.json({
      "error": "Bad data"
    });
  } else {
    db.tasks.save(task, function(err, task) {
      if(err){
        res.send(err);
      }
    });
  }
});

//Delete task
router.delete('/task/:id', function(req, res, next) {
  db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
    if(err){
      res.send(err);
    }
    res.json(task);
  });
});

//Update task
router.put('/task/:id', function(req, res, next) {
  const task = req.body;
  const updTask = {};

  if (task.isDone){
    updTask.isDone = task.isDone;
  }
  if (task.title){
    updTask.title = task.title;
  }

  if(!updTask) {
    res.status(400);
    res.json({
      "error":"Bad data"
    });
  } else {
    db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {}, function(err, task) {
      if(err){
        res.send(err);
      }
      res.json(task);
    });
  }
});

module.exports = router;
