const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: 'User' },
    reportedPost: { type: Schema.Types.ObjectId, ref: 'Post' },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'resolved', 'dismissed'], 
        default: 'pending' 
    },
    handledBy: { type: Schema.Types.ObjectId, ref: 'User' } // Admin/Moderator
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
