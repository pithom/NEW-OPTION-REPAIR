import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { seedDefaults } from './utils/seedDefaults.js';

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('MongoDB connected successfully');

    await seedDefaults();
    console.log('Default data seeded');

    const port = process.env.PORT || env.port || 5000;

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
