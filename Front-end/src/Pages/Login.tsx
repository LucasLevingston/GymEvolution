import React from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { IoEyeOutline, IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';
import Container from '@/components/Container';

export default function Login() {
	const [senhaVisivel, setSenhaVisivel] = useState(false);
	const toggleShowPassword = () => {
		setSenhaVisivel(!senhaVisivel);
	};
	const [email, setEmail] = useState('');
	const [password, setSenha] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useUser();

	const handleLogin = async () => {
		setLoading(true);
		const result = await login(email, password);
		if (result) {
			toast.success('Login efetuado com sucesso!');
			setTimeout(() => {
				window.location.href = '/';
			}, 2000);
			setLoading(false);
		} else {
			setLoading(false);
			toast.error('Email ou senha inválidos');
		}
	};

	return (
		<Container>
			<div className="flex h-full w-full items-center justify-center pt-10">
				<Tabs defaultValue="account" className="w-[400px]">
					<TabsList className="grid w-full bg-cinzaEscuro">
						<Label className="text-2xl text-white">Entrar na sua conta</Label>
					</TabsList>
					<TabsContent value="account">
						<Card>
							<CardHeader>
								<CardTitle>Login</CardTitle>
								<CardDescription></CardDescription>
							</CardHeader>
							<form>
								<CardContent className="space-y-2">
									<div className="space-y-1">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											required
											autoComplete="email"
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									<div className="space-y-1">
										<Label htmlFor="senha">Senha</Label>
										<div className="flex">
											<Input
												type={senhaVisivel ? 'text' : 'password'}
												required
												autoComplete="current-password"
												minLength={8}
												onChange={(e) => setSenha(e.target.value)}
											/>
											<button
												onClick={toggleShowPassword}
												className="pl-3"
												type="button"
											>
												{senhaVisivel ? (
													<IoEyeOutline className="h-7 w-7" />
												) : (
													<IoEyeSharp className="h-7 w-7" />
												)}
											</button>
										</div>
									</div>
								</CardContent>
							</form>
							<CardFooter className="flex flex-col items-center justify-center">
								{loading ? (
									<Button disabled>
										<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
										Carregando...
									</Button>
								) : (
									<Button
										variant="outline"
										onClick={async () => {
											handleLogin();
										}}
									>
										Entrar
									</Button>
								)}
								<br />
								<Link
									to="/redefinir-senha"
									className="text-[12px] text-mainColor"
								>
									Esqueceu a senha? Clique aqui para recuperar
								</Link>
							</CardFooter>
							<CardFooter className="flex flex-col items-center justify-center">
								<Label>Não possui conta?</Label>
								<Link
									to="/cadastro-usuario"
									className="text-[12px] text-mainColor"
								>
									Fazer cadastro aqui!
								</Link>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</Container>
	);
}
