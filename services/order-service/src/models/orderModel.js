import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: String,
        buyerInfo: {
            name: String,
            email: String,
            phone: String,
        },
        eventId: mongoose.Schema.Types.ObjectId,
        orderCode: String,
        totalPrice: Number,
        tickets: [
            {
                ticketId: mongoose.Schema.Types.ObjectId,
                name: String,
                quantity: Number,
                price: Number,
            },
        ],
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'CANCELED', 'EXPIRED'],
            default: 'PENDING',
        },
        expiredAt: Date,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel;
