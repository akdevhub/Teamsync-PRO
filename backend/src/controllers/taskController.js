const Task = require('../models/Task');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        const query = { owner: req.user.id };

        if (req.query.keyword) {
            query.title = {
                $regex: req.query.keyword,
                $options: 'i'
            };
        }

        if (req.query.status) {
            query.status = req.query.status;
        }

        const tasks = await Task.find(query).populate('project', 'name');
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('project', 'name');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(task);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, project, assignee } = req.body;
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            project: project || null,
            assignee: assignee || null,
            owner: req.user.id
        });
        
        // Populate project before sending response if it exists
        if(task.project) {
             await task.populate('project', 'name');
        }
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, project, assignee } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.project = project !== undefined ? project : task.project;
        task.assignee = assignee !== undefined ? assignee : task.assignee;

        const updatedTask = await task.save();
        
        if(updatedTask.project) {
            await updatedTask.populate('project', 'name');
        }

        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Task.deleteOne({ _id: req.params.id });
        res.json({ message: 'Task removed' });
    } catch (error) {
        next(error);
    }
};
