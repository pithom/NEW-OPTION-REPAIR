import mongoose from 'mongoose';

const repairSchema = new mongoose.Schema(
  {
    returnOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repair',
      default: null
    },
    returnSequence: {
      type: Number,
      default: 0
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    customerName: {
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
    laptopBrand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    problemDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    status: {
      type: String,
      enum: ['Pending', 'Diagnosed', 'In Progress', 'Completed', 'Delivered'],
      default: 'Pending'
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
      default: null
    },
    technicianName: {
      type: String,
      trim: true,
      maxlength: 120
    },
    intakeDate: {
      type: Date,
      default: Date.now
    },
    diagnosisDate: Date,
    completionDate: Date,
    deliveryDate: Date,
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0
    },
    finalCost: {
      type: Number,
      default: 0,
      min: 0
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1600
    },
    paidStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

const Repair = mongoose.model('Repair', repairSchema);

export default Repair;
