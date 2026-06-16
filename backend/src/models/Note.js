const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Please add a note title'] 
    },
    content: { 
        type: String, 
        required: [true, 'Please add some content'] 
    },
    category: { 
        type: String, 
        enum: ['General', 'Meeting', 'Idea', 'Resource'], 
        default: 'General' 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
