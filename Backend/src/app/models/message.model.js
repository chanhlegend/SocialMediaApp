const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    media: [{
        type: { type: String, enum: ['image', 'video', 'file'] },
        url: { type: String },
        fileName: { type: String }
    }],
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
