const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    // For video calls
    videoCall: {
        active: { type: Boolean, default: false },
        roomId: { type: String },
        startedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
