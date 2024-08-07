import { z } from 'zod';

export const UserSchema = z.object({
	name: z.string().max(100, 'Name must be less than 100 characters').optional(),

	email: z
		.string()
		.email('Invalid email address')
		.nonempty('Email is required'),

	street: z
		.string()
		.max(200, 'Street must be less than 200 characters')
		.optional(),

	number: z
		.string()
		.max(10, 'Number must be less than 10 characters')
		.optional(),

	zipCode: z
		.string()
		// .regex(/^\d+$/, 'Postal code must be numeric')
		.optional(),

	city: z.string().max(100, 'City must be less than 100 characters').optional(),

	state: z.string().max(2, 'State must be exactly 2 characters').optional(),

	sex: z.string().max(50, 'Gender must be less than 50 characters').optional(),

	phone: z
		.string()
		.max(15, 'Phone number must be less than 15 characters')
		// .regex(/^\d+$/, 'Phone number must be numeric')
		.optional(),
	birthDate: z
		.string()
		.max(10, 'Birth date must be exactly 10 characters')
		// .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format')
		.optional(),
});
