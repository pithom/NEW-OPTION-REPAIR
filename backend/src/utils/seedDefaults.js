import { env } from '../config/env.js';
import Customer from '../models/Customer.js';
import Technician from '../models/Technician.js';
import User from '../models/User.js';

export const seedDefaults = async () => {
  const adminUser = await User.findOne({ email: env.admin.email.toLowerCase() });

  if (!adminUser) {
    await User.create({
      name: env.admin.name,
      email: env.admin.email,
      password: env.admin.password,
      phone: env.admin.phone,
      role: 'admin'
    });
  }

  const aphrodis = await Technician.findOne({ name: 'APHRODIS NIYONZIMA' });

  if (!aphrodis) {
    await Technician.create({
      name: 'APHRODIS NIYONZIMA',
      email: 'newoptiontechnology@gmail.com',
      phoneNumber: '+250 788 790 756',
      specialty: 'Laptop diagnostics, board repair, and software support',
      active: true
    });
  }

  const houseCustomer = await Customer.findOne({ name: 'Walk-in Customer' });

  if (!houseCustomer) {
    await Customer.create({
      name: 'Walk-in Customer',
      phoneNumber: '+250 780 528 761',
      email: 'newoptiontechnology@gmail.com',
      address: 'Kigali, Rwanda',
      notes: 'Default record for quick repair intake.'
    });
  }
};
