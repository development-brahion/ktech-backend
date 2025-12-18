import mongoose from "mongoose";
const { Schema } = mongoose;

// Transaction Category Schema
const transactionCategoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Transaction Schema
const transactionSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'TransactionCategory',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["card", "cash", "cheque", "online", "other"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    remark: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true });

const TransactionCategory = mongoose.model('TransactionCategory', transactionCategoriesSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

export { Transaction, TransactionCategory };
