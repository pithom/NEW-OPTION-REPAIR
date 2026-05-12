import Customer from '../models/Customer.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  normalizeEmail,
  normalizeObjectId,
  normalizeOptionalString,
  normalizePhone,
  normalizeString
} from '../utils/validation.js';

const buildCustomerPayload = (payload) => ({
  name: normalizeString(payload.name, {
    field: 'Customer name',
    required: true,
    max: 120
  }),
  phoneNumber: normalizePhone(payload.phoneNumber, {
    field: 'Phone number',
    required: true
  }),
  email: normalizeEmail(payload.email),
  address: normalizeOptionalString(payload.address, {
    field: 'Address',
    max: 240
  }),
  notes: normalizeOptionalString(payload.notes, {
    field: 'Notes',
    max: 1200
  })
});

export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json(customers);
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(buildCustomerPayload(req.body));
  res.status(201).json(customer);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customerId = normalizeObjectId(req.params.id, { field: 'Customer id', required: true });
  const customer = await Customer.findByIdAndUpdate(customerId, buildCustomerPayload(req.body), {
    new: true,
    runValidators: true
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found.');
  }

  res.json(customer);
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customerId = normalizeObjectId(req.params.id, { field: 'Customer id', required: true });
  const customer = await Customer.findByIdAndDelete(customerId);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found.');
  }

  res.json({ message: 'Customer deleted successfully.' });
});
