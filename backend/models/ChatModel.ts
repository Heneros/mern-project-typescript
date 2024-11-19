import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: [String],
    sender: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        ref: 'User',
    },
}, {timestamps: true});


const chatSchema = new mongoose.Schema({})