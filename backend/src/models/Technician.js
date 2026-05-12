import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    phoneNumber: {
      type: String,
      trim: true,
      maxlength: 24
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254
    },
    specialty: {
      type: String,
      trim: true,
      maxlength: 160
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Technician = mongoose.model('Technician', technicianSchema);

export default Technician;
