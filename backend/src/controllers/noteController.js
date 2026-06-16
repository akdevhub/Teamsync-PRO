const Note = require('../models/Note');

// @desc    Get all notes for user
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res, next) => {
    try {
        const query = { owner: req.user.id };

        if (req.query.keyword) {
            query.$or = [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { content: { $regex: req.query.keyword, $options: 'i' } }
            ];
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        const notes = await Note.find(query).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;
        const note = await Note.create({
            title,
            content,
            category,
            owner: req.user.id
        });
        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        note.title = title || note.title;
        note.content = content || note.content;
        note.category = category || note.category;

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Note.deleteOne({ _id: req.params.id });
        res.json({ message: 'Note removed' });
    } catch (error) {
        next(error);
    }
};
