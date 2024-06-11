import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useState } from 'react';
import { IoEyeOutline, IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { ReloadIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import Header from '@/components/Header';
import useUser from '@/hooks/user-hooks';

export default function CadastroUsuario() {
	const [senhaVisisvel, setSenhaVisivel] = useState(false);
	const [carregando, setCarregando] = useState(false);
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [confirmarSenha, setConfirmarSenha] = useState('');
	const [senhaTocada, setSenhaTocada] = useState(false);

	const { criarUsuario } = useUser();

	const alterarSenhaVisivel = () => {
		setSenhaVisivel(!senhaVisisvel);
	};

	function validarSenha() {
		if (!senhaTocada) return true;

		if (senha !== confirmarSenha) return false;

		const expressaoMaiuscula = /[A-Z]/;
		const expressaoCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;

		const tamanhoValido = senha.length >= 8 && confirmarSenha.length >= 8;
		const maiusculaValida =
			expressaoMaiuscula.test(senha) && expressaoMaiuscula.test(confirmarSenha);
		const caracterEspecialValido =
			expressaoCaracterEspecial.test(senha) &&
			expressaoCaracterEspecial.test(confirmarSenha);

		return tamanhoValido && maiusculaValida && caracterEspecialValido;
	}
	async function handleCadastrar(email: string, senha: string) {
		setCarregando(!carregando);
		const result = await criarUsuario(email, senha);
		if (!result) {
			toast.error('Erro ao cadastrar');
			setCarregando(!carregando);
		}
		if (result) {
			toast.success('Usuário Cadastrado!');
			setCarregando(!carregando);
			setTimeout(() => {
				window.location.href = '/';
			}, 2000);
		}
	}

	// if (error) {
	//    toast.error(`Erro ao realizar cadastro: ${error}`);
	//    setTimeout(() => {
	//       window.location.href = '/';
	//    }, 2000);
	// }

	return (
		<div>
			<Header />
			<div className="flex h-full w-full items-center justify-center pt-10">
				<Tabs defaultValue="account" className="w-[400px]">
					<TabsList className="grid w-full ">
						<TabsTrigger value="account" className="text-2xl">
							Criar conta
						</TabsTrigger>
					</TabsList>
					<TabsContent value="account">
						<Card>
							<CardHeader>
								<CardTitle>Cadastro</CardTitle>
								<CardDescription></CardDescription>
							</CardHeader>
							<form>
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
										<Label htmlFor="senha">Senha</Label>
										<div className="flex">
											<Input
												id="senha"
												type={senhaVisisvel ? 'text' : 'password'}
												required
												minLength={8}
												value={senha}
												autoComplete="new-password"
												onChange={(e) => {
													setSenha(e.target.value);
													setSenhaTocada(true);
												}}
												onBlur={() => setSenhaTocada(true)}
											/>
											<button
												onClick={alterarSenhaVisivel}
												className="pl-3"
												type="button"
											>
												{senhaVisisvel ? (
													<IoEyeOutline className="h-7 w-7" />
												) : (
													<IoEyeSharp className="h-7 w-7" />
												)}
											</button>
										</div>
									</div>
									<div className="space-y-1">
										<Label htmlFor="senha">Confirmar senha</Label>
										<div className="flex">
											<Input
												id="confirmarSenha"
												type={senhaVisisvel ? 'text' : 'password'}
												required
												autoComplete="new-password"
												minLength={8}
												value={confirmarSenha}
												onChange={(e) => {
													setConfirmarSenha(e.target.value);
													setSenhaTocada(true);
												}}
												onBlur={() => setSenhaTocada(true)}
											/>
											<button
												onClick={alterarSenhaVisivel}
												className="pl-3"
												type="button"
											>
												{senhaVisisvel ? (
													<IoEyeOutline className="h-7 w-7" />
												) : (
													<IoEyeSharp className="h-7 w-7" />
												)}
											</button>
										</div>
										{!validarSenha() && (
											<p className="text-xs text-vermelho">
												As senhas devem ser iguais e ter no mínimo 8 caracteres,
												sendo uma maiúscula e uma especial.
											</p>
										)}
									</div>
								</CardContent>
							</form>
							<CardFooter className="flex flex-col items-center justify-center">
								{carregando ? (
									<Button disabled>
										<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
										Carregando...
									</Button>
								) : validarSenha() ? (
									<Button
										variant="outline"
										onClick={() => handleCadastrar(email, senha)}
									>
										Cadastrar
									</Button>
								) : (
									<Button disabled variant="destructive">
										Senha inválida.
									</Button>
								)}
								<br />
								<p className="text-sm">Ja possui cadastro?</p>
								<Link to="/login" className="text-[12px] text-mainColor">
									Faça o Login aqui
								</Link>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
