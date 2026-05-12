import Technician from '../models/Technician.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  normalizeBoolean,
  normalizeEmail,
  normalizeObjectId,
  normalizeOptionalString,
  normalizePhone,
  normalizeString
} from '../utils/validation.js';

const buildTechnicianPayload = (payload) => ({
  name: normalizeString(payload.name, {
    field: 'Technician name',
    required: true,
    max: 120
  }),
  phoneNumber: normalizePhone(payload.phoneNumber, {
    field: 'Phone number'
  }),
  email: normalizeEmail(payload.email),
  specialty: normalizeOptionalString(payload.specialty, {
    field: 'Specialty',
    max: 160
  }),
  active: normalizeBoolean(payload.active, { defaultValue: true })
});

export const getTechnicians = asyncHandler(async (req, res) => {
  const technicians = await Technician.find().sort({ createdAt: -1 });
  res.json(technicians);
});

export const createTechnician = asyncHandler(async (req, res) => {
  const technician = await Technician.create(buildTechnicianPayload(req.body));
  res.status(201).json(technician);
});

export const updateTechnician = asyncHandler(async (req, res) => {
  const technicianId = normalizeObjectId(req.params.id, { field: 'Technician id', required: true });
  const technician = await Technician.findByIdAndUpdate(technicianId, buildTechnicianPayload(req.body), {
    new: true,
    runValidators: true
  });

  if (!technician) {
    res.status(404);
    throw new Error('Technician not found.');
  }

  res.json(technician);
});

export const deleteTechnician = asyncHandler(async (req, res) => {
  const technicianId = normalizeObjectId(req.params.id, { field: 'Technician id', required: true });
  const technician = await Technician.findByIdAndDelete(technicianId);

  if (!technician) {
    res.status(404);
    throw new Error('Technician not found.');
  }

  res.json({ message: 'Technician deleted successfully.' });
});
