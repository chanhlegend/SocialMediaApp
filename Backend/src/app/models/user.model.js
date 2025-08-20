const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    // --- Basic Information ---
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    
    // --- Authentication & Security ---
    googleId: { type: String },
    facebookId: { type: String },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    // --- Roles & Permissions ---
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },

    // --- References to other models ---
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
    socialGraph: { type: Schema.Types.ObjectId, ref: 'SocialGraph' },
    premium: { type: Schema.Types.ObjectId, ref: 'Premium' },

    // --- Activity Status ---
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
