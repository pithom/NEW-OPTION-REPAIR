import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: emailPattern
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      select: false
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 24
    },
    passwordResetOtpHash: {
      type: String,
      default: null,
      select: false
    },
    passwordResetOtpExpiresAt: {
      type: Date,
      default: null,
      select: false
    },
    passwordResetOtpAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    passwordResetLastSentAt: {
      type: Date,
      default: null,
      select: false
    },
    passwordResetTokenHash: {
      type: String,
      default: null,
      select: false
    },
    passwordResetTokenExpiresAt: {
      type: Date,
      default: null,
      select: false
    },
    role: {
      type: String,
      default: 'admin'
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
