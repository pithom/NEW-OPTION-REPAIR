import mongoose from 'mongoose';

const paymentStatuses = ['Unpaid', 'Partial', 'Paid'];
const legacyPaidStatuses = ['Pending', 'Paid'];

const mapLegacyPaidStatus = (value) => {
  if (value === 'Paid') {
    return 'Paid';
  }

  if (value === 'Pending') {
    return 'Unpaid';
  }

  return undefined;
};

const normalizeSerializedRepair = (_, ret) => {
  if (!ret.paymentStatus) {
    ret.paymentStatus = mapLegacyPaidStatus(ret.paidStatus) || 'Unpaid';
  }

  delete ret.paidStatus;
  return ret;
};

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
    paymentStatus: {
      type: String,
      enum: paymentStatuses,
      default: 'Unpaid'
    },
    // Legacy field kept temporarily so older records still serialize correctly.
    paidStatus: {
      type: String,
      enum: legacyPaidStatuses,
      default: undefined
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: normalizeSerializedRepair
    },
    toObject: {
      transform: normalizeSerializedRepair
    }
  }
);

const Repair = mongoose.model('Repair', repairSchema);

export default Repair;
