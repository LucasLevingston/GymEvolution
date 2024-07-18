import { z } from 'zod';

export const UserSchema = z.object({
	nome: z.string().nonempty('Nome é obrigatório'),
	email: z.string().email('Email inválido').nonempty('Email é obrigatório'),
	rua: z.string().nonempty('Rua é obrigatória'),
	numero: z.string().nonempty('Número é obrigatório'),
	cep: z.string().nonempty('CEP é obrigatório'),
	cidade: z.string().nonempty('Cidade é obrigatória'),
	estado: z.string().nonempty('Estado é obrigatório'),
	sexo: z.string().nonempty('Sexo é obrigatório'),
	telefone: z.string().nonempty('Número de telefone é obrigatório'),
	nascimento: z.string().nonempty('Data de nascimento é obrigatória'),
});
