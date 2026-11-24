const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['todo', 'in_progress', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    due_date: {
        type: Date,
        default: null
    },
    tags: {
        type: [String],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('Task', taskSchema);
