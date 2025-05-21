/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import User from '@/src/models/user.model';
import { JwtService } from '@/src/services/jwt.service';
import { Request } from 'express';
import { Role, UserStatus } from '@/src/config/enum.config';

interface Context {
  req: Request;
}

interface UpdateUserInput {
  email?: string;
  name?: string;
  rollNumber?: string;
  department?: string;
  profilePicture?: string | null;
  roles?: Role[];
  status?: UserStatus;
}

export const updateUser = async (
  _: any,
  { input }: { input: UpdateUserInput },
  context: Context,
) => {
  const jwtUser = (context.req as any).user;

  const user = await User.findOne({ email: jwtUser.email });
  if (!user) {
    throw new Error('User not found.');
  }

  const isAdmin = user.roles?.includes(Role.Admin) ?? false;

  if (isAdmin && !input.email) {
    throw new Error('Email is required.');
  }

  let targetUserEmail = user.email;
  if (isAdmin && input.email) {
    targetUserEmail = input.email;
  }

  if (!isAdmin) {
    if (input.roles !== undefined || input.status !== undefined) {
      throw new Error("You don't have enough permission to perform this operation.");
    }
    if (input.email && input.email !== user.email) {
      throw new Error("You don't have enough permission to perform this operation.");
    }
  }

  const userToUpdate = await User.findOne({ email: targetUserEmail });
  if (!userToUpdate) {
    throw new Error('User not found.');
  }

  const fieldsToUpdate: Partial<UpdateUserInput> = {};
  if (input.name) fieldsToUpdate.name = input.name;
  if (input.rollNumber) fieldsToUpdate.rollNumber = input.rollNumber;
  if (input.department) fieldsToUpdate.department = input.department;
  if (input.profilePicture !== undefined) fieldsToUpdate.profilePicture = input.profilePicture;

  if (isAdmin) {
    if (input.roles) {
      const oldRoles = userToUpdate.roles ?? [];
      const newRoles = input.roles;

      const mergedRoles = Array.from(new Set([...oldRoles, ...newRoles]));
      fieldsToUpdate.roles = mergedRoles;
    }
    if (input.status) fieldsToUpdate.status = input.status;
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: targetUserEmail },
    { $set: fieldsToUpdate },
    { new: true },
  );

  if (!updatedUser) {
    throw new Error('Update failed. User may no longer exist.');
  }

  let newToken: string | undefined;
  if (!isAdmin && (input.name || input.rollNumber || input.department || input.email)) {
    const payload = {
      name: updatedUser.name,
      rollNumber: updatedUser.rollNumber,
      department: updatedUser.department,
      email: updatedUser.email,
    };
    newToken = JwtService.getInstance().generateToken(payload);
  }

  return {
    success: true,
    message: 'User updated successfully.',
    token: newToken,
  };
};
