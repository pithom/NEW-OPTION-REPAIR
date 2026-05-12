import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 24
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254
    },
    address: {
      type: String,
      trim: true,
      maxlength: 240
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1200
    }
  },
  {
    timestamps: true
  }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
