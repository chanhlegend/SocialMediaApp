const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, trim: true },
    media: [{ // For images, videos
        type: { type: String, enum: ['image', 'video'], required: true },
        url: { type: String, required: true }
    }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
