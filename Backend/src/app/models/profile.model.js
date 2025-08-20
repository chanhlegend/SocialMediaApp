const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, maxlength: 250 },
    dateOfBirth: { type: Date },
    avatar: { type: String, default: 'default_avatar.png' },
    coverPhoto: { type: String, default: 'default_cover.png' },
    profilePrivacy: { 
        type: String, 
        enum: ['public', 'private'], 
        default: 'public' 
    },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    profileVisitors: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        visitedAt: { type: Date, default: Date.now }
    }],
    // Premium feature for profile customization
    theme: {
        color: { type: String },
        font: { type: String }
    }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
