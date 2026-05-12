import Customer from '../models/Customer.js';
import Repair from '../models/Repair.js';
import Technician from '../models/Technician.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createHttpError } from '../utils/httpError.js';
import {
  normalizeDate,
  normalizeEnum,
  normalizeNumber,
  normalizeObjectId,
  normalizeOptionalString,
  normalizePhone,
  normalizeString
} from '../utils/validation.js';

const repairStatuses = ['Pending', 'Diagnosed', 'In Progress', 'Completed', 'Delivered'];

const buildRepairPayload = async (payload) => {
  const customerId = normalizeObjectId(payload.customerId, { field: 'Customer' });
  const technicianId = normalizeObjectId(payload.technicianId, { field: 'Technician' });
  const returnOfId = normalizeObjectId(payload.returnOfId, { field: 'Return repair record' });

  const customer = customerId ? await Customer.findById(customerId) : null;
  const technician = technicianId ? await Technician.findById(technicianId) : null;
  const returnOf = returnOfId ? await Repair.findById(returnOfId) : null;

  if (customerId && !customer) {
    throw createHttpError(400, 'Selected customer was not found.');
  }

  if (technicianId && !technician) {
    throw createHttpError(400, 'Selected technician was not found.');
  }

  if (returnOfId && !returnOf) {
    throw createHttpError(400, 'The original repair record was not found.');
  }

  const returnSequence = returnOf ? (Number(returnOf.returnSequence || 0) + 1) : 0;

  return {
    returnOf: returnOf?._id || null,
    returnSequence,
    customer: customer?._id || null,
    customerName: normalizeString(payload.customerName || customer?.name, {
      field: 'Customer name',
      required: true,
      max: 120
    }),
    phoneNumber: normalizePhone(payload.phoneNumber || customer?.phoneNumber, {
      field: 'Phone number',
      required: true
    }),
    laptopBrand: normalizeString(payload.laptopBrand, {
      field: 'Laptop brand',
      required: true,
      max: 80
    }),
    model: normalizeString(payload.model, {
      field: 'Model',
      required: true,
      max: 120
    }),
    problemDescription: normalizeString(payload.problemDescription, {
      field: 'Problem description',
      required: true,
      max: 2000
    }),
    status: normalizeEnum(payload.status, {
      field: 'Status',
      allowed: repairStatuses,
      defaultValue: 'Pending'
    }),
    technician: technician?._id || null,
    technicianName: normalizeOptionalString(technician?.name || payload.technicianName, {
      field: 'Technician name',
      max: 120
    }),
    intakeDate: normalizeDate(payload.intakeDate, {
      field: 'Intake date'
    }) || new Date(),
    diagnosisDate: normalizeDate(payload.diagnosisDate, {
      field: 'Diagnosis date'
    }),
    completionDate: normalizeDate(payload.completionDate, {
      field: 'Completion date'
    }),
    deliveryDate: normalizeDate(payload.deliveryDate, {
      field: 'Delivery date'
    }),
    estimatedCost: normalizeNumber(payload.estimatedCost, {
      field: 'Estimated cost',
      min: 0
    }),
    finalCost: normalizeNumber(payload.finalCost, {
      field: 'Final cost',
      min: 0
    }),
    notes: normalizeOptionalString(payload.notes, {
      field: 'Notes',
      max: 1600
    })
  };
};

export const getRepairs = asyncHandler(async (req, res) => {
  const repairs = await Repair.find()
    .populate('returnOf', 'customerName phoneNumber laptopBrand model status createdAt')
    .populate('customer', 'name phoneNumber email')
    .populate('technician', 'name specialty')
    .sort({ createdAt: -1 });

  res.json(repairs);
});

export const createRepair = asyncHandler(async (req, res) => {
  const repair = await Repair.create(await buildRepairPayload(req.body));
  const populated = await repair.populate([
    { path: 'returnOf', select: 'customerName phoneNumber laptopBrand model status createdAt' },
    { path: 'customer', select: 'name phoneNumber email' },
    { path: 'technician', select: 'name specialty' }
  ]);

  res.status(201).json(populated);
});

export const updateRepair = asyncHandler(async (req, res) => {
  const repairId = normalizeObjectId(req.params.id, { field: 'Repair id', required: true });
  const repair = await Repair.findById(repairId);

  if (!repair) {
    res.status(404);
    throw new Error('Repair not found.');
  }

  Object.assign(repair, await buildRepairPayload(req.body));
  await repair.save();

  const populated = await repair.populate([
    { path: 'returnOf', select: 'customerName phoneNumber laptopBrand model status createdAt' },
    { path: 'customer', select: 'name phoneNumber email' },
    { path: 'technician', select: 'name specialty' }
  ]);

  res.json(populated);
});

export const deleteRepair = asyncHandler(async (req, res) => {
  const repairId = normalizeObjectId(req.params.id, { field: 'Repair id', required: true });
  const repair = await Repair.findByIdAndDelete(repairId);

  if (!repair) {
    res.status(404);
    throw new Error('Repair not found.');
  }

  res.json({ message: 'Repair deleted successfully.' });
});
