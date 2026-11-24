const Task = require('../models/Task');

// 1. Create a task
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 2. List tasks (filtering, pagination, sorting by due_date)
exports.getTasks = async (req, res) => {
    try {
        const { status, priority, tag, page = 1, limit = 10, sort = 'asc' } = req.query;

        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (tag) filter.tags = tag; // Matches tasks containing this tag in the array

        // Pagination setup
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.max(1, parseInt(limit, 10));
        const skip = (pageNum - 1) * limitNum;

        // Sort by due_date ('asc' or 'desc')
        const sortOrder = sort === 'desc' ? -1 : 1;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort({ due_date: sortOrder })
                .skip(skip)
                .limit(limitNum),
            Task.countDocuments(filter)
        ]);

        res.status(200).json({
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: tasks
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Get a single task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ error: 'Invalid task ID' });
    }
};

// 4. Update a task (partial update)
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 5. Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid task ID' });
    }
};

// 6. Bulk-update status for a list of task IDs
exports.bulkUpdateStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'ids must be a non-empty array' });
        }
        if (!['todo', 'in_progress', 'done'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const result = await Task.updateMany(
            { _id: { $in: ids } },
            { $set: { status } }
        );

        res.status(200).json({
            message: 'Tasks updated successfully',
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
