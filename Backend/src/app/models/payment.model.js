const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    paymentMethod: { type: String, enum: ['card', 'paypal', 'wallet'], required: true },
    transactionId: { type: String, required: true, unique: true }, // From payment gateway
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    },
    subscriptionPlan: { type: String, enum: ['monthly', 'yearly'] }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
