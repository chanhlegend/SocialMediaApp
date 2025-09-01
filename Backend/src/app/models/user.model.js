const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    // --- Basic Information ---
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'non-active', 'banned'], default: 'non-active' },

    // --- OTP & Two-Factor Authentication ---
    otp: { type: String },
    otpExpires: { type: Date },

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
    lastLogin: { type: Date },

    // --- JWT & Authentication ---
    refreshToken: { type: String },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
