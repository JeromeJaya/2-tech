import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/database';
import User from '../models/User';
import Plan from '../models/Plan';
import Addon from '../models/Addon';
import Slot from '../models/Slot';
import logger from '../utils/logger';

// Sample data
const adminUser = {
  email: 'admin@techvaseegrahhub.com',
  password: 'admin123456',
  name: 'Admin User',
  role: 'admin',
  phone: '+911234567890',
};

const plans = [
  {
    name: 'Basic Plan',
    description: 'Perfect for small celebrations',
    price: 2999,
    duration: 2,
    features: ['Basic decoration', 'Photo booth', 'Music system'],
    includes: ['Venue for 2 hours', 'Basic balloon decoration', 'Music setup'],
    isActive: true,
    displayOrder: 1,
  },
  {
    name: 'Standard Plan',
    description: 'Ideal for medium-sized events',
    price: 4999,
    duration: 3,
    features: ['Enhanced decoration', 'Photo booth', 'DJ system', 'Catering'],
    includes: ['Venue for 3 hours', 'Premium decoration', 'DJ and sound system', 'Snacks for 20'],
    isActive: true,
    isPopular: true,
    displayOrder: 2,
  },
  {
    name: 'Premium Plan',
    description: 'Ultimate celebration experience',
    price: 7999,
    duration: 4,
    features: ['Luxury decoration', 'Professional photography', 'DJ', 'Full catering', 'Gaming zone'],
    includes: [
      'Venue for 4 hours',
      'Luxury theme decoration',
      'Professional photographer',
      'DJ and lighting',
      'Catering for 30',
      'Gaming zone access',
    ],
    isActive: true,
    displayOrder: 3,
  },
];

const addons = [
  {
    name: 'Extra Hour',
    description: 'Extend your celebration by one hour',
    price: 500,
    category: 'Time Extension',
    isAvailable: true,
    displayOrder: 1,
  },
  {
    name: 'Cake (1kg)',
    description: 'Delicious celebration cake',
    price: 750,
    category: 'Food',
    isAvailable: true,
    displayOrder: 2,
  },
  {
    name: 'Balloon Bouquet',
    description: 'Beautiful balloon arrangement',
    price: 300,
    category: 'Decoration',
    isAvailable: true,
    displayOrder: 3,
  },
  {
    name: 'Photo Frames (Set of 10)',
    description: 'Printed photos with frames',
    price: 500,
    category: 'Photography',
    isAvailable: true,
    displayOrder: 4,
  },
  {
    name: 'Party Props',
    description: 'Fun party props for photos',
    price: 250,
    category: 'Entertainment',
    isAvailable: true,
    displayOrder: 5,
  },
];

// Generate slots for next 7 days
const generateSlots = () => {
  const slots = [];
  const timeSlots = [
    { name: 'Morning', startTime: '09:00', endTime: '12:00' },
    { name: 'Afternoon', startTime: '13:00', endTime: '16:00' },
    { name: 'Evening', startTime: '17:00', endTime: '20:00' },
    { name: 'Night', startTime: '21:00', endTime: '23:00' },
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);

    timeSlots.forEach((slot) => {
      slots.push({
        name: slot.name,
        startTime: slot.startTime,
        endTime: slot.endTime,
        date,
        isAvailable: true,
        maxCapacity: 1,
        currentBookings: 0,
      });
    });
  }

  return slots;
};

async function seed() {
  try {
    await connectDB();

    logger.info('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Addon.deleteMany({});
    await Slot.deleteMany({});
    logger.info('✅ Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await User.create({ ...adminUser, password: hashedPassword });
    logger.info('✅ Created admin user');
    logger.info(`   Email: ${adminUser.email}`);
    logger.info(`   Password: ${adminUser.password}`);

    // Create plans
    await Plan.insertMany(plans);
    logger.info(`✅ Created ${plans.length} plans`);

    // Create addons
    await Addon.insertMany(addons);
    logger.info(`✅ Created ${addons.length} addons`);

    // Create slots
    const slotsData = generateSlots();
    await Slot.insertMany(slotsData);
    logger.info(`✅ Created ${slotsData.length} slots for next 7 days`);

    logger.info('🎉 Database seeding completed successfully!');
    logger.info('\n📝 Admin Credentials:');
    logger.info(`   Email: ${adminUser.email}`);
    logger.info(`   Password: ${adminUser.password}`);
    logger.info('\n⚠️  Please change the admin password after first login!');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
