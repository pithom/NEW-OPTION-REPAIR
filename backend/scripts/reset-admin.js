import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database.js';
import { env } from '../src/config/env.js';
import User from '../src/models/User.js';

function pickArg(name) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

const targetEmail = (pickArg('email') || env.admin.email).toLowerCase().trim();
const password = pickArg('password') || env.admin.password;
const name = pickArg('name') || env.admin.name;
const phone = pickArg('phone') || env.admin.phone;

if (!targetEmail) {
  console.error('Missing admin email. Provide --email=you@example.com or set ADMIN_EMAIL.');
  process.exit(1);
}

if (!password || password.length < 4) {
  console.error('Admin password must be at least 4 chars. Provide --password=... or set ADMIN_PASSWORD.');
  process.exit(1);
}

async function main() {
  await connectDatabase();

  const deleted = await User.deleteOne({ email: targetEmail });
  const created = await User.create({
    name,
    email: targetEmail,
    password,
    phone,
    role: 'admin'
  });

  console.log('Admin account reset OK');
  console.log(`Deleted: ${deleted.deletedCount}`);
  console.log(`Created: ${created.email} (id=${created._id})`);
}

main()
  .catch((err) => {
    console.error('Reset admin failed:', err?.message || err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
  });

