const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ deadline: 1 });
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Create task
router.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task' });
    }
});

// Update task
router.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error updating task' });
    }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = router;