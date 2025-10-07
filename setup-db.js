import { setupDatabase } from './src/utils/setupDb.js';

// Run the database setup
console.log('Starting database setup...');
setupDatabase()
  .then(result => {
    if (result) {
      console.log('✅ Database setup completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Database setup failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  });