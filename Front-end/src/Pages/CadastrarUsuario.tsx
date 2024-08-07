import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IoEyeOutline, IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';
import { z } from 'zod';
import { registerSchema } from '@/schemas/RegisterSchema';
import Container from '@/components/Container';

export default function CadastroUsuario() {
	const [passwordVisisvel, setPasswordVisivel] = useState(false);
	const [carregando, setCarregando] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmarPassword] = useState('');
	const [passwordTocada, setPasswordTocada] = useState(false);
	const [passwordsDiferentes, setPasswordsDiferentes] = useState(false);

	const { criarUsuario } = useUser();

	const alterarPasswordVisivel = () => {
		setPasswordVisivel(!passwordVisisvel);
	};

	function validarPassword() {
		if (!passwordTocada) return true;

		if (password !== confirmPassword) return false;

		const expressaoMaiuscula = /[A-Z]/;
		const expressaoCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;

		const tamanhoValido = password.length >= 8 && confirmPassword.length >= 8;
		const maiusculaValida =
			expressaoMaiuscula.test(password) &&
			expressaoMaiuscula.test(confirmPassword);
		const caracterEspecialValido =
			expressaoCaracterEspecial.test(password) &&
			expressaoCaracterEspecial.test(confirmPassword);

		return tamanhoValido && maiusculaValida && caracterEspecialValido;
	}

	async function handleCadastrar(event: React.FormEvent) {
		event.preventDefault();
		setCarregando(true);
		try {
			const validacao = validarPassword();
			if (!validacao) {
				setPasswordsDiferentes(true);
				toast.error('As senhas devem ser iguais e atender aos requisitos.');
				return;
			} else setPasswordsDiferentes(false);

			registerSchema.parse({
				email,
				password: password,
				confirmPassword: confirmPassword,
			});

			const response = await criarUsuario(email, password);
			if (response) {
				toast.success('Usuário cadastrado com sucesso!');
				setTimeout(() => {
					window.location.href = '/login';
				}, 2000);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(
					'Erro de validação: ' +
						error.errors.map((err) => err.message).join(', ')
				);
			} else {
				if (error === 'Error: User already exists') {
					toast.error(`Erro ao realizar cadastro: Usuário já cadastrado.`);
				} else {
					toast.error(`Erro ao realizar cadastro: ${error}`);
				}
			}
		} finally {
			setCarregando(false);
		}
	}

	return (
		<Container>
			<div className="flex h-full w-full items-center justify-center pt-10">
				<Tabs defaultValue="account" className="w-[400px]">
					<TabsList className="grid w-full bg-cinzaEscuro">
						<Label className="text-2xl text-white">Cadastrar</Label>
					</TabsList>
					<TabsContent value="account">
						<Card>
							<CardHeader>
								<CardTitle>Cadastro</CardTitle>
								<CardDescription></CardDescription>
							</CardHeader>
							<form onSubmit={handleCadastrar}>
								<CardContent className="space-y-2">
									<div className="space-y-1">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											required
											autoComplete="email"
											defaultValue=""
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									<div className="space-y-1">
										<Label htmlFor="password">Senha</Label>
										<div className="flex">
											<Input
												id="password"
												type={passwordVisisvel ? 'text' : 'password'}
												required
												minLength={8}
												value={password}
												autoComplete="new-password"
												onChange={(e) => {
													setPassword(e.target.value);
													setPasswordTocada(true);
												}}
												onBlur={() => setPasswordTocada(true)}
											/>
											<button
												onClick={alterarPasswordVisivel}
												className="pl-3"
												type="button"
											>
												{passwordVisisvel ? (
													<IoEyeOutline className="h-7 w-7" />
												) : (
													<IoEyeSharp className="h-7 w-7" />
												)}
											</button>
										</div>
									</div>
									<div className="space-y-1">
										<Label htmlFor="password">Confirmar senha</Label>
										<div className="flex">
											<Input
												id="confirmPassword"
												type={passwordVisisvel ? 'text' : 'password'}
												required
												autoComplete="new-password"
												minLength={8}
												value={confirmPassword}
												onChange={(e) => {
													setConfirmarPassword(e.target.value);
													setPasswordTocada(true);
												}}
												onBlur={() => setPasswordTocada(true)}
											/>
											<button
												onClick={alterarPasswordVisivel}
												className="pl-3"
												type="button"
											>
												{passwordVisisvel ? (
													<IoEyeOutline className="h-7 w-7" />
												) : (
													<IoEyeSharp className="h-7 w-7" />
												)}
											</button>
										</div>
										{passwordsDiferentes && (
											<p className="text-xs text-vermelho">
												As senhas devem ser iguais e ter no mínimo 8 caracteres,
												sendo uma maiúscula e uma especial.
											</p>
										)}
									</div>
								</CardContent>
								<CardFooter className="flex flex-col items-center justify-center">
									{carregando ? (
										<Button disabled>
											<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
											Carregando...
										</Button>
									) : (
										<Button variant="outline" type="submit">
											Cadastrar
										</Button>
									)}
									<br />
									<p className="text-sm">Já possui cadastro?</p>
									<Link to="/login" className="text-[12px] text-mainColor">
										Faça o Login aqui
									</Link>
								</CardFooter>
							</form>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</Container>
	);
}
