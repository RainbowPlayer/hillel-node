const express = require('express');
const router = express.Router();

const { readTasks, writeTasks } = require('../services/taskService');
const validateTask = require('../middleware/validateTask');

router.get('/', async (req, res, next) => {
  try {
    res.json(await readTasks());
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === +req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
  } catch (err) { next(err); }
});

router.post('/', validateTask, async (req, res, next) => {
  try {
    const tasks = await readTasks();
    const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask = {
      id,
      title:       req.body.title,
      description: req.body.description || '',
      status:      req.body.status || 'todo',
      createdAt:   new Date().toISOString()
    };
    tasks.push(newTask);
    await writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (err) { next(err); }
});

router.put('/:id', validateTask, async (req, res, next) => {
  try {
    const tasks = await readTasks();
    const idx = tasks.findIndex(t => t.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    tasks[idx] = { ...tasks[idx], ...req.body };
    await writeTasks(tasks);
    res.json(tasks[idx]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const tasks = await readTasks();
    const idx = tasks.findIndex(t => t.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const [deleted] = tasks.splice(idx, 1);
    await writeTasks(tasks);
    res.json(deleted);
  } catch (err) { next(err); }
});

module.exports = router;
