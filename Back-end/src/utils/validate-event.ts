import { User } from '@prisma/client';
import { prisma } from 'lib/prisma';

export async function validateEvent(user: User, updatedUser: User) {
  const changes: string[] = [];
  const fieldsToCheck: Array<keyof User> = [
    'name',
    'email',
    'street',
    'number',
    'zipCode',
    'city',
    'state',
    'sex',
    'phone',
    'birthDate',
  ];

  fieldsToCheck.forEach((field) => {
    if (user[field] !== updatedUser[field]) {
      changes.push(
        `The field ${field} has been changed from ${user[field]} to ${updatedUser[field]}`
      );
    }
  });

  if (changes.length > 0) {
    for (const change of changes) {
      await prisma.history.create({
        data: {
          event: change,
          date: new Date().toISOString(),
          userId: user.id,
        },
      });
    }
  }
}
