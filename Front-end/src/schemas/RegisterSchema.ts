import { z } from 'zod';

export const registerSchema = z
	.object({
		email: z.string().email({ message: 'Email inválido' }),
		password: z
			.string()
			.min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
		confirmPassword: z.string().min(6, {
			message: 'A confirmação de senha deve ter no mínimo 6 caracteres',
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas não coincidem',
		path: ['confirmPassword'],
	});
