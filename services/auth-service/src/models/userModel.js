import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: String,
        phone: String,
        email: String,
        password: String,
        role: {
            type: String,
            default: 'client',
        },
        status: {
            type: String,
            default: 'active',
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    },
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
