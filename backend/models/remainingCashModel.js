import mongoose from "mongoose";
const { Schema, model } = mongoose


const cashSchema = new Schema({
    denomination: { type: Number, required: true },
    count: { type: Number, required: true },
    total: { type: Number, required: true }
})

const remainingCashSchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    notes: [cashSchema],
    coins: [cashSchema],
    totalRemainingCash: { type: Number, required: true },
    remarks: { type: String, default: '' }
}, { timestamps: true })

const RemCash = model('RemCash' , remainingCashSchema)

export default RemCash