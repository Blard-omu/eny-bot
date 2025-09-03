import User, { UserRole } from '../../app/models/user.model';
import logger from '../../utils/logger';
import { hashPassword } from '../../utils/helper/auth';

export const createSeedUsers = async () => {
  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    logger.info('✅ Seed users already exist.');
    return;
  }

  const users = [
    // Admin
    {
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      phone: '+2348000000001',
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      role: UserRole.ADMIN,
      isVerified: true,
      isAdmin: true,
    },

    // Users
    {
      firstName: 'Peter',
      lastName: 'Omu',
      username: 'Blard',
      phone: '+2348000000002',
      email: 'blard@example.com',
      password: await hashPassword('blard123'),
      role: UserRole.USER,
      isVerified: true,
    },
    
  ];

  await User.insertMany(users);
  logger.info('🌱 Seed users created successfully.');
};
