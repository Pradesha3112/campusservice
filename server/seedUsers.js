const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Delete existing admin and staff if any
    await User.deleteMany({ email: { $in: ['admin@campus.com', 'staff@campus.com'] } });

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@campus.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created: admin@campus.com / admin123');

    // Create staff
    const staff = await User.create({
      name: 'Staff Member',
      email: 'staff@campus.com',
      password: 'staff123',
      role: 'staff',
      department: 'Electrical',
      capacity: 5,
      currentLoad: 0,
      availability: true,
    });
    console.log('Staff created: staff@campus.com / staff123');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error.message);
    process.exit(1);
  }
};

seedUsers();
