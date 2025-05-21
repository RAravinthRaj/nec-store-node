/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/user.model';
import { Role } from '../src/config/enum.config';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model - Utils Test', () => {
  it('should create a valid user with default role', async () => {
    const user = await User.create({
      rollNumber: 'NEC123',
      name: 'Aravinth Raj',
      department: 'CSE',
      email: 'aravinth@nec.edu.in',
    });

    expect(user.roles).toEqual([Role.Customer]);
  });

  it('should not create a user with empty fields', async () => {
    try {
      await User.create({
        rollNumber: '',
        name: '',
        department: '',
        email: '',
      });
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.errors.rollNumber).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.department).toBeDefined();
    }
  });

  it('should not allow duplicate email', async () => {
    await User.create({
      rollNumber: 'NEC001',
      name: 'User1',
      department: 'IT',
      email: 'user@example.com',
    });

    let error;
    try {
      await User.create({
        rollNumber: 'NEC002',
        name: 'User2',
        department: 'ECE',
        email: 'user@example.com',
      });
    } catch (err: any) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });

  it('should trim whitespace and store clean data', async () => {
    const user = await User.create({
      rollNumber: ' NEC321 ',
      name: ' Aravinth ',
      department: 'IT',
      email: ' aravinth@nec.edu ',
    });

    expect(user.rollNumber).toBe(' NEC321 ');
  });
});
