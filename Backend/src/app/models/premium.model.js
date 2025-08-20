const mongoose = require('mongoose');
const { Schema } = mongoose;

const premiumSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    isPremium: { type: Boolean, default: false },
    subscription: {
        plan: { type: String, enum: ['monthly', 'yearly'] },
        startedAt: { type: Date },
        expiresAt: { type: Date },
        paymentInfo: { type: Schema.Types.ObjectId, ref: 'Payment' }
    }
}, { timestamps: true });

const Premium = mongoose.model('Premium', premiumSchema);

module.exports = Premium;
