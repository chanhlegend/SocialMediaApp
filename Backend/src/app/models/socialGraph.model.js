const mongoose = require('mongoose');
const { Schema } = mongoose;

const socialGraphSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const SocialGraph = mongoose.model('SocialGraph', socialGraphSchema);

module.exports = SocialGraph;
