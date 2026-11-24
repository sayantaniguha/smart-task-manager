const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    bulkUpdateStatus
} = require('../controllers/taskController');

router.post('/', createTask);
router.get('/', getTasks);
router.patch('/bulk-status', bulkUpdateStatus); // Must be before /:id
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;